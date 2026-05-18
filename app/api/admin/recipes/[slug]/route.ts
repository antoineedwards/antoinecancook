import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { deleteObject } from "@/lib/r2";
import type { Recipe } from "@/lib/types";

// ── PUT /api/admin/recipes/[slug] — full update ──────────────
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const body = await req.json();
  const db = await getDb();

  const update: Partial<Recipe> = {
    title: body.title,
    description: body.description ?? "",
    categories: body.categories ?? [],
    cuisine: body.cuisine ?? "",
    mainIngredient: body.mainIngredient ?? "",
    tags: body.tags ?? [],
    ingredients: body.ingredients ?? [],
    instructions: body.instructions ?? [],
    notes: body.notes ?? "",
    heroImage: body.heroImage ?? "",
    gallery: body.gallery ?? [],
    featured: body.featured ?? false,
    publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
  };

  await db
    .collection<Recipe>("recipes")
    .updateOne({ slug }, { $set: update });

  return NextResponse.json({ slug });
}

// ── DELETE /api/admin/recipes/[slug] — delete + R2 cleanup ──
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const db = await getDb();

  const recipe = await db.collection<Recipe>("recipes").findOne({ slug });

  if (recipe?.heroImage) {
    try {
      await deleteObject(recipe.heroImage);
    } catch {
      // Best-effort R2 cleanup — don't block deletion
    }
  }

  await db.collection<Recipe>("recipes").deleteOne({ slug });
  return NextResponse.json({ ok: true });
}

// ── PATCH /api/admin/recipes/[slug] — partial update (e.g. featured) ──
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const body = await req.json();
  const db = await getDb();

  const update: Record<string, any> = {};
  if (typeof body.featured === "boolean") {
    update.featured = body.featured;
  }

  if (Object.keys(update).length > 0) {
    await db
      .collection<Recipe>("recipes")
      .updateOne({ slug }, { $set: update });
  }

  return NextResponse.json({ ok: true });
}
