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

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const applicationId = url.searchParams.get("application_id");
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!applicationId) return NextResponse.json({ error: "application_id required" }, { status: 400 });
    if (!(await verifyAdmin(token))) return NextResponse.json({ error: "unauthorized" }, { status: 403 });

    const admin = getAdminClient();
    const { data: app, error } = await admin.from("career_applications").select("resume_path,resume_name,resume_url").eq("id", applicationId).maybeSingle();
    if (error) throw error;
    if (!app) return NextResponse.json({ error: "application not found" }, { status: 404 });

    let signedUrl = null;
    if (app.resume_url && app.resume_url.startsWith("http")) {
      signedUrl = app.resume_url;
    } else if (app.resume_path) {
      const { data } = await admin.storage.from("career-resumes").createSignedUrl(app.resume_path, 60 * 5);
      signedUrl = data?.signedUrl || null;
    }

    if (!signedUrl) return NextResponse.json({ error: "no resume available" }, { status: 404 });

    // proxy the file so the signed URL is not exposed
    const r = await fetch(signedUrl);
    if (!r.ok) return NextResponse.json({ error: "failed to fetch file" }, { status: 500 });
    const headers = new Headers();
    headers.set("Content-Type", r.headers.get("content-type") || "application/octet-stream");
    const filename = app.resume_name || "resume";
    headers.set("Content-Disposition", `attachment; filename="${filename.replace(/\"/g, "\"")}"`);
    return new NextResponse(r.body, { headers });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
