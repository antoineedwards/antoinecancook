"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "../admin.module.css";
import { r2Url } from "@/lib/utils";
import type { RecipeDoc } from "@/lib/types";

// ── Types ────────────────────────────────────────────────────
interface IngredientGroup {
  group?: string;
  items: string[];
}

interface InstructionStep {
  step: number;
  text: string;
  image?: string;
}

interface FormData {
  title: string;
  description: string;
  categories: string[];
  cuisine: string;
  mainIngredient: string;
  tags: string;
  notes: string;
  heroImage: string;
  featured: boolean;
  publishedAt: string;
  ingredients: IngredientGroup[];
  instructions: InstructionStep[];
}

const CATEGORIES = [
  { value: "airfryer", label: "Air Fryer" },
  { value: "dinner", label: "Dinner" },
  { value: "vegetarian", label: "Vegetarian" },
];

const CUISINES = [
  { value: "", label: "None / General" },
  { value: "jamaican", label: "Jamaican" },
  { value: "indian", label: "Indian" },
  { value: "italian", label: "Italian" },
];

function toDateInput(d: string | Date | undefined): string {
  if (!d) return new Date().toISOString().slice(0, 10);
  return new Date(d).toISOString().slice(0, 10);
}

function buildInitialForm(recipe?: RecipeDoc): FormData {
  return {
    title: recipe?.title ?? "",
    description: recipe?.description ?? "",
    categories: recipe?.categories ?? [],
    cuisine: recipe?.cuisine ?? "",
    mainIngredient: recipe?.mainIngredient ?? "",
    tags: (recipe?.tags ?? []).join(", "),
    notes: recipe?.notes ?? "",
    heroImage: recipe?.heroImage ?? "",
    featured: recipe?.featured ?? false,
    publishedAt: toDateInput(recipe?.publishedAt),
    ingredients:
      recipe?.ingredients?.length
        ? recipe.ingredients
        : [{ group: "", items: [""] }],
    instructions:
      recipe?.instructions?.length
        ? recipe.instructions
        : [{ step: 1, text: "" }],
  };
}

// ── Image Upload Hook ────────────────────────────────────────
function useImageUpload(slug: string) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");

  const uploadFile = useCallback(
    async (file: File): Promise<string | null> => {
      setUploading(true);
      setProgress("Getting upload URL…");
      try {
        const params = new URLSearchParams({
          filename: file.name,
          type: file.type,
          slug,
        });
        const res = await fetch(`/api/admin/upload-url?${params}`);
        if (!res.ok) throw new Error("Failed to get upload URL");
        const { uploadUrl, key } = await res.json();

        setProgress("Uploading…");
        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });
        if (!uploadRes.ok) throw new Error("Upload failed");
        setProgress("");
        return key as string;
      } catch {
        setProgress("Upload failed");
        return null;
      } finally {
        setUploading(false);
      }
    },
    [slug]
  );

  return { uploading, progress, uploadFile };
}

// ── Main Form Component ──────────────────────────────────────
interface RecipeFormProps {
  recipe?: RecipeDoc;
  mode: "new" | "edit";
}

export default function RecipeForm({ recipe, mode }: RecipeFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(buildInitialForm(recipe));
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"" | "saved" | "error">("");
  const [heroPreview, setHeroPreview] = useState<string | null>(
    recipe?.heroImage ? r2Url(recipe.heroImage) : null
  );

  const slugForUpload = form.title
    ? form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    : "new-recipe";

  const { uploading, progress, uploadFile } = useImageUpload(slugForUpload);

  // ── Field helpers ──────────────────────────────────────────
  function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleCategory(cat: string) {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter((c) => c !== cat)
        : [...f.categories, cat],
    }));
  }

  // ── Ingredient helpers ─────────────────────────────────────
  function addIngredientGroup() {
    setForm((f) => ({
      ...f,
      ingredients: [...f.ingredients, { group: "", items: [""] }],
    }));
  }

  function removeIngredientGroup(gi: number) {
    setForm((f) => ({
      ...f,
      ingredients: f.ingredients.filter((_, i) => i !== gi),
    }));
  }

  function setGroupName(gi: number, value: string) {
    setForm((f) => {
      const ingredients = [...f.ingredients];
      ingredients[gi] = { ...ingredients[gi], group: value };
      return { ...f, ingredients };
    });
  }

  function addIngredientItem(gi: number) {
    setForm((f) => {
      const ingredients = [...f.ingredients];
      ingredients[gi] = { ...ingredients[gi], items: [...ingredients[gi].items, ""] };
      return { ...f, ingredients };
    });
  }

  function setIngredientItem(gi: number, ii: number, value: string) {
    setForm((f) => {
      const ingredients = [...f.ingredients];
      const items = [...ingredients[gi].items];
      items[ii] = value;
      ingredients[gi] = { ...ingredients[gi], items };
      return { ...f, ingredients };
    });
  }

  function removeIngredientItem(gi: number, ii: number) {
    setForm((f) => {
      const ingredients = [...f.ingredients];
      const items = ingredients[gi].items.filter((_, i) => i !== ii);
      ingredients[gi] = { ...ingredients[gi], items };
      return { ...f, ingredients };
    });
  }

  // ── Instruction helpers ────────────────────────────────────
  function addStep() {
    setForm((f) => ({
      ...f,
      instructions: [
        ...f.instructions,
        { step: f.instructions.length + 1, text: "" },
      ],
    }));
  }

  function removeStep(idx: number) {
    setForm((f) => ({
      ...f,
      instructions: f.instructions
        .filter((_, i) => i !== idx)
        .map((s, i) => ({ ...s, step: i + 1 })),
    }));
  }

  function setStepText(idx: number, text: string) {
    setForm((f) => {
      const instructions = [...f.instructions];
      instructions[idx] = { ...instructions[idx], text };
      return { ...f, instructions };
    });
  }

  // ── Hero image upload ──────────────────────────────────────
  async function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setHeroPreview(preview);
    const key = await uploadFile(file);
    if (key) setField("heroImage", key);
  }

  function removeHeroImage() {
    setHeroPreview(null);
    setField("heroImage", "");
  }

  // ── Submit ─────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveStatus("");

    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      ingredients: form.ingredients.map((g) => ({
        ...g,
        items: g.items.filter((i) => i.trim()),
      })),
      instructions: form.instructions.filter((s) => s.text.trim()),
    };

    try {
      let res: Response;
      if (mode === "new") {
        res = await fetch("/api/admin/recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/admin/recipes/${recipe!.slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("Save failed");
      setSaveStatus("saved");
      if (mode === "new") {
        router.push("/admin/dashboard");
      }
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} id="recipe-form">
      <div className={styles.formGrid}>
        {/* ── LEFT COLUMN ──────────────────────────────── */}
        <div>
          {/* Basic Info */}
          <div className={styles.formSection}>
            <h2 className={styles.formSectionTitle}>Basic Info</h2>

            <div className={styles.formField}>
              <label className={styles.formLabel} htmlFor="rf-title">Title</label>
              <input
                id="rf-title"
                className={styles.formInput}
                type="text"
                placeholder="e.g. Jerk Chicken Thighs"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                required
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel} htmlFor="rf-description">
                Description <span className={styles.formLabelOptional}>(optional)</span>
              </label>
              <textarea
                id="rf-description"
                className={styles.formTextarea}
                placeholder="A short description of the recipe…"
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                rows={3}
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Categories</label>
              <div className={styles.checkboxGroup}>
                {CATEGORIES.map((c) => (
                  <label key={c.value} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={form.categories.includes(c.value)}
                      onChange={() => toggleCategory(c.value)}
                    />
                    {c.label}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel} htmlFor="rf-cuisine">Cuisine</label>
              <select
                id="rf-cuisine"
                className={styles.formSelect}
                value={form.cuisine}
                onChange={(e) => setField("cuisine", e.target.value)}
              >
                {CUISINES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel} htmlFor="rf-ingredient">
                Main Ingredient <span className={styles.formLabelOptional}>(optional)</span>
              </label>
              <input
                id="rf-ingredient"
                className={styles.formInput}
                type="text"
                placeholder="e.g. chicken, beef, salmon"
                value={form.mainIngredient}
                onChange={(e) => setField("mainIngredient", e.target.value)}
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel} htmlFor="rf-tags">
                Tags <span className={styles.formLabelOptional}>(comma-separated)</span>
              </label>
              <input
                id="rf-tags"
                className={styles.formInput}
                type="text"
                placeholder="e.g. spicy, quick, weeknight"
                value={form.tags}
                onChange={(e) => setField("tags", e.target.value)}
              />
            </div>
          </div>

          {/* Ingredients */}
          <div className={styles.formSection}>
            <h2 className={styles.formSectionTitle}>Ingredients</h2>

            {form.ingredients.map((group, gi) => (
              <div key={gi} className={styles.builderGroup}>
                <div className={styles.builderGroupHeader}>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder={`Group name (optional, e.g. "Marinade")`}
                    value={group.group ?? ""}
                    onChange={(e) => setGroupName(gi, e.target.value)}
                  />
                  {form.ingredients.length > 1 && (
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => removeIngredientGroup(gi)}
                      aria-label="Remove group"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {group.items.map((item, ii) => (
                  <div key={ii} className={styles.builderItem}>
                    <input
                      className={styles.formInput}
                      type="text"
                      placeholder="e.g. 2 tbsp olive oil"
                      value={item}
                      onChange={(e) => setIngredientItem(gi, ii, e.target.value)}
                    />
                    {group.items.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => removeIngredientItem(gi, ii)}
                        aria-label="Remove item"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  className={styles.addItemBtn}
                  onClick={() => addIngredientItem(gi)}
                >
                  + Add ingredient
                </button>
              </div>
            ))}

            <button
              type="button"
              className={styles.addGroupBtn}
              onClick={addIngredientGroup}
            >
              + Add ingredient group
            </button>
          </div>

          {/* Instructions */}
          <div className={styles.formSection}>
            <h2 className={styles.formSectionTitle}>Instructions</h2>

            {form.instructions.map((step, idx) => (
              <div key={idx} className={styles.stepCard}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNum}>{step.step}</span>
                  {form.instructions.length > 1 && (
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => removeStep(idx)}
                      aria-label={`Remove step ${step.step}`}
                      style={{ marginLeft: "auto" }}
                    >
                      ✕
                    </button>
                  )}
                </div>
                <textarea
                  className={styles.formTextarea}
                  placeholder={`Step ${step.step} instructions…`}
                  value={step.text}
                  onChange={(e) => setStepText(idx, e.target.value)}
                  rows={3}
                />
              </div>
            ))}

            <button
              type="button"
              className={styles.addGroupBtn}
              onClick={addStep}
            >
              + Add step
            </button>
          </div>

          {/* Chef's Notes */}
          <div className={styles.formSection}>
            <h2 className={styles.formSectionTitle}>
              Chef&apos;s Notes <span className={styles.formLabelOptional}>(optional)</span>
            </h2>
            <textarea
              id="rf-notes"
              className={styles.formTextarea}
              placeholder="Tips, variations, or anything worth mentioning…"
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              rows={4}
            />
          </div>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────── */}
        <div>
          {/* Hero Image */}
          <div className={styles.formSection}>
            <h2 className={styles.formSectionTitle}>Hero Image</h2>
            <div
              className={`${styles.imageUploadArea} ${heroPreview ? styles.hasImage : ""}`}
            >
              {heroPreview ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroPreview}
                    alt="Hero preview"
                    className={styles.imagePreview}
                  />
                  <button
                    type="button"
                    className={styles.removeImageBtn}
                    onClick={removeHeroImage}
                    aria-label="Remove hero image"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <>
                  <span className={styles.imageUploadIcon} aria-hidden="true">🖼</span>
                  <p className={styles.imageUploadText}>Click or drag to upload</p>
                  <p className={styles.imageUploadSub}>JPEG, PNG, WebP · Max 10 MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.imageUploadInput}
                    onChange={handleHeroUpload}
                    disabled={uploading}
                    aria-label="Upload hero image"
                  />
                </>
              )}
            </div>
            {progress && <p className={styles.uploadProgress}>{progress}</p>}
          </div>

          {/* Publish Settings */}
          <div className={styles.formSection}>
            <h2 className={styles.formSectionTitle}>Publish</h2>

            <div className={styles.formField}>
              <label className={styles.formLabel} htmlFor="rf-date">Published Date</label>
              <input
                id="rf-date"
                type="date"
                className={styles.formInput}
                value={form.publishedAt}
                onChange={(e) => setField("publishedAt", e.target.value)}
              />
            </div>

            <div className={styles.toggleRow}>
              <span className={styles.toggleLabel}>Featured Recipe</span>
              <label className={styles.toggle} htmlFor="rf-featured">
                <input
                  id="rf-featured"
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setField("featured", e.target.checked)}
                />
                <span className={styles.toggleSlider} />
              </label>
            </div>
          </div>

          {/* Save */}
          <div className={styles.formSection}>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={saving || uploading || !form.title}
              style={{ width: "100%", justifyContent: "center" }}
              id="save-recipe-btn"
            >
              {saving ? "Saving…" : mode === "new" ? "Publish Recipe" : "Save Changes"}
            </button>
            {saveStatus === "saved" && (
              <p className={`${styles.saveStatus} ${styles.success}`}>✓ Saved successfully</p>
            )}
            {saveStatus === "error" && (
              <p className={`${styles.saveStatus} ${styles.error}`}>✗ Save failed. Try again.</p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
