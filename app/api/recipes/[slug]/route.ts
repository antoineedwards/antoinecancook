import { NextRequest, NextResponse } from "next/server";
import { getRecipeBySlug } from "@/lib/recipes";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const recipe = await getRecipeBySlug(slug);
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }
    return NextResponse.json({ recipe });
  } catch (error) {
    console.error("[GET /api/recipes/[slug]]", error);
    return NextResponse.json({ error: "Failed to fetch recipe" }, { status: 500 });
  }
}
