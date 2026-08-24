import type { Category, Collection, Product, Review } from "@/lib/types";
import { categoriesSeed } from "@/lib/data/categories-seed";
import { collectionsSeed } from "@/lib/data/collections-seed";
import { verifiedProductsSeed } from "@/lib/data/products-seed";

// ============================================================================
// DATA REPOSITORY
//
// This is a MOCK provider (in-memory, seeded from the *-seed.ts files) used
// because `npx prisma generate` cannot reach binaries.prisma.sh from this
// sandbox's network. Every function signature here is what a Prisma-backed
// implementation (lib/data/repository.prisma.ts, not yet wired) would also
// expose — so swapping providers is a one-file change, not a UI rewrite.
//
// To switch to real Postgres once you have full internet access:
//   1. npx prisma migrate dev --name init
//   2. npx prisma db seed   (scripts/seed.ts uses these same seed files)
//   3. Replace the bodies below with `prisma.product.findMany(...)` calls.
// ============================================================================

let products: Product[] = [...verifiedProductsSeed];
let categories: Omit<Category, "productCount">[] = [...categoriesSeed];
const collections: Collection[] = collectionsSeed;

function withProductCount(cat: Omit<Category, "productCount">): Category {
  return {
    ...cat,
    productCount: products.filter(
      (p) => p.categorySlug === cat.slug && p.status === "PUBLISHED"
    ).length,
  };
}

export async function listCategories(): Promise<Category[]> {
  return categories
    .filter((c) => c.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(withProductCount);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const cat = categories.find((c) => c.slug === slug);
  return cat ? withProductCount(cat) : null;
}

export async function listCollections(): Promise<Collection[]> {
  return collections.filter((c) => c.visible);
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  return collections.find((c) => c.slug === slug) ?? null;
}

export interface ProductQuery {
  categorySlug?: string;
  collectionSlug?: string;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  limitedEdition?: boolean;
  search?: string;
  sort?: "featured" | "newest" | "price-asc" | "price-desc" | "name-asc" | "best-selling";
  minPrice?: number;
  maxPrice?: number;
}

export async function listProducts(query: ProductQuery = {}): Promise<Product[]> {
  let result = products.filter((p) => p.status === "PUBLISHED");

  if (query.categorySlug) result = result.filter((p) => p.categorySlug === query.categorySlug);
  if (query.collectionSlug) result = result.filter((p) => p.collectionSlugs.includes(query.collectionSlug!));
  if (query.featured) result = result.filter((p) => p.featured);
  if (query.bestSeller) result = result.filter((p) => p.bestSeller);
  if (query.newArrival) result = result.filter((p) => p.newArrival);
  if (query.limitedEdition) result = result.filter((p) => p.limitedEdition);
  if (query.minPrice !== undefined) result = result.filter((p) => p.price >= query.minPrice!);
  if (query.maxPrice !== undefined) result = result.filter((p) => p.price <= query.maxPrice!);

  if (query.search) {
    const q = query.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.materials?.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  switch (query.sort) {
    case "price-asc":
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "best-selling":
      result = [...result].sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller));
      break;
    case "newest":
      result = [...result].sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
      break;
    default:
      result = [...result].sort((a, b) => Number(b.featured) - Number(a.featured));
  }

  return result;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
  return products.filter((p) => product.relatedSlugs.includes(p.slug));
}

export async function searchProducts(q: string): Promise<Product[]> {
  return listProducts({ search: q });
}

// ----------------------------------------------------------------------------
// ADMIN MUTATIONS
// These mutate the in-memory mock store so /admin CRUD works end to end in
// this environment. The store lives in this module's process memory — it
// resets on server restart and isn't shared across serverless instances.
// Swap each of these for a `prisma.product.create/update/delete(...)` call
// once migrations can run; the function signatures are the contract the UI
// already codes against, so admin pages won't need to change.
// ----------------------------------------------------------------------------

export async function adminListProducts(): Promise<Product[]> {
  return products; // includes drafts/archived, unlike listProducts()
}

export async function adminCreateProduct(input: Product): Promise<Product> {
  if (products.some((p) => p.slug === input.slug)) {
    throw new Error(`A product with slug "${input.slug}" already exists`);
  }
  if (products.some((p) => p.sku === input.sku)) {
    throw new Error(`A product with SKU "${input.sku}" already exists`);
  }
  products = [...products, input];
  return input;
}

export async function adminUpdateProduct(
  id: string,
  patch: Partial<Product>
): Promise<Product | null> {
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...patch };
  return products[idx];
}

export async function adminDeleteProduct(id: string): Promise<boolean> {
  const before = products.length;
  products = products.filter((p) => p.id !== id);
  return products.length < before;
}

export async function adminDuplicateProduct(id: string): Promise<Product | null> {
  const source = products.find((p) => p.id === id);
  if (!source) return null;
  const copy: Product = {
    ...source,
    id: `${source.id}_copy_${Date.now()}`,
    name: `${source.name} (Copy)`,
    slug: `${source.slug}-copy-${Date.now()}`,
    sku: `${source.sku}-COPY`,
    status: "DRAFT",
  };
  products = [...products, copy];
  return copy;
}

export async function adminCreateCategory(
  input: Omit<Category, "productCount">
): Promise<Category> {
  if (categories.some((c) => c.slug === input.slug)) {
    throw new Error(`A category with slug "${input.slug}" already exists`);
  }
  categories = [...categories, input];
  return withProductCount(input);
}

export async function adminUpdateCategory(
  id: string,
  patch: Partial<Omit<Category, "productCount">>
): Promise<Category | null> {
  const idx = categories.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  categories[idx] = { ...categories[idx], ...patch };
  return withProductCount(categories[idx]);
}

export async function adminDeleteCategory(id: string): Promise<boolean> {
  const before = categories.length;
  categories = categories.filter((c) => c.id !== id);
  return categories.length < before;
}

// ----------------------------------------------------------------------------
// MEDIA LIBRARY (mock store — swap for prisma.media.* once DB is reachable)
// ----------------------------------------------------------------------------

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  altText?: string;
  width?: number;
  height?: number;
  mimeType?: string;
  createdAt: string;
}

let mediaItems: MediaItem[] = [];

export async function listMedia(): Promise<MediaItem[]> {
  return [...mediaItems].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function createMediaItem(
  item: Omit<MediaItem, "id" | "createdAt">
): Promise<MediaItem> {
  const record: MediaItem = {
    ...item,
    id: `media_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  mediaItems = [...mediaItems, record];
  return record;
}

export async function updateMediaAltText(
  id: string,
  altText: string
): Promise<MediaItem | null> {
  const idx = mediaItems.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  mediaItems[idx] = { ...mediaItems[idx], altText };
  return mediaItems[idx];
}

export async function deleteMediaItem(id: string): Promise<MediaItem | null> {
  const item = mediaItems.find((m) => m.id === id);
  if (!item) return null;
  mediaItems = mediaItems.filter((m) => m.id !== id);
  return item;
}

// ----------------------------------------------------------------------------
// COUPONS (mock store)
// ----------------------------------------------------------------------------

export interface CouponRecord {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  value: number;
  minOrderValue?: number;
  usageLimit?: number;
  active: boolean;
  expiresAt?: string;
}

let coupons: CouponRecord[] = [
  {
    id: "coupon_welcome10",
    code: "WELCOME10",
    type: "PERCENTAGE",
    value: 10,
    active: true,
  },
];

export async function listCoupons(): Promise<CouponRecord[]> {
  return coupons;
}

export async function createCoupon(
  input: Omit<CouponRecord, "id">
): Promise<CouponRecord> {
  if (coupons.some((c) => c.code === input.code)) {
    throw new Error(`Coupon code "${input.code}" already exists`);
  }
  const record: CouponRecord = { ...input, id: `coupon_${Date.now()}` };
  coupons = [...coupons, record];
  return record;
}

export async function updateCoupon(
  id: string,
  patch: Partial<CouponRecord>
): Promise<CouponRecord | null> {
  const idx = coupons.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  coupons[idx] = { ...coupons[idx], ...patch };
  return coupons[idx];
}

export async function deleteCoupon(id: string): Promise<boolean> {
  const before = coupons.length;
  coupons = coupons.filter((c) => c.id !== id);
  return coupons.length < before;
}

// ----------------------------------------------------------------------------
// SHIPPING (mock store)
// ----------------------------------------------------------------------------

export interface ShippingMethodRecord {
  id: string;
  zoneName: string;
  name: string;
  price: number;
  freeShippingThreshold?: number;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  active: boolean;
}

let shippingMethods: ShippingMethodRecord[] = [
  {
    id: "ship_domestic_standard",
    zoneName: "United States",
    name: "Standard Shipping",
    price: 12,
    freeShippingThreshold: 150,
    estimatedDaysMin: 4,
    estimatedDaysMax: 7,
    active: true,
  },
  {
    id: "ship_domestic_express",
    zoneName: "United States",
    name: "Express Shipping",
    price: 28,
    estimatedDaysMin: 1,
    estimatedDaysMax: 2,
    active: true,
  },
];

export async function listShippingMethods(): Promise<ShippingMethodRecord[]> {
  return shippingMethods;
}

export async function createShippingMethod(
  input: Omit<ShippingMethodRecord, "id">
): Promise<ShippingMethodRecord> {
  const record: ShippingMethodRecord = { ...input, id: `ship_${Date.now()}` };
  shippingMethods = [...shippingMethods, record];
  return record;
}

export async function updateShippingMethod(
  id: string,
  patch: Partial<ShippingMethodRecord>
): Promise<ShippingMethodRecord | null> {
  const idx = shippingMethods.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  shippingMethods[idx] = { ...shippingMethods[idx], ...patch };
  return shippingMethods[idx];
}

export async function deleteShippingMethod(id: string): Promise<boolean> {
  const before = shippingMethods.length;
  shippingMethods = shippingMethods.filter((s) => s.id !== id);
  return shippingMethods.length < before;
}

// ----------------------------------------------------------------------------
// REVIEWS (mock store — NO seeded fake reviews, only real submissions)
// ----------------------------------------------------------------------------

let reviews: Review[] = [];

export async function listApprovedReviews(productSlug: string): Promise<Review[]> {
  return reviews.filter((r) => r.productSlug === productSlug && r.status === "APPROVED");
}

export async function adminListReviews(): Promise<Review[]> {
  return [...reviews].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function submitReview(
  input: Omit<Review, "id" | "createdAt" | "status">
): Promise<Review> {
  const record: Review = {
    ...input,
    id: `review_${Date.now()}`,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };
  reviews = [...reviews, record];
  return record;
}

export async function moderateReview(
  id: string,
  status: Review["status"]
): Promise<Review | null> {
  const idx = reviews.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  reviews[idx] = { ...reviews[idx], status };
  return reviews[idx];
}

export async function deleteReview(id: string): Promise<boolean> {
  const before = reviews.length;
  reviews = reviews.filter((r) => r.id !== id);
  return reviews.length < before;
}
