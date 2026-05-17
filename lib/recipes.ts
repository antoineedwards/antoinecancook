import { getDb } from "./mongodb";
import type { Recipe, RecipeDoc } from "./types";
import { ObjectId } from "mongodb";

/** Serialise a MongoDB document: ObjectId → string, Date → ISO string */
function serialise(doc: Recipe & { _id: ObjectId }): RecipeDoc {
  return {
    ...doc,
    _id: doc._id.toString(),
    publishedAt: doc.publishedAt instanceof Date ? doc.publishedAt : new Date(doc.publishedAt),
  };
}

/** Fetch all recipes, newest first */
export async function getAllRecipes(): Promise<RecipeDoc[]> {
  const db = await getDb();
  const docs = await db
    .collection<Recipe>("recipes")
    .find({})
    .sort({ publishedAt: -1 })
    .toArray();
  return docs.map((d) => serialise(d as Recipe & { _id: ObjectId }));
}

/** Fetch featured recipes (for hero / homepage spotlight) */
export async function getFeaturedRecipes(limit = 3): Promise<RecipeDoc[]> {
  const db = await getDb();
  const docs = await db
    .collection<Recipe>("recipes")
    .find({ featured: true })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .toArray();
  return docs.map((d) => serialise(d as Recipe & { _id: ObjectId }));
}

/** Fetch recent recipes for the homepage grid */
export async function getRecentRecipes(limit = 9): Promise<RecipeDoc[]> {
  const db = await getDb();
  const docs = await db
    .collection<Recipe>("recipes")
    .find({})
    .sort({ publishedAt: -1 })
    .limit(limit)
    .toArray();
  return docs.map((d) => serialise(d as Recipe & { _id: ObjectId }));
}

/** Fetch a single recipe by its slug */
export async function getRecipeBySlug(slug: string): Promise<RecipeDoc | null> {
  const db = await getDb();
  const doc = await db.collection<Recipe>("recipes").findOne({ slug });
  if (!doc) return null;
  return serialise(doc as Recipe & { _id: ObjectId });
}

/** Fetch recipes filtered by a flat category */
export async function getRecipesByCategory(category: string): Promise<RecipeDoc[]> {
  const db = await getDb();
  const docs = await db
    .collection<Recipe>("recipes")
    .find({ categories: category })
    .sort({ publishedAt: -1 })
    .toArray();
  return docs.map((d) => serialise(d as Recipe & { _id: ObjectId }));
}

/** Fetch recipes filtered by cuisine */
export async function getRecipesByCuisine(cuisine: string): Promise<RecipeDoc[]> {
  const db = await getDb();
  const docs = await db
    .collection<Recipe>("recipes")
    .find({ cuisine: cuisine.toLowerCase() })
    .sort({ publishedAt: -1 })
    .toArray();
  return docs.map((d) => serialise(d as Recipe & { _id: ObjectId }));
}

/** Fetch recipes filtered by main ingredient */
export async function getRecipesByIngredient(ingredient: string): Promise<RecipeDoc[]> {
  const db = await getDb();
  const docs = await db
    .collection<Recipe>("recipes")
    .find({ mainIngredient: ingredient.toLowerCase() })
    .sort({ publishedAt: -1 })
    .toArray();
  return docs.map((d) => serialise(d as Recipe & { _id: ObjectId }));
}

/** Get all distinct cuisine values (for dynamic nav) */
export async function getDistinctCuisines(): Promise<string[]> {
  const db = await getDb();
  const values = await db.collection<Recipe>("recipes").distinct("cuisine");
  return values.filter(Boolean).sort() as string[];
}

/** Get all distinct main ingredient values (for dynamic nav) */
export async function getDistinctIngredients(): Promise<string[]> {
  const db = await getDb();
  const values = await db.collection<Recipe>("recipes").distinct("mainIngredient");
  return values.filter(Boolean).sort() as string[];
}

/** Full-text search across title, description, tags */
export async function searchRecipes(query: string): Promise<RecipeDoc[]> {
  const db = await getDb();
  const docs = await db
    .collection<Recipe>("recipes")
    .find({ $text: { $search: query } })
    .sort({ publishedAt: -1 })
    .toArray();
  return docs.map((d) => serialise(d as Recipe & { _id: ObjectId }));
}
