import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getAdminClient() {
  if (!SUPABASE_URL || !SERVICE_ROLE) throw new Error("Missing Supabase service env vars");
  return createClient(SUPABASE_URL, SERVICE_ROLE);
}

async function verifyAdmin(token) {
  if (!token) return false;
  const admin = getAdminClient();
  try {
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) return false;
    const userId = userData.user.id;
    const { data, error } = await admin.from("admin_users").select("user_id").eq("user_id", userId).maybeSingle();
    if (error) return false;
    return !!data;
  } catch (e) {
    return false;
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const applicationId = body?.application_id;
    const status = body?.status;
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!applicationId || !status) return NextResponse.json({ error: "application_id and status required" }, { status: 400 });
    if (!(await verifyAdmin(token))) return NextResponse.json({ error: "unauthorized" }, { status: 403 });

    const admin = getAdminClient();
    const { error } = await admin.from("career_applications").update({ status }).eq("id", applicationId);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
