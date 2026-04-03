import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";
import { validate, itemCreateSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const supabase = getServiceSupabase();

  const { searchParams } = new URL(req.url);
  const bureau = searchParams.get("bureau");
  const itemType = searchParams.get("item_type");

  let query = supabase
    .from("credit_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (bureau) query = query.eq("bureau", bureau);
  if (itemType) query = query.eq("item_type", itemType);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ items: data });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const supabase = getServiceSupabase();

  try {
    const body = await req.json();
    const parsed = validate(itemCreateSchema, body);
    if ('error' in parsed) return parsed.error;
    const {
      bureaus,
      item_type,
      creditor_name,
      account_number,
      balance,
      original_balance,
      date_opened,
      date_reported,
      status,
      collector_name,
      collector_address,
      remarks,
      is_medical,
      late_payment_dates,
      inquiry_date,
      inquiry_creditor,
      user_notes,
    } = parsed.data;

    // Accept an array of bureaus to create one item per bureau
    const bureauList: string[] = Array.isArray(bureaus) ? bureaus : [bureaus];

    const records = bureauList.map((bureau: string) => ({
      user_id: userId,
      bureau,
      item_type,
      creditor_name,
      account_number,
      balance,
      original_balance,
      date_opened,
      date_reported,
      status,
      collector_name,
      collector_address,
      remarks,
      is_medical: is_medical ?? false,
      late_payment_dates,
      inquiry_date,
      inquiry_creditor,
      user_notes,
    }));

    const { data, error } = await supabase
      .from("credit_items")
      .insert(records)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ items: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
