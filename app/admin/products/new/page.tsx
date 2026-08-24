import { listCategories } from "@/lib/data/repository";
import { ProductForm } from "@/components/admin/product-form";
import { createProductAction } from "@/app/admin/products/actions";

export default async function NewProductPage() {
  const categories = await listCategories();
  return (
    <div>
      <h1 className="font-display text-3xl mb-8">New Product</h1>
      <ProductForm categories={categories} action={createProductAction} />
    </div>
  );
}
