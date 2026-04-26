import { NextResponse } from "next/server";
import { getHospitalChatReply } from "@/lib/hospital-chat";

export async function POST(request) {
  try {
    const body = await request.json();
    const message = body?.message || "";
    const lastTopic = body?.lastTopic || "contact";

    const reply = getHospitalChatReply(message, lastTopic);

    return NextResponse.json(reply);
  } catch {
    return NextResponse.json(
      {
        text: "The assistant is temporarily unavailable. Please try again in a moment.",
        actionLabel: "Book appointment",
        actionTarget: "contact",
        nextTopic: "contact",
      },
      { status: 500 }
    );
  }
}
