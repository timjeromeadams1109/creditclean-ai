import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";
import { generateLetterPDF } from "@/lib/pdf/generate";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import type { LetterPDFProps } from "@/lib/pdf/letter-pdf";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ roundId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;

  // Rate limit
  const rl = checkRateLimit(userId, "pdf");
  if (!rl.allowed) return rateLimitResponse(rl);

  const { roundId } = await params;
  const supabase = getServiceSupabase();

  try {
    // Fetch the dispute round
    const { data: roundData, error: roundError } = await supabase
      .from("dispute_rounds")
      .select("*, dispute_letters(*)")
      .eq("id", roundId)
      .eq("user_id", userId)
      .single();

    if (roundError || !roundData) {
      return NextResponse.json(
        { error: "Dispute round not found" },
        { status: 404 }
      );
    }

    // Get the letter content
    const letters = roundData.dispute_letters as Record<string, unknown>[];
    const letter = letters && letters.length > 0 ? letters[0] : null;

    if (!letter) {
      return NextResponse.json(
        { error: "No letter found for this dispute round" },
        { status: 404 }
      );
    }

    // Fetch user profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("full_name, email, user_details")
      .eq("id", userId)
      .single();

    if (!profileData) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Build sender info from profile
    const details =
      (profileData.user_details as Record<string, unknown>) ?? {};
    const nameParts = (profileData.full_name ?? "").split(" ");
    const senderName = profileData.full_name ?? "Consumer";

    // Format the date
    const dateSent = roundData.date_sent
      ? new Date(roundData.date_sent as string).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

    // Build the Re: line
    const recipientName = (letter.recipient_name as string) ?? "Credit Bureau";
    const strategy = (letter.strategy as string) ?? "";
    const itemType = (letter.item_type as string) ?? "";
    const reLine = `Re: ${strategy.replace(/_/g, " ").toUpperCase()} — ${itemType.replace(/_/g, " ")}`;

    // Prepare PDF props
    const pdfProps: LetterPDFProps = {
      senderName,
      senderAddress: {
        street: (details.street as string) ?? "",
        city: (details.city as string) ?? "",
        state: (details.state as string) ?? "",
        zip: (details.zip as string) ?? "",
      },
      recipientName,
      recipientAddress: (letter.recipient_address as string) ?? "",
      date: dateSent,
      reLine,
      body: (letter.content as string) ?? "",
      legalBasis: (letter.legal_basis as string[]) ?? [],
      enclosures: [
        "Copy of government-issued photo ID",
        "Copy of Social Security card",
        "Proof of current address (utility bill)",
      ],
      trackingNumber:
        (roundData.tracking_number as string) ?? undefined,
      ssnLast4: (details.ssn_last4 as string) ?? undefined,
      dob: (details.dob as string) ?? undefined,
    };

    // Generate PDF
    const pdfBuffer = await generateLetterPDF(pdfProps);

    // Build filename
    const bureau =
      (roundData.recipient_name as string)
        ?.toLowerCase()
        .replace(/[^a-z0-9]/g, "-") ?? "bureau";
    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `dispute-letter-${bureau}-${dateStr}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to generate letter PDF";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
