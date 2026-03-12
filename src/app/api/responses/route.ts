import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const supabase = getServiceSupabase();

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const disputeRoundId = formData.get("dispute_round_id") as string | null;
    const dateReceived = formData.get("date_received") as string | null;
    const outcome = formData.get("outcome") as string | null;
    const responseText = formData.get("response_text") as string | null;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (!disputeRoundId) {
      return NextResponse.json({ error: "dispute_round_id is required" }, { status: 400 });
    }

    // Verify the dispute round belongs to this user
    const { data: round } = await supabase
      .from("dispute_rounds")
      .select("id, credit_item_id")
      .eq("id", disputeRoundId)
      .eq("user_id", userId)
      .single();

    if (!round) {
      return NextResponse.json({ error: "Dispute round not found" }, { status: 404 });
    }

    // Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop() ?? "pdf";
    const filePath = `${userId}/${disputeRoundId}/${Date.now()}.${fileExt}`;
    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from("responses")
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: `File upload failed: ${uploadError.message}` }, { status: 500 });
    }

    // Create dispute_response record
    const { data: response, error: insertError } = await supabase
      .from("dispute_responses")
      .insert({
        dispute_round_id: disputeRoundId,
        credit_item_id: round.credit_item_id,
        user_id: userId,
        file_path: filePath,
        file_name: file.name,
        file_type: file.type,
        date_received: dateReceived ?? new Date().toISOString().split("T")[0],
        outcome: outcome ?? "pending_analysis",
        response_text: responseText,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ response }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to upload response";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
