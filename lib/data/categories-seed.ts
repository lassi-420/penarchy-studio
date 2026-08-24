import type { Category } from "@/lib/types";

// Initial category set. Editable later via /admin/categories — nothing here
// is hardcoded into the storefront UI, this file is only the seed payload.
export const categoriesSeed: Omit<Category, "productCount">[] = [
  { id: "cat_damascus_pen", name: "Damascus Pen", slug: "damascus-pen", ageRestricted: false, featured: true, visible: true, sortOrder: 1, description: "Fountain, rollerball and ballpoint pens forged from patterned Damascus steel." },
  { id: "cat_hunting_knife", name: "Hunting Knife", slug: "hunting-knife", ageRestricted: true, featured: false, visible: true, sortOrder: 2, description: "Hand-forged fixed and folding blades." },
  { id: "cat_damascus_ornament", name: "Damascus Ornament", slug: "damascus-ornament", ageRestricted: false, featured: false, visible: true, sortOrder: 3, description: "Small decorative Damascus steel objects." },
  { id: "cat_damascus_bracelet", name: "Damascus Bracelet", slug: "damascus-bracelet", ageRestricted: false, featured: true, visible: true, sortOrder: 4, description: "Cuffs and bangles forged from layered Damascus steel." },
  { id: "cat_smoking_accessories", name: "Smoking Accessories", slug: "smoking-accessories", ageRestricted: true, featured: false, visible: true, sortOrder: 5, description: "Selected handcrafted smoking accessories." },
  { id: "cat_steel_bracelet", name: "Steel Bracelet", slug: "steel-bracelet", ageRestricted: false, featured: true, visible: true, sortOrder: 6, description: "Hammered and mirror-polished stainless steel cuffs." },
  { id: "cat_copper_bracelet", name: "Copper Bracelet", slug: "copper-bracelet", ageRestricted: false, featured: false, visible: true, sortOrder: 7, description: "Warm-toned copper cuffs that patina with age." },
  { id: "cat_timascus_bracelet", name: "Timascus Bracelet", slug: "timascus-bracelet", ageRestricted: false, featured: false, visible: true, sortOrder: 8, description: "Rare titanium-damascus (Timascus) bracelets." },
  { id: "cat_limited_edition_pens", name: "Limited Edition Pens", slug: "limited-edition-pens", ageRestricted: false, featured: true, visible: true, sortOrder: 9, description: "Small-batch pens released in strictly limited runs." },
  { id: "cat_brass_pen", name: "Brass Pen", slug: "brass-pen", ageRestricted: false, featured: false, visible: true, sortOrder: 10, description: "Solid brass writing instruments that age into a warm patina." },
  { id: "cat_brass_bracelet", name: "Brass Bracelet", slug: "brass-bracelet", ageRestricted: false, featured: false, visible: true, sortOrder: 11, description: "Hand-formed brass cuffs and bangles." },
  { id: "cat_beaded_bracelet", name: "Beaded Bracelet", slug: "beaded-bracelet", ageRestricted: false, featured: false, visible: true, sortOrder: 12, description: "Mixed metal and bead bracelets." },
];
