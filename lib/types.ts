// Domain types mirror prisma/schema.prisma field-for-field so that
// lib/data/repository.ts can be backed by either the mock provider (used in
// this environment) or a real Prisma-based provider without touching the UI.

export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  ageRestricted: boolean;
  featured: boolean;
  visible: boolean;
  sortOrder: number;
  productCount: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  visible: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  priceDiff: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  sourceId?: string; // stable Etsy/import id
  isDemoContent?: boolean; // true for seed placeholders, false for verified real listings
  name: string;
  slug: string;
  sku: string;
  categorySlug: string;
  collectionSlugs: string[];

  description: string;
  shortDescription?: string;

  price: number;
  compareAtPrice?: number;
  currency: string;

  materials?: string;
  dimensions?: string;
  weight?: string;
  color?: string;
  finish?: string;
  pattern?: string;
  careInstructions?: string;
  warrantyInfo?: string;
  personalization: boolean;

  status: ProductStatus;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  limitedEdition: boolean;
  ageRestricted: boolean;

  images: ProductImage[];
  variants: ProductVariant[];
  tags: string[];

  inventory: {
    quantity: number;
    reserved: number;
    lowStockThreshold: number;
  };

  seoTitle?: string;
  seoDescription?: string;

  sourceUrl?: string; // link back to original Etsy listing, if migrated

  relatedSlugs: string[];
}

export interface Review {
  id: string;
  productSlug: string;
  rating: number;
  title?: string;
  body: string;
  verifiedPurchase: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  author?: string;
  tags?: string;
  publishedAt?: string;
  published: boolean;
}

export interface HomepageSection {
  key: string;
  title?: string;
  subtitle?: string;
  body?: string;
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
  data?: Record<string, unknown>;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  email: string;
  phone?: string;
  address?: string;
  socials: { platform: string; url: string }[];
  currency: string;
  freeShippingThreshold: number;
}
