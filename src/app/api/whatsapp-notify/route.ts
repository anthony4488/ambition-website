import { NextRequest, NextResponse } from "next/server";

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = "1091741484011581";
const TO_NUMBER = "61450205033";

export async function POST(request: NextRequest) {
  try {
    const { name, phone, age, sport } = await request.json();

    if (!WHATSAPP_TOKEN) {
      return NextResponse.json({ error: "WhatsApp not configured" }, { status: 500 });
    }

    await fetch(
      `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: TO_NUMBER,
          type: "text",
          text: {
            body: `🔥 NEW WEBSITE LEAD\n\nName: ${name}\nPhone: ${phone}\nAge: ${age}\nSport: ${sport}`,
          },
        }),
      }
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
