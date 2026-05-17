import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { slugify } from "@/lib/utils";
import type { Recipe } from "@/lib/types";

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const slug = slugify(body.title);

  const recipe: Recipe = {
    slug,
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
    author: "Antoine",
    featured: body.featured ?? false,
    publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
  };

  const db = await getDb();
  try {
    await db.collection<Recipe>("recipes").insertOne(recipe as Recipe & { _id: never });
  } catch (err: unknown) {
    // Duplicate slug
    if (typeof err === "object" && err !== null && "code" in err && (err as { code: number }).code === 11000) {
      return NextResponse.json(
        { error: `A recipe with the slug "${slug}" already exists. Change the title slightly to create a unique slug.` },
        { status: 409 }
      );
    }
    throw err;
  }

  return NextResponse.json({ slug }, { status: 201 });
}
