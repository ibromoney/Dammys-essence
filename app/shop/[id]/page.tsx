
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductDetails from "./ProductDetails";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("id, name, type, category, price, image, description, size")
    .eq("id", Number(id))
    .single();

  if (error || !product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
