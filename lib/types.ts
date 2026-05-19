import { ObjectId } from "mongodb";

// ── Recipe ────────────────────────────────────────────────────
export interface IngredientGroup {
  group?: string;
  items: string[];
}

export interface InstructionStep {
  step: number;
  text: string;
  image?: string; // R2 object key
}

export interface Recipe {
  _id?: ObjectId;
  slug: string;
  title: string;
  description: string;

  // Categorisation
  categories: string[];      // flat: ["airfryer", "dinner", "vegetarian"]
  cuisine?: string;          // "jamaican" | "indian" | "italian" | ...
  mainIngredient?: string;   // "chicken" | "beef" | "salmon" | ...
  tags: string[];            // free-form: ["spicy", "gluten-free"]

  // Content
  ingredients: IngredientGroup[];
  instructions: InstructionStep[];
  notes?: string;

  // Media
  heroImage: string;         // Cloudflare R2 object key
  gallery?: string[];        // additional R2 keys

  // Meta
  author: string;
  featured: boolean;
  publishedAt: Date;

  // Future
  rating?: number;
}

// Serialisable version (ObjectId → string) for passing to Client Components
export interface RecipeDoc extends Omit<Recipe, "_id"> {
  _id: string;
}

// ── Nav Category Config ────────────────────────────────────────
export interface NavCategory {
  slug: string;
  label: string;
  type: "flat" | "grouped";
}

export const FLAT_CATEGORIES: NavCategory[] = [
  { slug: "airfryer", label: "Air Fryer", type: "flat" },
  { slug: "dinner",   label: "Dinners",   type: "flat" },
  { slug: "breakfast", label: "Breakfast", type: "flat"},
  { slug: "dessert", label: "Dessert", type: "flat" },
  { slug: "vegetarian", label: "Vegetarian", type: "flat" },
];
