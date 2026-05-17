import { NextRequest, NextResponse } from "next/server";
import { getAllRecipes } from "@/lib/recipes";

export async function GET(_req: NextRequest) {
  try {
    const recipes = await getAllRecipes();
    return NextResponse.json({ recipes });
  } catch (error) {
    console.error("[GET /api/recipes]", error);
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
  }
}
