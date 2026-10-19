"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownUp,
  Check,
  ChevronDown,
  Glasses,
  LayoutDashboard,
  LogOut,
  Package,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Product = {
  id: number;
  name: string;
  type: "fragrance" | "sunglasses";
  category: string;
  price: number;
  image: string;
  description: string;
  size?: string | null;
};

type ProductFormProps = {
  mode: "add" | "edit";
  values: {
    name: string;
    type: "fragrance" | "sunglasses";
    category: string;
    price: string;
    description: string;
    size: string;
    imagePreview: string;
    image: File | null;
  };
  setName: (value: string) => void;
  setType: (value: "fragrance" | "sunglasses") => void;
  setCategory: (value: string) => void;
  setPrice: (value: string) => void;
  setDescription: (value: string) => void;
  setSize: (value: string) => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  busy: boolean;
  error: string;
};

const inputClass =
  "mt-2 w-full rounded-xl border border-[#eaddec] bg-white px-4 py-3 text-sm text-[#41004C] outline-none transition placeholder:text-[#41004C]/30 focus:border-[#750080] focus:ring-4 focus:ring-[#750080]/10 disabled:opacity-60";

function ProductFormModal({
  mode,
  values,
  setName,
  setType,
  setCategory,
  setPrice,
  setDescription,
  setSize,
  onImageChange,
  onClose,
  onSubmit,
  busy,
  error,
}: ProductFormProps) {
  const isEdit = mode === "edit";

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-[#200025]/60 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <section className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-white/60 bg-[#fffaff] shadow-2xl shadow-[#200025]/30">
        <header className="flex items-center justify-between border-b border-[#eaddec] px-5 py-4 sm:px-7">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#750080]">
              Dammys Essence · Catalog
            </p>
            <h2 className="mt-1 font-serif text-2xl text-[#41004C]">
              {isEdit ? "Edit product" : "Add a product"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close form"
            className="grid h-10 w-10 place-items-center rounded-full text-[#41004C]/60 transition hover:bg-[#f6eaf8] hover:text-[#750080]"
          >
            <X size={19} />
          </button>
        </header>

        <form onSubmit={onSubmit} className="overflow-y-auto">
          <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-[1fr_0.82fr]">
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-[#41004C]">
                Product name
                <input
                  className={inputClass}
                  value={values.name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Royal Oud"
                  required
                  disabled={busy}
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-semibold text-[#41004C]">
                  Product type
                  <select
                    className={inputClass}
                    value={values.type}
                    onChange={(event) =>
                      setType(event.target.value as "fragrance" | "sunglasses")
                    }
                    disabled={busy}
                  >
                    <option value="fragrance">Fragrance</option>
                    <option value="sunglasses">Sunglasses</option>
                  </select>
                </label>
                <label className="block text-xs font-semibold text-[#41004C]">
                  Category
                  <select
                    className={inputClass}
                    value={values.category}
                    onChange={(event) => setCategory(event.target.value)}
                    required
                    disabled={busy}
                  >
                    <option value="">Choose</option>
                    {values.type === "fragrance" ? (
                      <>
                        <option value="For Him">For Him</option>
                        <option value="For Her">For Her</option>
                        <option value="Unisex">Unisex</option>
                      </>
                    ) : (
                      <>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Unisex">Unisex</option>
                      </>
                    )}
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-semibold text-[#41004C]">
                  Price (₦)
                  <input
                    className={inputClass}
                    type="number"
                    min="1"
                    step="0.01"
                    value={values.price}
                    onChange={(event) => setPrice(event.target.value)}
                    placeholder="45000"
                    required
                    disabled={busy}
                  />
                </label>
                <label className="block text-xs font-semibold text-[#41004C]">
                  {values.type === "fragrance" ? "Bottle size" : "Frame style"}
                  <input
                    className={inputClass}
                    value={values.size}
                    onChange={(event) => setSize(event.target.value)}
                    placeholder={values.type === "fragrance" ? "100ml" : "Aviator"}
                    disabled={busy}
                  />
                </label>
              </div>

              <label className="block text-xs font-semibold text-[#41004C]">
                Product description
                <textarea
                  className={`${inputClass} min-h-32 resize-y leading-6`}
                  value={values.description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe the product, scent notes, style, or finish..."
                  rows={5}
                  required
                  disabled={busy}
                />
              </label>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#41004C]">Product image</p>
              <div className="mt-2 overflow-hidden rounded-2xl border border-dashed border-[#c99ed2] bg-[#f6eaf8]/65">
                {values.imagePreview ? (
                  <div className="p-3">
                    <div className="relative aspect-4/4.5 overflow-hidden rounded-xl bg-white">
                      <Image
                        src={values.imagePreview}
                        alt="Product preview"
                        fill
                        unoptimized={values.imagePreview.startsWith("blob:")}
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-contain p-3"
                      />
                    </div>
                    <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-3 py-3 text-xs font-semibold text-[#750080] transition hover:bg-[#ead7ee]">
                      <UploadCloud size={16} />
                      {values.image ? "Choose another image" : "Replace image"}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={onImageChange}
                        disabled={busy}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex min-h-70 cursor-pointer flex-col items-center justify-center px-5 py-8 text-center">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#750080] shadow-sm">
                      <UploadCloud size={24} />
                    </span>
                    <span className="mt-4 text-sm font-semibold text-[#41004C]">
                      Upload product photo
                    </span>
                    <span className="mt-2 max-w-52.5 text-xs leading-5 text-[#41004C]/50">
                      Choose a clear image of your fragrance or eyewear.
                    </span>
                    <span className="mt-4 rounded-full bg-[#41004C] px-4 py-2 text-xs font-semibold text-white">
                      Browse files
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={onImageChange}
                      disabled={busy}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="mt-2 text-[11px] text-[#41004C]/45">
                JPG, PNG or WEBP · Maximum 5MB
              </p>
              {!isEdit && (
                <p className="mt-4 rounded-xl bg-white p-3 text-xs leading-5 text-[#41004C]/60">
                  <Sparkles size={14} className="mr-1 inline text-[#750080]" />
                  Use a well-lit image with a clean background for a premium
                  storefront look.
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="mx-5 mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-7">
              {error}
            </div>
          )}

          <footer className="flex flex-col-reverse gap-3 border-t border-[#eaddec] bg-white/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="rounded-xl border border-[#eaddec] px-5 py-3 text-sm font-semibold text-[#41004C] transition hover:bg-[#f6eaf8] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#41004C] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#750080] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <Check size={16} />
              )}
              {busy
                ? isEdit
                  ? "Saving changes..."
                  : "Adding product..."
                : isEdit
                  ? "Save changes"
                  : "Add product"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<"fragrance" | "sunglasses">("fragrance");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "fragrance" | "sunglasses">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "name" | "price">("newest");

  useEffect(() => {
    let active = true;
    const getAdminData = async () => {
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/admin/login");
        return;
      }

      const { data: admin, error: adminError } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (adminError || !admin) {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      if (!active) return;
      setEmail(user.email ?? "");

      const { data, error: productError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!active) return;
      if (productError) setError(productError.message);
      else setProducts((data ?? []) as Product[]);
      setLoading(false);
    };

    void getAdminData();
    return () => { active = false; };
  }, [router]);

  const totalProducts = products.length;
  const fragranceCount = products.filter((product) => product.type === "fragrance").length;
  const sunglassesCount = products.filter((product) => product.type === "sunglasses").length;

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const result = products.filter((product) => {
      const matchesQuery =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.type.toLowerCase().includes(query);
      return matchesQuery && (filterType === "all" || product.type === filterType);
    });

    if (sortOrder === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortOrder === "price") result.sort((a, b) => Number(a.price) - Number(b.price));
    return result;
  }, [products, searchTerm, filterType, sortOrder]);

  const resetForm = () => {
    setName("");
    setType("fragrance");
    setCategory("");
    setPrice("");
    setDescription("");
    setSize("");
    setImage(null);
    setImagePreview("");
    setEditingProduct(null);
    setModalError("");
  };

  const openAddModal = () => {
    resetForm();
    setError("");
    setShowAddProduct(true);
  };

  const closeAddModal = () => {
    if (uploading) return;
    setShowAddProduct(false);
    resetForm();
  };

  const closeEditModal = () => {
    if (uploading) return;
    setShowEditProduct(false);
    resetForm();
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setModalError("Image must be smaller than 5MB.");
      event.target.value = "";
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setModalError("Please upload a JPG, PNG, or WEBP image.");
      event.target.value = "";
      return;
    }
    setModalError("");
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "dammys_products");
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dlzjjxtsd/image/upload",
      { method: "POST", body: formData },
    );
    const result = await response.json();
    if (!response.ok) throw new Error(result.error?.message || "Image upload failed.");
    if (!result.secure_url) throw new Error("Cloudinary did not return an image URL.");
    return result.secure_url as string;
  };

  const handleAddProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setModalError("");
    if (!image) {
      setModalError("Please select a product image.");
      return;
    }
    if (!category.trim()) {
      setModalError("Please choose a category.");
      return;
    }
    if (!price || Number(price) <= 0) {
      setModalError("Please enter a valid product price.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const imageUrl = await uploadImage(image);
      const { data, error: insertError } = await supabase
        .from("products")
        .insert({
          name: name.trim(),
          type,
          category: category.trim(),
          price: Number(price),
          image: imageUrl,
          description: description.trim(),
          size: size.trim() || null,
        })
        .select()
        .single();

      if (insertError) throw new Error(insertError.message);
      if (data) setProducts((current) => [data as Product, ...current]);
      setShowAddProduct(false);
      resetForm();
    } catch (caught) {
      setModalError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  const openEditProduct = (product: Product) => {
    setModalError("");
    setError("");
    setEditingProduct(product);
    setName(product.name);
    setType(product.type);
    setCategory(product.category);
    setPrice(String(product.price));
    setDescription(product.description);
    setSize(product.size ?? "");
    setImage(null);
    setImagePreview(product.image || "");
    setShowEditProduct(true);
  };

  const handleEditProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingProduct) return;
    setModalError("");

    if (!name.trim() || !category.trim() || !description.trim()) {
      setModalError("Please complete the product name, category, and description.");
      return;
    }
    if (!price || Number(price) <= 0) {
      setModalError("Please enter a valid product price.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const imageUrl = image ? await uploadImage(image) : editingProduct.image;
      const { data, error: updateError } = await supabase
        .from("products")
        .update({
          name: name.trim(),
          type,
          category: category.trim(),
          price: Number(price),
          image: imageUrl,
          description: description.trim(),
          size: size.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingProduct.id)
        .select()
        .single();

      if (updateError) throw new Error(updateError.message);
      if (data) {
        setProducts((current) =>
          current.map((product) => product.id === editingProduct.id ? data as Product : product),
        );
      }
      setShowEditProduct(false);
      resetForm();
    } catch (caught) {
      setModalError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    setDeleting(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", deletingProduct.id);
      if (deleteError) throw new Error(deleteError.message);
      setProducts((current) => current.filter((product) => product.id !== deletingProduct.id));
      setDeletingProduct(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  const currency = (amount: number) =>
    `₦${Number(amount).toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fffaff] px-6">
        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#41004C] text-white shadow-lg shadow-[#41004C]/20">
            <Sparkles size={24} />
          </div>
          <p className="mt-5 text-sm font-medium text-[#41004C]">Preparing your workspace…</p>
          <p className="mt-1 text-xs text-[#41004C]/45">Dammys Essence Admin</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f4f9] text-[#41004C]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-62.5 flex-col bg-[#300037] px-5 py-6 text-white lg:flex">
        <div className="flex items-center gap-3 px-1">
          <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-white">
            <Image src="/dammys-logo.png" alt="Dammys Essence" width={48} height={48} className="h-full w-full object-contain p-1" />
          </div>
          <div>
            <p className="font-serif text-lg leading-tight">Dammys Essence</p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/45">Admin studio</p>
          </div>
        </div>

        <div className="mt-10">
          <p className="px-3 text-[9px] font-bold uppercase tracking-[0.23em] text-white/35">Workspace</p>
          <a href="#overview" className="mt-3 flex items-center gap-3 rounded-xl bg-white/10 px-3 py-3 text-sm font-medium text-white">
            <LayoutDashboard size={17} /> Overview
          </a>
          <a href="#inventory" className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/60 transition hover:bg-white/8 hover:text-white">
            <Package size={17} /> Product inventory
          </a>
        </div>

        <div className="mt-8 rounded-2xl  border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/85">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Store status
          </div>
          <p className="mt-2 text-[11px] leading-5 text-white/45">Your catalog is connected and ready to manage.</p>
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
            <span className="text-[10px] text-white/45">Catalog items</span>
            <span className="text-xs font-semibold text-white">{totalProducts}</span>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-white/10 bg-white/4 p-2">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">Signed in as</p>
          <p className="mt-2 truncate text-xs text-white/75" title={email}>{email}</p>
          <button onClick={handleLogout} type="button" className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-xs font-semibold transition hover:bg-white/15">
            <LogOut size={10} /> Sign out
          </button>
        </div>
      </aside>

      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#eaddec] bg-[#fffaff]/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-white">
            <Image src="/dammys-logo.png" alt="Dammys Essence" width={40} height={40} className="h-full w-full object-contain p-1" />
          </div>
          <div>
            <p className="font-serif text-base">Dammys Essence</p>
            <p className="text-[9px] uppercase tracking-[0.18em] text-[#750080]">Admin studio</p>
          </div>
        </div>
        <button type="button" onClick={handleLogout} className="flex items-center gap-2 rounded-xl bg-[#41004C] px-3 py-2.5 text-xs font-semibold text-white">
          <LogOut size={14} /> Sign out
        </button>
      </div>

      <section className="min-h-screen lg:ml-62.5">
        <div className="mx-auto max-w-375 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
          <header id="overview" className="flex flex-col gap-5 border-b border-[#e9dfea] pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#750080]">Store management / Overview</p>
              <h1 className="mt-3 font-serif text-3xl tracking-tight text-[#300037] sm:text-4xl">Good to see you.</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#41004C]/55">
                A clear view of your collection, with everything you need to keep the store looking its best.
              </p>
            </div>
            <button type="button" onClick={openAddModal} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#41004C] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#41004C]/15 transition hover:-translate-y-0.5 hover:bg-[#750080]">
              <Plus size={17} /> Add product
            </button>
          </header>

          {error && (
            <div className="mt-5 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <p>{error}</p>
              <button type="button" aria-label="Dismiss error" onClick={() => setError("")}><X size={17} /></button>
            </div>
          )}

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <article className="rounded-2xl border border-[#eaddec] bg-white p-5 shadow-sm shadow-[#41004C]/2">
              <div className="flex items-start justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#f6eaf8] text-[#750080]"><Package size={20} /></span>
                <span className="rounded-full bg-[#f6eaf8] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#750080]">All items</span>
              </div>
              <p className="mt-6 text-xs font-medium text-[#41004C]/50">Total products</p>
              <div className="mt-1 flex items-end justify-between">
                <p className="text-3xl font-semibold tracking-tight">{totalProducts.toString().padStart(2, "0")}</p>
                <p className="text-[11px] text-[#41004C]/40">In your catalog</p>
              </div>
            </article>
            <article className="rounded-2xl border border-[#eaddec] bg-white p-5 shadow-sm shadow-[#41004C]/2">
              <div className="flex items-start justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#750080]/10 text-[#750080]"><Sparkles size={20} /></span>
                <span className="rounded-full bg-[#f6eaf8] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#750080]">Fragrance</span>
              </div>
              <p className="mt-6 text-xs font-medium text-[#41004C]/50">Fragrances</p>
              <div className="mt-1 flex items-end justify-between">
                <p className="text-3xl font-semibold tracking-tight">{fragranceCount.toString().padStart(2, "0")}</p>
                <p className="text-[11px] text-[#41004C]/40">Scents & perfumes</p>
              </div>
            </article>
            <article className="rounded-2xl border border-[#eaddec] bg-white p-5 shadow-sm shadow-[#41004C]/2 sm:col-span-2 xl:col-span-1">
              <div className="flex items-start justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#f6eaf8] text-[#750080]"><Glasses size={20} /></span>
                <span className="rounded-full bg-[#f6eaf8] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#750080]">Eyewear</span>
              </div>
              <p className="mt-6 text-xs font-medium text-[#41004C]/50">Sunglasses</p>
              <div className="mt-1 flex items-end justify-between">
                <p className="text-3xl font-semibold tracking-tight">{sunglassesCount.toString().padStart(2, "0")}</p>
                <p className="text-[11px] text-[#41004C]/40">Frames & styles</p>
              </div>
            </article>
          </div>

          <section id="inventory" className="mt-8 overflow-hidden rounded-2xl border border-[#eaddec] bg-white shadow-sm shadow-[#41004C]/2">
            <div className="flex flex-col gap-5 border-b border-[#eee4ef] p-5 sm:p-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.23em] text-[#750080]">Your collection</p>
                <h2 className="mt-2 font-serif text-2xl text-[#300037]">Product inventory</h2>
                <p className="mt-1 text-sm text-[#41004C]/50">Search, review, and manage the items in your store.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-[minmax(200px,1fr)_160px_160px] xl:min-w-145">
                <label className="relative block">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#41004C]/35" />
                  <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search products..." className="w-full rounded-xl border border-[#eaddec] bg-[#fffaff] py-3 pl-10 pr-3 text-sm outline-none transition placeholder:text-[#41004C]/35 focus:border-[#750080] focus:ring-4 focus:ring-[#750080]/10" />
                </label>
                <label className="relative">
                  <select value={filterType} onChange={(event) => setFilterType(event.target.value as typeof filterType)} className="w-full appearance-none rounded-xl border border-[#eaddec] bg-[#fffaff] px-3.5 py-3 pr-9 text-sm outline-none focus:border-[#750080]">
                    <option value="all">All categories</option>
                    <option value="fragrance">Fragrances</option>
                    <option value="sunglasses">Sunglasses</option>
                  </select>
                  <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#41004C]/45" />
                </label>
                <label className="relative">
                  <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as typeof sortOrder)} className="w-full appearance-none rounded-xl border border-[#eaddec] bg-[#fffaff] px-3.5 py-3 pr-9 text-sm outline-none focus:border-[#750080]">
                    <option value="newest">Recently added</option>
                    <option value="name">Name A–Z</option>
                    <option value="price">Price: low to high</option>
                  </select>
                  <ArrowDownUp size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#41004C]/45" />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between px-5 py-3.5 sm:px-6">
              <p className="text-xs text-[#41004C]/50">
                Showing <span className="font-semibold text-[#41004C]">{filteredProducts.length}</span> of {totalProducts} products
              </p>
              {(searchTerm || filterType !== "all") && (
                <button type="button" onClick={() => { setSearchTerm(""); setFilterType("all"); }} className="text-xs font-semibold text-[#750080] hover:underline">Clear filters</button>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="border-t border-[#f0e7f1] px-5 py-16 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#f6eaf8] text-[#750080]"><Package size={24} /></span>
                <h3 className="mt-4 text-sm font-semibold">{totalProducts === 0 ? "Your catalog is ready for its first product" : "No matching products"}</h3>
                <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#41004C]/50">
                  {totalProducts === 0 ? "Add a fragrance or sunglasses to start building your collection." : "Try a different search term or clear the current filters."}
                </p>
                {totalProducts === 0 ? (
                  <button type="button" onClick={openAddModal} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#41004C] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#750080]"><Plus size={15} /> Add first product</button>
                ) : (
                  <button type="button" onClick={() => { setSearchTerm(""); setFilterType("all"); }} className="mt-5 rounded-xl border border-[#eaddec] px-4 py-2.5 text-xs font-semibold hover:bg-[#f6eaf8]">Clear filters</button>
                )}
              </div>
            ) : (
              <>
                <div className="hidden grid-cols-[minmax(220px,1.6fr)_0.8fr_0.8fr_0.8fr_130px] gap-4 border-y border-[#f0e7f1] bg-[#fcf8fd] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#41004C]/45 md:grid">
                  <span>Product</span><span>Type</span><span>Category</span><span>Price</span><span className="text-right">Actions</span>
                </div>
                <div className="divide-y divide-[#f0e7f1]">
                  {filteredProducts.map((product) => (
                    <article key={product.id} className="grid gap-4 px-4 py-4 transition hover:bg-[#fffaff] sm:px-6 md:grid-cols-[minmax(220px,1.6fr)_0.8fr_0.8fr_0.8fr_130px] md:items-center">
                      <div className="flex min-w-0 items-center gap-3.5">
                        <div className="relative h-19 w-17 shrink-0 overflow-hidden rounded-xl border border-[#eaddec] bg-[#f6eaf8]">
                          <Image src={product.image} alt={product.name} fill sizes="68px" className="object-contain p-1.5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-[#300037]">{product.name}</h3>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#41004C]/45">{product.description}</p>
                          {product.size && <p className="mt-1 text-[10px] font-medium text-[#750080]">{product.size}</p>}
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:block">
                        <span className="md:hidden text-[10px] uppercase tracking-wider text-[#41004C]/40">Type</span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f6eaf8] px-2.5 py-1.5 text-[10px] font-semibold capitalize text-[#750080]">
                          {product.type === "fragrance" ? <Sparkles size={12} /> : <Glasses size={12} />}{product.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between md:block">
                        <span className="md:hidden text-[10px] uppercase tracking-wider text-[#41004C]/40">Category</span>
                        <span className="text-xs text-[#41004C]/65">{product.category}</span>
                      </div>
                      <div className="flex items-center justify-between md:block">
                        <span className="md:hidden text-[10px] uppercase tracking-wider text-[#41004C]/40">Price</span>
                        <span className="text-sm font-semibold text-[#41004C]">{currency(product.price)}</span>
                      </div>
                      <div className="flex gap-2 md:justify-end">
                        <button type="button" onClick={() => openEditProduct(product)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#eaddec] px-3 py-2.5 text-xs font-semibold text-[#41004C] transition hover:border-[#d9b7df] hover:bg-[#f6eaf8] hover:text-[#750080] md:flex-none" aria-label={`Edit ${product.name}`}>
                          <Pencil size={14} /><span>Edit</span>
                        </button>
                        <button type="button" onClick={() => setDeletingProduct(product)} className="grid h-9 w-10 place-items-center rounded-lg border border-red-100 text-red-400 transition hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${product.name}`}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </section>

          <footer className="flex flex-col gap-2 py-6 text-[10px] text-[#41004C]/40 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} Dammys Essence · Private admin workspace</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Inventory connected</span>
          </footer>
        </div>
      </section>

      {showAddProduct && (
        <ProductFormModal
          mode="add"
          values={{ name, type, category, price, description, size, imagePreview, image }}
          setName={setName}
          setType={(nextType) => { setType(nextType); setCategory(""); }}
          setCategory={setCategory}
          setPrice={setPrice}
          setDescription={setDescription}
          setSize={setSize}
          onImageChange={handleImageChange}
          onClose={closeAddModal}
          onSubmit={handleAddProduct}
          busy={uploading}
          error={modalError}
        />
      )}

      {showEditProduct && (
        <ProductFormModal
          mode="edit"
          values={{ name, type, category, price, description, size, imagePreview, image }}
          setName={setName}
          setType={(nextType) => { setType(nextType); setCategory(""); }}
          setCategory={setCategory}
          setPrice={setPrice}
          setDescription={setDescription}
          setSize={setSize}
          onImageChange={handleImageChange}
          onClose={closeEditModal}
          onSubmit={handleEditProduct}
          busy={uploading}
          error={modalError}
        />
      )}

      {deletingProduct && (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-[#200025]/60 p-4 backdrop-blur-sm">
          <section className="w-full max-w-md rounded-[26px] border border-white/70 bg-[#fffaff] p-6 shadow-2xl sm:p-7">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-red-500"><Trash2 size={21} /></div>
            <h2 className="mt-5 font-serif text-2xl text-[#300037]">Remove this product?</h2>
            <p className="mt-2 text-sm leading-6 text-[#41004C]/60">
              You are about to delete <span className="font-semibold text-[#41004C]">{deletingProduct.name}</span>. This action cannot be undone.
            </p>
            {error && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setDeletingProduct(null)} disabled={deleting} className="rounded-xl border border-[#eaddec] px-5 py-3 text-sm font-semibold transition hover:bg-[#f6eaf8] disabled:opacity-50">Cancel</button>
              <button type="button" onClick={handleDeleteProduct} disabled={deleting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60">
                {deleting ? "Deleting..." : <><Trash2 size={15} /> Delete product</>}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
