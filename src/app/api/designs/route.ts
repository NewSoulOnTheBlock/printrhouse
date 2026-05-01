import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { printify } from "@/lib/printify";

export async function POST(req: Request) {
  try {
    const { file_name, contents, store_id } = await req.json();
    if (!file_name || !contents) {
      return NextResponse.json({ ok: false, error: "file_name + contents required" }, { status: 400 });
    }

    const buffer = Buffer.from(contents, "base64");
    const sb = supabaseAdmin();
    const path = `${store_id ?? "anon"}/${Date.now()}-${file_name}`;
    const { error: upErr } = await sb.storage.from("designs").upload(path, buffer, {
      contentType: "image/png", upsert: false,
    });
    if (upErr) throw upErr;
    const { data: pub } = sb.storage.from("designs").getPublicUrl(path);
    const public_url = pub.publicUrl;

    const printifyUpload: any = await printify.uploadImage(file_name, contents);

    await sb.from("designs").insert({
      store_id: store_id ?? null,
      file_name,
      printify_upload_id: String(printifyUpload.id),
      image_url: public_url,
    });

    return NextResponse.json({ ok: true, upload: printifyUpload, public_url });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
