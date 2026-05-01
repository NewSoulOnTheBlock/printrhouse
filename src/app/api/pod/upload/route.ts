import { NextRequest, NextResponse } from "next/server";
import { printify } from "@/lib/printify";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.url) {
      const data = await fetch("https://api.printify.com/v1/uploads/images.json", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ file_name: body.file_name || "upload.png", url: body.url }),
      }).then((r) => r.json());
      return NextResponse.json({ ok: true, upload: data });
    }
    if (body.contents && body.file_name) {
      const data = await printify.uploadImage(body.file_name, body.contents);
      return NextResponse.json({ ok: true, upload: data });
    }
    return NextResponse.json({ ok: false, error: "Provide { url } or { file_name, contents (base64) }" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 502 });
  }
}
