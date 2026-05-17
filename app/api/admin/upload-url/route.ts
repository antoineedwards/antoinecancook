import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getUploadUrl } from "@/lib/r2";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");
  const contentType = searchParams.get("type") ?? "image/jpeg";
  const recipeSlug = searchParams.get("slug") ?? "misc";

  if (!filename) {
    return NextResponse.json({ error: "filename is required" }, { status: 400 });
  }

  const ext = filename.split(".").pop() ?? "jpg";
  const key = `recipes/${slugify(recipeSlug)}/${Date.now()}.${ext}`;
  const uploadUrl = await getUploadUrl(key, contentType);

  return NextResponse.json({ uploadUrl, key });
}
