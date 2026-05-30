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
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!applicationId) return NextResponse.json({ error: "application_id required" }, { status: 400 });
    if (!(await verifyAdmin(token))) return NextResponse.json({ error: "unauthorized" }, { status: 403 });

    const admin = getAdminClient();
    const { data: app, error } = await admin.from("career_applications").select("resume_path").eq("id", applicationId).maybeSingle();
    if (error) throw error;
    if (!app) return NextResponse.json({ error: "application not found" }, { status: 404 });

    if (app.resume_path) {
      const { error: rmErr } = await admin.storage.from("career-resumes").remove([app.resume_path]);
      if (rmErr) console.warn("failed to remove storage object", rmErr.message);
    }

    const { error: delErr } = await admin.from("career_applications").delete().eq("id", applicationId);
    if (delErr) throw delErr;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
