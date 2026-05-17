/**
 * Seed script — populates the MongoDB database with sample recipes.
 * Run with: npx tsx scripts/seed.ts
 *
 * Make sure your .env.local is present and MONGODB_URI is set.
 */

import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB ?? "antoinecancook";

const now = new Date();
const ago = (days: number) => new Date(now.getTime() - days * 86_400_000);

const recipes = [
  {
    slug: "jerk-chicken-thighs",
    title: "Jerk Chicken Thighs",
    description:
      "Fiery, smoky, and deeply marinated — these oven-finished jerk thighs capture the soul of Jamaican street food in your kitchen.",
    categories: ["dinner"],
    cuisine: "jamaican",
    mainIngredient: "chicken",
    tags: ["spicy", "marinated", "bold"],
    heroImage: "",
    gallery: [],
    ingredients: [
      {
        group: "Jerk Marinade",
        items: [
          "4 scotch bonnet peppers, deseeded",
          "6 spring onions, roughly chopped",
          "4 garlic cloves",
          "2 tbsp fresh thyme leaves",
          "2 tbsp soy sauce",
          "2 tbsp brown sugar",
          "1 tbsp allspice",
          "1 tsp cinnamon",
          "1 tsp black pepper",
          "Juice of 2 limes",
          "3 tbsp olive oil",
        ],
      },
      {
        group: "Chicken",
        items: [
          "8 bone-in, skin-on chicken thighs",
          "Salt to taste",
        ],
      },
    ],
    instructions: [
      {
        step: 1,
        text: "Blend all marinade ingredients together until smooth. Taste and adjust heat with extra scotch bonnet or lime juice.",
      },
      {
        step: 2,
        text: "Score the chicken thighs deeply with a knife, then coat thoroughly in the marinade. Cover and refrigerate for at least 4 hours — overnight is best.",
      },
      {
        step: 3,
        text: "Preheat oven to 200°C (400°F). Place chicken on a wire rack over a foil-lined tray. Roast for 35–40 minutes until charred at the edges and cooked through.",
      },
      {
        step: 4,
        text: "Rest for 5 minutes before serving. Serve with rice and peas, fried plantain, or a simple coleslaw.",
      },
    ],
    notes:
      "The longer the marinade, the better. If you can't find scotch bonnets, habaneros work well. For an authentic smoky char, finish under the broiler for the last 3–4 minutes.",
    author: "Antoine",
    featured: true,
    publishedAt: ago(2),
  },
  {
    slug: "crispy-air-fryer-salmon",
    title: "Crispy Air Fryer Salmon",
    description:
      "Perfectly crispy skin, flaky flesh, done in 12 minutes. The air fryer does the heavy lifting so you don't have to.",
    categories: ["airfryer", "dinner"],
    cuisine: undefined,
    mainIngredient: "salmon",
    tags: ["quick", "healthy", "crispy"],
    heroImage: "",
    gallery: [],
    ingredients: [
      {
        items: [
          "4 salmon fillets (skin-on, 180g each)",
          "2 tbsp olive oil",
          "1 tsp smoked paprika",
          "1 tsp garlic powder",
          "½ tsp onion powder",
          "Salt and black pepper",
          "Lemon wedges, to serve",
          "Fresh dill or parsley, to serve",
        ],
      },
    ],
    instructions: [
      {
        step: 1,
        text: "Pat salmon fillets completely dry with paper towels — this is the key to crispy skin.",
      },
      {
        step: 2,
        text: "Brush with olive oil and season with smoked paprika, garlic powder, onion powder, salt, and pepper on all sides.",
      },
      {
        step: 3,
        text: "Preheat air fryer to 200°C (390°F) for 3 minutes. Place salmon skin-side down in the basket.",
      },
      {
        step: 4,
        text: "Cook for 10–12 minutes until the skin is golden and crispy and the flesh flakes easily. No flipping needed.",
      },
      {
        step: 5,
        text: "Serve immediately with lemon wedges and fresh herbs.",
      },
    ],
    notes:
      "Every air fryer runs slightly different — check at 9 minutes if yours runs hot. Don't skip drying the fish; it's what separates crispy from steamed.",
    author: "Antoine",
    featured: false,
    publishedAt: ago(5),
  },
  {
    slug: "butter-chicken",
    title: "Butter Chicken",
    description:
      "Deeply aromatic, velvety, and rich — this slow-cooked butter chicken is the kind of recipe that makes people ask for the recipe.",
    categories: ["dinner"],
    cuisine: "indian",
    mainIngredient: "chicken",
    tags: ["creamy", "aromatic", "slow-cook"],
    heroImage: "",
    gallery: [],
    ingredients: [
      {
        group: "Chicken Marinade",
        items: [
          "800g boneless chicken thighs, cubed",
          "200g full-fat yoghurt",
          "2 tbsp lemon juice",
          "2 tsp garam masala",
          "1 tsp cumin",
          "1 tsp turmeric",
          "1 tsp chilli powder",
          "1 tbsp ginger-garlic paste",
        ],
      },
      {
        group: "Makhani Sauce",
        items: [
          "4 tbsp unsalted butter",
          "1 large onion, finely diced",
          "4 garlic cloves, minced",
          "1 tbsp grated ginger",
          "400g canned crushed tomatoes",
          "1 tbsp tomato paste",
          "2 tsp garam masala",
          "1 tsp cumin",
          "1 tsp coriander powder",
          "200ml double cream",
          "1 tsp sugar",
          "Salt to taste",
        ],
      },
    ],
    instructions: [
      {
        step: 1,
        text: "Mix all marinade ingredients with the chicken. Cover and refrigerate for at least 2 hours.",
      },
      {
        step: 2,
        text: "Cook chicken in a hot pan or grill pan until lightly charred. Set aside — it will finish cooking in the sauce.",
      },
      {
        step: 3,
        text: "In the same pan, melt butter over medium heat. Sauté onion until deeply golden, about 12 minutes.",
      },
      {
        step: 4,
        text: "Add garlic and ginger. Cook 2 minutes. Add all spices and toast for 1 minute. Add tomatoes and tomato paste. Simmer 15 minutes.",
      },
      {
        step: 5,
        text: "Blend the sauce until smooth, then return to the pan. Add cream, sugar, and salt. Stir to combine.",
      },
      {
        step: 6,
        text: "Add the chicken to the sauce. Simmer on low for 15 minutes until the chicken is tender and the sauce coats the back of a spoon.",
      },
      {
        step: 7,
        text: "Finish with a knob of butter stirred in off the heat. Serve with basmati rice and warm naan.",
      },
    ],
    notes:
      "The secret is patience on the onions — they need to be deeply golden, not just softened. That caramelisation is what gives butter chicken its depth.",
    author: "Antoine",
    featured: false,
    publishedAt: ago(10),
  },
  {
    slug: "pasta-alla-norma",
    title: "Pasta alla Norma",
    description:
      "Sicily's greatest pasta — silky fried aubergine, a gutsy tomato sauce, ricotta salata, and fresh basil. Vegetarian and completely satisfying.",
    categories: ["dinner", "vegetarian"],
    cuisine: "italian",
    mainIngredient: "aubergine",
    tags: ["vegetarian", "pasta", "sicilian"],
    heroImage: "",
    gallery: [],
    ingredients: [
      {
        items: [
          "400g rigatoni or penne",
          "2 large aubergines, cubed",
          "100ml olive oil, divided",
          "4 garlic cloves, sliced",
          "800g canned San Marzano tomatoes",
          "1 tsp dried oregano",
          "Pinch of chilli flakes",
          "Large handful of fresh basil",
          "100g ricotta salata (or firm ricotta), grated",
          "Salt and black pepper",
        ],
      },
    ],
    instructions: [
      {
        step: 1,
        text: "Salt the cubed aubergine generously and leave in a colander for 30 minutes. Rinse and pat dry — this removes bitterness and helps it fry instead of steam.",
      },
      {
        step: 2,
        text: "Heat half the olive oil in a wide pan over high heat. Fry aubergine in batches until deep golden on all sides. Drain on paper towels.",
      },
      {
        step: 3,
        text: "Reduce heat to medium. Add remaining oil, then garlic and chilli flakes. Cook 1 minute until fragrant.",
      },
      {
        step: 4,
        text: "Add tomatoes, crushing them with a spoon. Season with salt and oregano. Simmer 20 minutes until reduced and intense.",
      },
      {
        step: 5,
        text: "Cook pasta in well-salted water until just al dente. Reserve a mug of pasta water.",
      },
      {
        step: 6,
        text: "Add drained pasta and most of the aubergine to the sauce. Toss over medium heat, adding pasta water as needed to loosen.",
      },
      {
        step: 7,
        text: "Serve immediately topped with remaining aubergine, torn basil, and generous shavings of ricotta salata.",
      },
    ],
    notes:
      "Don't skip the salting and resting step for the aubergine. It makes the difference between soggy and perfectly caramelised.",
    author: "Antoine",
    featured: false,
    publishedAt: ago(15),
  },
];

async function seed() {
  console.log("🌱 Connecting to MongoDB...");
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const col = db.collection("recipes");

  // Create a text index for search
  await col.createIndex(
    { title: "text", description: "text", tags: "text" },
    { name: "recipe_text_search" }
  );

  // Create slug index for fast lookups
  await col.createIndex({ slug: 1 }, { unique: true });

  console.log("🌱 Inserting sample recipes...");
  for (const recipe of recipes) {
    await col.updateOne(
      { slug: recipe.slug },
      { $set: recipe },
      { upsert: true }
    );
    console.log(`  ✓ ${recipe.title}`);
  }

  console.log(`\n✅ Seeded ${recipes.length} recipes into "${dbName}" collection "recipes".`);
  await client.close();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
