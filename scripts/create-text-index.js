const { MongoClient } = require("mongodb");

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI");
    process.exit(1);
  }
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const dbName = process.env.MONGODB_DB || "antoinecancook";
    const db = client.db(dbName);
    
    // Create text index on important searchable fields
    await db.collection("recipes").createIndex(
      { 
        title: "text", 
        description: "text", 
        cuisine: "text", 
        mainIngredient: "text", 
        categories: "text" 
      },
      { 
        name: "recipe_text_search",
        weights: { title: 10, description: 5, cuisine: 2, mainIngredient: 5, categories: 3 }
      }
    );
    console.log("✅ Successfully created text index on recipes collection.");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.close();
  }
}

main();
