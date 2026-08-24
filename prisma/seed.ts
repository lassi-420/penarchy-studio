/**
 * Prisma seed script. Run with `npx prisma db seed` once DATABASE_URL points
 * at a real, reachable Postgres instance (this sandbox's Prisma engine
 * binaries couldn't be downloaded — see README §2). Uses the exact same seed
 * data as the in-memory mock provider (lib/data/*-seed.ts) so dev/prod parity
 * is guaranteed.
 */
import { PrismaClient } from "@prisma/client";
import { categoriesSeed } from "../lib/data/categories-seed";
import { collectionsSeed } from "../lib/data/collections-seed";
import { verifiedProductsSeed } from "../lib/data/products-seed";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding categories…");
  for (const cat of categoriesSeed) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        ageRestricted: cat.ageRestricted,
        featured: cat.featured,
        visible: cat.visible,
        sortOrder: cat.sortOrder,
      },
    });
  }

  console.log("Seeding collections…");
  for (const col of collectionsSeed) {
    await prisma.collection.upsert({
      where: { slug: col.slug },
      update: {},
      create: {
        name: col.name,
        slug: col.slug,
        description: col.description,
        visible: col.visible,
      },
    });
  }

  console.log("Seeding verified products…");
  for (const p of verifiedProductsSeed) {
    const category = await prisma.category.findUnique({
      where: { slug: p.categorySlug },
    });
    if (!category) {
      console.warn(`Skipping ${p.name} — category ${p.categorySlug} not found`);
      continue;
    }

    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        sourceId: p.sourceId,
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        categoryId: category.id,
        description: p.description,
        shortDescription: p.shortDescription,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        currency: p.currency,
        materials: p.materials,
        dimensions: p.dimensions,
        weight: p.weight,
        color: p.color,
        finish: p.finish,
        pattern: p.pattern,
        careInstructions: p.careInstructions,
        personalization: p.personalization,
        status: p.status,
        featured: p.featured,
        bestSeller: p.bestSeller,
        newArrival: p.newArrival,
        limitedEdition: p.limitedEdition,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        inventory: {
          create: {
            quantity: p.inventory.quantity,
            reserved: p.inventory.reserved,
            lowStockThreshold: p.inventory.lowStockThreshold,
          },
        },
      },
    });

    for (const img of p.images) {
      const media = await prisma.media.create({
        data: { url: img.url, filename: img.id, altText: img.altText },
      });
      await prisma.productImage.create({
        data: {
          productId: product.id,
          mediaId: media.id,
          altText: img.altText,
          sortOrder: img.sortOrder,
        },
      });
    }

    for (const v of p.variants) {
      await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {},
        create: {
          productId: product.id,
          name: v.name,
          sku: v.sku,
          priceDiff: v.priceDiff,
          inStock: v.inStock,
        },
      });
    }
  }

  console.log("Seeding admin user…");
  const passwordHash = await bcrypt.hash("changeme123", 10);
  await prisma.user.upsert({
    where: { email: "admin@penarchystudio.com" },
    update: {},
    create: {
      name: "Studio Admin",
      email: "admin@penarchystudio.com",
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log("  -> admin@penarchystudio.com / changeme123 (rotate immediately)");

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
