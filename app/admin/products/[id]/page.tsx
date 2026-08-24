import { notFound } from "next/navigation";
import { adminListProducts, listCategories } from "@/lib/data/repository";
import { ProductForm } from "@/components/admin/product-form";
import { updateProductAction } from "@/app/admin/products/actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [products, categories] = await Promise.all([
    adminListProducts(),
    listCategories(),
  ]);
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  const boundAction = updateProductAction.bind(null, id);

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Edit Product</h1>
      <ProductForm product={product} categories={categories} action={boundAction} />
    </div>
  );
}
