"use client";

import Image from "next/image";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  Package,
  Plus,
  LogOut,
  LayoutDashboard,
  Glasses,
  Sparkles,
  X,
  Pencil,
  Trash2,
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

export default function AdminDashboard() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);

  const [error, setError] = useState(""); // ========================================
  // ADD PRODUCT
  // ========================================

  const [showAddProduct, setShowAddProduct] = useState(false); // ========================================
  // EDIT PRODUCT
  // ========================================

  const [showEditProduct, setShowEditProduct] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null); // ========================================
  // DELETE PRODUCT
  // ========================================

  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const [deleting, setDeleting] = useState(false); // ========================================
  // FORM
  // ========================================

  const [name, setName] = useState("");

  const [type, setType] = useState<"fragrance" | "sunglasses">("fragrance");

  const [category, setCategory] = useState("");

  const [price, setPrice] = useState("");

  const [description, setDescription] = useState("");

  const [size, setSize] = useState(""); // ========================================
  // IMAGE
  // ========================================

  const [image, setImage] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState("");

  const [uploading, setUploading] = useState(false); // ========================================
  // GET ADMIN DATA
  // ========================================

  useEffect(() => {
    const getAdminData = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");

        return;
      }

      const { data: admin } = await supabase

        .from("admin_users")

        .select("id")

        .eq("id", user.id)

        .maybeSingle();

      if (!admin) {
        await supabase.auth.signOut();

        router.push("/admin/login");

        return;
      }

      setEmail(user.email ?? "");

      const { data: productData, error: productError } = await supabase

        .from("products")

        .select("*")

        .order("created_at", {
          ascending: false,
        });

      if (productError) {
        setError(productError.message);

        setLoading(false);

        return;
      }

      setProducts(productData ?? []);

      setLoading(false);
    };

    getAdminData();
  }, [router]); // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = async () => {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/admin/login");
  }; // ========================================
  // IMAGE CHANGE
  // ========================================

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");

      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a JPG, PNG, or WEBP image.");

      return;
    }

    setError("");

    setImage(file);

    setImagePreview(URL.createObjectURL(file));
  }; // ========================================
  // REMOVE IMAGE
  // ========================================

  const handleRemoveImage = () => {
    setImage(null);

    setImagePreview("");
  }; // ========================================
  // RESET FORM
  // ========================================

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
  }; // ========================================
  // ADD PRODUCT
  // ========================================

  const handleAddProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!image) {
      setError("Please select a product image.");

      return;
    }

    if (!price || Number(price) <= 0) {
      setError("Please enter a valid product price.");

      return;
    }

    setUploading(true);

    try {
      const supabase = createClient();

      const formData = new FormData();

      formData.append("file", image);

      formData.append("upload_preset", "dammys_products");

      const cloudinaryResponse = await fetch(
        "https\\://api.cloudinary.com/v1_1/dlzjjxtsd/image/upload",

        {
          method: "POST",

          body: formData,
        },
      );

      const cloudinaryData = await cloudinaryResponse.json();

      if (!cloudinaryResponse.ok) {
        throw new Error(
          cloudinaryData.error?.message || "Image upload failed.",
        );
      }

      const imageUrl = cloudinaryData.secure_url;

      if (!imageUrl) {
        throw new Error("Cloudinary did not return an image URL.");
      }

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

      if (insertError) {
        throw new Error(insertError.message);
      }

      if (data) {
        setProducts((currentProducts) => [data as Product, ...currentProducts]);
      }

      resetForm();

      setShowAddProduct(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setUploading(false);
    }
  }; // ========================================
  // OPEN EDIT
  // ========================================

  const openEditProduct = (product: Product) => {
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
  }; // ========================================
  // UPDATE PRODUCT
  // ========================================

  const handleEditProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingProduct) {
      return;
    }

    setError("");

    if (!name.trim()) {
      setError("Product name is required.");

      return;
    }

    if (!category.trim()) {
      setError("Category is required.");

      return;
    }

    if (!price || Number(price) <= 0) {
      setError("Please enter a valid product price.");

      return;
    }

    if (!description.trim()) {
      setError("Product description is required.");

      return;
    }

    setUploading(true);

    try {
      const supabase = createClient();

      let imageUrl = editingProduct.image; // Upload new image only if one was selected

      if (image) {
        const formData = new FormData();

        formData.append("file", image);

        formData.append("upload_preset", "dammys_products");

        const cloudinaryResponse = await fetch(
          "https\\://api.cloudinary.com/v1_1/dlzjjxtsd/image/upload",

          {
            method: "POST",

            body: formData,
          },
        );

        const cloudinaryData = await cloudinaryResponse.json();

        if (!cloudinaryResponse.ok) {
          throw new Error(
            cloudinaryData.error?.message || "New image upload failed.",
          );
        }

        imageUrl = cloudinaryData.secure_url;

        if (!imageUrl) {
          throw new Error("Cloudinary did not return an image URL.");
        }
      }

      const { data, error: updateError } = await supabase

        .from("products")

        .update({
          name: name.trim(),

          type,

          category: category.trim(),

          price: Number(price),

          image: imageUrl || "",

          description: description.trim(),

          size: size.trim() || null,

          updated_at: new Date().toISOString(),
        })

        .eq("id", editingProduct.id)

        .select()

        .single();

      if (updateError) {
        throw new Error(updateError.message);
      }

      if (data) {
        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product.id === editingProduct.id ? (data as Product) : product,
          ),
        );
      }

      resetForm();

      setShowEditProduct(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setUploading(false);
    }
  }; // ========================================
  // DELETE PRODUCT
  // ========================================

  const handleDeleteProduct = async () => {
    if (!deletingProduct) {
      return;
    }

    setDeleting(true);

    setError("");

    try {
      const supabase = createClient();

      const { error: deleteError } = await supabase

        .from("products")

        .delete()

        .eq("id", deletingProduct.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== deletingProduct.id),
      );

      setDeletingProduct(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unable to delete product.");
      }
    } finally {
      setDeleting(false);
    }
  }; // ========================================
  // STATISTICS
  // ========================================

  const totalProducts = products.length;

  const fragranceCount = products.filter(
    (product) => product.type === "fragrance",
  ).length;

  const sunglassesCount = products.filter(
    (product) => product.type === "sunglasses",
  ).length; // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="flex  min-h-screen items-center justify-center bg-[#FFF9FF]">
               {" "}
        <p className="text-sm text-[#41004C]/50">Loading admin dashboard...</p> 
           {" "}
      </main>
    );
  } // ========================================
  // DASHBOARD
  // ========================================

  return (
   <main
  id="admin-dashboard"
  className="min-h-screen bg-[#F6EAF8] text-[#41004C]"
>
            {/* DESKTOP SIDEBAR */}     {" "}
<aside className="fixed inset-y-0 left-0 z-40 hidden w-67.5 flex-col border-r border-white/10 bg-[#41004C] text-[#FFF9FF] lg:flex">               {" "}
        <div className="flex h-full flex-col px-5 py-6">
                   {" "}
          <div className="flex items-center gap-3 px-3">
                       {" "}
            <div className="flex h-20 w-200 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg shadow-black/10">
                           {" "}
              <Image
                src="/dammys-logo.jpg"
                alt="Dammys Essence"
                width={400}
                height={300}
                className="h-full w-full object-contain p-2"
              />
                         {" "}
            </div>
                       {" "}
            <div>
                           {" "}
              <p className="font-serif text-lg leading-none">Dammys Essence</p> 
                         {" "}
              <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#F6EAF8]/55">
                Admin Panel
              </p>
                         {" "}
            </div>
                     {" "}
          </div>
                    <div className="my-8 h-px bg-white/10" />         {" "}
          <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#F6EAF8]/40">
            Workspace
          </p>
                   {" "}
          <nav className="mt-3 space-y-1.5">
                       {" "}
            <a
              href="#dashboard"
              className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium text-white shadow-inner shadow-white/5"
            >
                            <LayoutDashboard size={18} />             {" "}
              <span>Dashboard</span>           {" "}
            </a>
                       {" "}
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-[#F6EAF8]/70 transition hover:bg-white/7 hover:text-white"
            >
                            <Package size={18} />             {" "}
              <span>Products</span>           {" "}
            </button>
                       {" "}
            <button
              type="button"
              onClick={() => {
                setError("");
                resetForm();
                setShowAddProduct(true);
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-[#F6EAF8]/70 transition hover:bg-white/7 hover:text-white"
            >
                            <Plus size={18} />             {" "}
              <span>Add Product</span>           {" "}
            </button>
                     {" "}
          </nav>
                   {" "}
          <p className="mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#F6EAF8]/40">
            Catalog
          </p>
                   {" "}
          <div className="mt-3 space-y-1.5">
                       {" "}
            <div className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-[#F6EAF8]/60">
                           {" "}
              <span className="flex items-center gap-3">
                <Sparkles size={18} />
                Fragrances
              </span>
                           {" "}
              <span className="text-xs text-[#F6EAF8]/35">
                {fragranceCount}
              </span>
                         {" "}
            </div>
                       {" "}
            <div className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-[#F6EAF8]/60">
                           {" "}
              <span className="flex items-center gap-3">
                <Glasses size={18} />
                Sunglasses
              </span>
                           {" "}
              <span className="text-xs text-[#F6EAF8]/35">
                {sunglassesCount}
              </span>
                         {" "}
            </div>
                     {" "}
          </div>
                   {" "}
          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
                       {" "}
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#F6EAF8]/35">
              Signed in as
            </p>
                       {" "}
            <p className="mt-2 truncate text-xs text-[#FFF9FF]/75">{email}</p> 
                     {" "}
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white/8 px-3 py-2.5 text-xs font-medium text-white transition hover:bg-white/15"
            >
                            <LogOut size={15} />
              Logout            {" "}
            </button>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </aside>
            {/* MOBILE TOP BAR */}     {" "}
      <div className="sticky top-17 z-30 mt-10 flex items-center justify-between border-b border-[#41004C]/10 bg-[#41004C] px-4 py-3 text-white lg:hidden">
               {" "}
        <div className="flex items-center gap-3">
                   {" "}
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white">
                       {" "}
            <Image
              src="/dammys-logo.png"
              alt="Dammys Essence"
              width={40}
              height={40}
              className="h-full w-full object-contain p-1"
            />
                     {" "}
          </div>
                   {" "}
          <div>
                        <p className="font-serif text-base">Dammys Essence</p> 
                     {" "}
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/45">
              Admin Panel
            </p>
                     {" "}
          </div>
                 {" "}
        </div>
               {" "}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-medium"
        >
          <LogOut size={14} />
          Logout
        </button>
             {" "}
      </div>
            {/* MAIN WORKSPACE */}     {" "}
      <section id="dashboard" className="min-h-screen lg:ml-67.5">
               {" "}
        <div className="mx-auto max-w-375 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                   {" "}
          <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                       {" "}
            <div>
                           {" "}
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#750080]">
                Dammys Essence · Overview
              </p>
                           {" "}
              <h1 className="mt-2 font-serif text-3xl text-[#41004C] sm:text-4xl">
                Good to see you again.
              </h1>
                           {" "}
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#41004C]/55">
                Manage your luxury fragrance and eyewear collection from one
                place.
              </p>
                         {" "}
            </div>
                       {" "}
            <button
              type="button"
              onClick={() => {
                setError("");
                resetForm();
                setShowAddProduct(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#41004C] px-5 py-3 text-sm font-medium text-white shadow-lg shadow-[#41004C]/15 transition hover:-translate-y-0.5 hover:bg-[#750080]"
            >
                            <Plus size={17} />
              Add Product            {" "}
            </button>
                     {" "}
          </header>
                   {" "}
          {error && (
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                            <p className="text-sm text-red-600">{error}</p>     
                     {" "}
              <button
                type="button"
                onClick={() => setError("")}
                className="text-red-400 transition hover:text-red-600"
              >
                <X size={17} />
              </button>
                         {" "}
            </div>
          )}
                   {" "}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                       {" "}
            <div className="group rounded-3xl border border-[#41004C]/8 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#41004C]/8">
                           {" "}
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F6EAF8] text-[#750080]">
                  <Package size={21} />
                </div>
                <span className="rounded-full bg-[#F6EAF8] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#750080]">
                  All
                </span>
              </div>
                           {" "}
              <p className="mt-7 text-xs font-medium uppercase tracking-[0.18em] text-[#41004C]/40">
                Total Products
              </p>
              <p className="mt-1 text-3xl font-semibold text-[#41004C]">
                {totalProducts}
              </p>
                         {" "}
            </div>
                       {" "}
            <div className="group rounded-3xl border border-[#41004C]/8 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#41004C]/8">
                           {" "}
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#750080]/10 text-[#750080]">
                  <Sparkles size={21} />
                </div>
                <span className="rounded-full bg-[#750080]/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#750080]">
                  Fragrance
                </span>
              </div>
                           {" "}
              <p className="mt-7 text-xs font-medium uppercase tracking-[0.18em] text-[#41004C]/40">
                Fragrances
              </p>
              <p className="mt-1 text-3xl font-semibold text-[#41004C]">
                {fragranceCount}
              </p>
                         {" "}
            </div>
                       {" "}
            <div className="group rounded-3xl border border-[#41004C]/8 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#41004C]/8 sm:col-span-2 xl:col-span-1">
                           {" "}
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F6EAF8] text-[#750080]">
                  <Glasses size={21} />
                </div>
                <span className="rounded-full bg-[#F6EAF8] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#750080]">
                  Eyewear
                </span>
              </div>
                           {" "}
              <p className="mt-7 text-xs font-medium uppercase tracking-[0.18em] text-[#41004C]/40">
                Sunglasses
              </p>
              <p className="mt-1 text-3xl font-semibold text-[#41004C]">
                {sunglassesCount}
              </p>
                         {" "}
            </div>
                     {" "}
          </div>
                   {" "}
          <div className="mt-6 rounded-3xl border border-[#41004C]/8 bg-[#41004C] p-6 text-white shadow-xl shadow-[#41004C]/10 sm:p-7">
                       {" "}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                           {" "}
              <div>
                               {" "}
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                    <LayoutDashboard size={20} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                      Catalog control
                    </p>
                    <h2 className="mt-1 text-xl font-semibold">
                      Product Management
                    </h2>
                  </div>
                </div>
                               {" "}
                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
                  Keep your Dammys Essence collection fresh. Add new products,
                  update existing details, or remove items that are no longer
                  available.
                </p>
                             {" "}
              </div>
                           {" "}
              <button
                type="button"
                onClick={() => {
                  setError("");
                  resetForm();
                  setShowAddProduct(true);
                }}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#41004C] transition hover:-translate-y-0.5 hover:bg-[#F6EAF8]"
              >
                <Plus size={17} />
                Add New Product
              </button>
                         {" "}
            </div>
                     {" "}
          </div>
                   {" "}
          <div
            id="products"
            className="mt-6 rounded-3xl border border-[#41004C]/8 bg-white p-5 shadow-sm sm:p-7"
          >
                       {" "}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                           {" "}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#750080]">
                  Inventory
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-[#41004C]">
                  Your Products
                </h2>
                <p className="mt-1 text-sm text-[#41004C]/45">
                  Every product currently available in your catalog.
                </p>
              </div>
                           {" "}
              <span className="w-fit rounded-full bg-[#F6EAF8] px-3.5 py-1.5 text-xs font-semibold text-[#750080]">
                {products.length}{" "}
                {products.length === 1 ? "Product" : "Products"}
              </span>
                         {" "}
            </div>
                       {" "}
            {products.length === 0 ? (
              <div className="mt-7 rounded-3xl border border-dashed border-[#41004C]/10 py-16 text-center">
                               {" "}
                <Package size={35} className="mx-auto text-[#750080]/30" />
                <p className="mt-4 text-sm font-medium text-[#41004C]">
                  No products yet
                </p>
                <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#41004C]/45">
                  Your collection is empty. Add your first fragrance or pair of
                  sunglasses to get started.
                </p>
                               {" "}
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    resetForm();
                    setShowAddProduct(true);
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#41004C] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#750080]"
                >
                  <Plus size={15} />
                  Add First Product
                </button>
                             {" "}
              </div>
            ) : (
              <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                               {" "}
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-3xl border border-[#41004C]/8 bg-[#FFF9FF] transition duration-300 hover:-translate-y-1 hover:border-[#750080]/20 hover:shadow-xl hover:shadow-[#41004C]/8"
                  >
                                       {" "}
                    <div className="relative aspect-4/3 overflow-hidden bg-[#F6EAF8]">
                                           {" "}
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
                      />
                                           {" "}
                      <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#750080] backdrop-blur">
                        {product.type}
                      </div>
                                         {" "}
                    </div>
                                       {" "}
                    <div className="p-4">
                                           {" "}
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#750080]/65">
                        {product.category}
                      </p>
                                           {" "}
                      <h3 className="mt-1 line-clamp-1 text-base font-semibold text-[#41004C]">
                        {product.name}
                      </h3>
                                           {" "}
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="font-semibold text-[#750080]">
                          ₦{Number(product.price).toLocaleString()}
                        </p>
                        {product.size && (
                          <span className="text-[11px] text-[#41004C]/45">
                            {product.size}
                          </span>
                        )}
                      </div>
                                           {" "}
                      <div className="mt-4 flex gap-2 border-t border-[#41004C]/8 pt-4">
                                               
                        <button
                          type="button"
                          onClick={() => openEditProduct(product)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#41004C]/10 bg-white px-3 py-2.5 text-xs font-medium text-[#41004C] transition hover:border-[#750080]/20 hover:bg-[#F6EAF8] hover:text-[#750080]"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                                               {" "}
                        <button
                          type="button"
                          onClick={() => setDeletingProduct(product)}
                          className="flex items-center justify-center rounded-xl border border-red-100 bg-white px-3 py-2.5 text-red-400 transition hover:bg-red-50 hover:text-red-600"
                          aria-label={`Delete ${product.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                                             {" "}
                      </div>
                                         {" "}
                    </div>
                                     {" "}
                  </article>
                ))}
                             {" "}
              </div>
            )}
                     {" "}
          </div>
                   {" "}
          <div className="mt-6 flex flex-col gap-2 pb-6 text-center text-[11px] text-[#41004C]/35 sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <span>Dammys Essence Admin · Private workspace</span>
            <span>{totalProducts} products in catalog</span>
          </div>
                 {" "}
        </div>
               {" "}
        {/* ========================================



            ADD PRODUCT MODAL



        ======================================== */}
               {" "}
        {showAddProduct && (
          <div className="fixed inset-0 z-3000 flex items-center justify-center bg-[#41004C]/40 px-5 py-8 backdrop-blur-sm">
                       {" "}
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
                           {" "}
              <div className="flex items-center justify-between border-b border-[#41004C]/10 px-6 py-5 md:px-8">
                               {" "}
                <div>
                                   {" "}
                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#750080]">
                                        Dammys Essence                  {" "}
                  </p>
                                   {" "}
                  <h3 className="mt-1 font-serif text-2xl text-[#41004C]">
                                        Add Product                  {" "}
                  </h3>
                                 {" "}
                </div>
                               {" "}
                <button
                  type="button"
                  onClick={() => {
                    if (!uploading) {
                      setShowAddProduct(false);

                      setError("");

                      resetForm();
                    }
                  }}
                  disabled={uploading}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[#41004C]/50 transition hover:bg-[#F6EAF8] hover:text-[#750080] disabled:opacity-40"
                >
                                    <X size={20} />               {" "}
                </button>
                             {" "}
              </div>
                           {" "}
              <form
                onSubmit={handleAddProduct}
                className="space-y-5 p-6 md:p-8"
              >
                                {/* NAME */}               {" "}
                <div>
                                   {" "}
                  <label
                    htmlFor="add-name"
                    className="mb-2 block text-sm font-medium text-[#41004C]"
                  >
                                        Product Name                  {" "}
                  </label>
                                   {" "}
                  <input
                    id="add-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="e.g. Royal Oud"
                    required
                    disabled={uploading}
                    className="w-full rounded-xl border border-[#41004C]/10 bg-[#FFF9FF] px-4 py-3.5 text-sm text-[#41004C] outline-none focus:border-[#750080] focus:ring-2 focus:ring-[#750080]/10 disabled:opacity-60"
                  />
                                 {" "}
                </div>
                                {/* TYPE + CATEGORY */}               {" "}
                <div className="grid gap-5 md:grid-cols-2">
                                   {" "}
                  <div>
                                       {" "}
                    <label
                      htmlFor="add-type"
                      className="mb-2 block text-sm font-medium text-[#41004C]"
                    >
                                            Product Type                  
                       {" "}
                    </label>
                                       {" "}
                    <select
                      id="add-type"
                      value={type}
                      onChange={(event) =>
                        setType(
                          event.target.value as "fragrance" | "sunglasses",
                        )
                      }
                      disabled={uploading}
                      className="w-full rounded-xl border border-[#41004C]/10 bg-[#FFF9FF] px-4 py-3.5 text-sm text-[#41004C] outline-none focus:border-[#750080] focus:ring-2 focus:ring-[#750080]/10 disabled:opacity-60"
                    >
                                           {" "}
                      <option value="fragrance">Fragrance</option>             
                              <option value="sunglasses">Sunglasses</option>   
                                     {" "}
                    </select>
                                     {" "}
                  </div>
                                   {" "}
                  <div>
                                       {" "}
                    <label
                      htmlFor="add-category"
                      className="mb-2 block text-sm font-medium text-[#41004C]"
                    >
                                            Category                    {" "}
                    </label>
                                       {" "}
                    <select
                      id="add-category"
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      disabled={uploading}
                      className="w-full rounded-xl border border-[#d9b7df] bg-white px-4 py-3 text-sm text-[#41004C] outline-none transition focus:border-[#750080] focus:ring-2 focus:ring-[#750080]/20"
                    >
                                           {" "}
                      <option value="">Select category</option>                 
                         {" "}
                      {type === "fragrance" ? (
                        <>
                                                   {" "}
                          <option value="For Him">For Him</option>             
                                      <option value="For Her">For Her</option> 
                                                 {" "}
                          <option value="Unisex">Unisex</option>               
                                 {" "}
                        </>
                      ) : (
                        <>
                                                   {" "}
                          <option value="Men">Men</option>                     
                              <option value="Women">Women</option>             
                                      <option value="Unisex">Unisex</option>   
                                             {" "}
                        </>
                      )}
                                         {" "}
                    </select>
                                     {" "}
                  </div>
                                 {" "}
                </div>
                                {/* PRICE + SIZE / FRAME */}               {" "}
                <div className="grid gap-5 md:grid-cols-2">
                                   {" "}
                  <div>
                                       {" "}
                    <label
                      htmlFor="add-price"
                      className="mb-2 block text-sm font-medium text-[#41004C]"
                    >
                                            Price (₦)                    {" "}
                    </label>
                                       {" "}
                    <input
                      id="add-price"
                      type="number"
                      min="0"
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
                      placeholder="45000"
                      required
                      disabled={uploading}
                      className="w-full rounded-xl border border-[#41004C]/10 bg-[#FFF9FF] px-4 py-3.5 text-sm text-[#41004C] outline-none focus:border-[#750080] focus:ring-2 focus:ring-[#750080]/10 disabled:opacity-60"
                    />
                                     {" "}
                  </div>
                                   {" "}
                  <div>
                                       {" "}
                    <label
                      htmlFor="add-size"
                      className="mb-2 block text-sm font-medium text-[#41004C]"
                    >
                                           {" "}
                      {type === "fragrance" ? "Size" : "Frame / Style"}         
                               {" "}
                    </label>
                                       {" "}
                    <input
                      id="add-size"
                      type="text"
                      value={size}
                      onChange={(event) => setSize(event.target.value)}
                      placeholder={
                        type === "fragrance" ? "e.g. 100ml" : "e.g. Aviator"
                      }
                      disabled={uploading}
                      className="w-full rounded-xl border border-[#41004C]/10 bg-[#FFF9FF] px-4 py-3.5 text-sm text-[#41004C] outline-none focus:border-[#750080] focus:ring-2 focus:ring-[#750080]/10 disabled:opacity-60"
                    />
                                     {" "}
                  </div>
                                 {" "}
                </div>
                                {/* DESCRIPTION */}               {" "}
                <div>
                                   {" "}
                  <label
                    htmlFor="add-description"
                    className="mb-2 block text-sm font-medium text-[#41004C]"
                  >
                                        Description                  {" "}
                  </label>
                                   {" "}
                  <textarea
                    id="add-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Describe the product..."
                    rows={5}
                    required
                    disabled={uploading}
                    className="w-full resize-none rounded-xl border border-[#41004C]/10 bg-[#FFF9FF] px-4 py-3.5 text-sm leading-6 text-[#41004C] outline-none focus:border-[#750080] focus:ring-2 focus:ring-[#750080]/10 disabled:opacity-60"
                  />
                                 {" "}
                </div>
                                {/* IMAGE */}               {" "}
                <div>
                                   {" "}
                  <label
                    htmlFor="add-product-image"
                    className="mb-2 block text-sm font-medium text-[#41004C]"
                  >
                                        Product Image                  {" "}
                  </label>
                                   {" "}
                  <div className="rounded-2xl border border-dashed border-[#750080]/30 bg-[#F6EAF8]/40 p-5">
                                       {" "}
                    {imagePreview ? (
                      <div className="space-y-4">
                                               {" "}
                        <div className="overflow-hidden rounded-xl">
                                                   {" "}
                          <Image
                            src={imagePreview}
                            alt="product preview"
                            width={300}
                            height={300}
                            className="..."
                          />
                                                 {" "}
                        </div>
                                               {" "}
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          disabled={uploading}
                          className="text-sm font-medium text-[#750080] hover:underline disabled:opacity-50"
                        >
                                                    Remove image                
                                 {" "}
                        </button>
                                             {" "}
                      </div>
                    ) : (
                      <label
                        htmlFor="add-product-image"
                        className="flex cursor-pointer flex-col items-center justify-center py-10 text-center"
                      >
                                               {" "}
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F6EAF8] text-[#750080]">
                                                    <Plus size={24} />         
                                       {" "}
                        </div>
                                               {" "}
                        <p className="mt-4 text-sm font-medium text-[#41004C]">
                                                    Upload product image        
                                         {" "}
                        </p>
                                               {" "}
                        <p className="mt-1 text-xs text-[#41004C]/50">
                                                    PNG, JPG or WEBP · Max 5MB  
                                               {" "}
                        </p>
                                             {" "}
                      </label>
                    )}
                                       {" "}
                    <input
                      id="add-product-image"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                      disabled={uploading}
                      className="hidden"
                    />
                                     {" "}
                  </div>
                                 {" "}
                </div>
                                {/* BUTTONS */}               {" "}
                <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
                                   {" "}
                  <button
                    type="button"
                    onClick={() => {
                      if (!uploading) {
                        setShowAddProduct(false);

                        setError("");

                        resetForm();
                      }
                    }}
                    disabled={uploading}
                    className="rounded-full border border-[#41004C]/10 px-6 py-3 text-sm font-medium text-[#41004C] transition hover:bg-[#F6EAF8] disabled:opacity-50"
                  >
                                        Cancel                  {" "}
                  </button>
                                   {" "}
                  <button
                    type="submit"
                    disabled={uploading}
                    className="rounded-full bg-[#41004C] px-7 py-3 text-sm font-medium text-[#FFF9FF] transition hover:bg-[#750080] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                                       {" "}
                    {uploading ? "Uploading & Saving..." : "Save Product"}     
                               {" "}
                  </button>
                                 {" "}
                </div>
                             {" "}
              </form>
                         {" "}
            </div>
                     {" "}
          </div>
        )}
               {" "}
        {/* ========================================



            EDIT PRODUCT MODAL



        ======================================== */}
               {" "}
        {showEditProduct && editingProduct && (
          <div className="fixed inset-0 z-3000 flex items-center justify-center bg-[#41004C]/40 px-5 py-8 backdrop-blur-sm">
                       {" "}
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
                           {" "}
              <div className="flex items-center justify-between border-b border-[#41004C]/10 px-6 py-5 md:px-8">
                               {" "}
                <div>
                                   {" "}
                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#750080]">
                                        Dammys Essence                  {" "}
                  </p>
                                   {" "}
                  <h3 className="mt-1 font-serif text-2xl text-[#41004C]">
                                        Edit Product                  {" "}
                  </h3>
                                 {" "}
                </div>
                               {" "}
                <button
                  type="button"
                  onClick={() => {
                    if (!uploading) {
                      setShowEditProduct(false);

                      setError("");

                      resetForm();
                    }
                  }}
                  disabled={uploading}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[#41004C]/50 transition hover:bg-[#F6EAF8] hover:text-[#750080] disabled:opacity-40"
                >
                                    <X size={20} />               {" "}
                </button>
                             {" "}
              </div>
                           {" "}
              <form
                onSubmit={handleEditProduct}
                className="space-y-5 p-6 md:p-8"
              >
                                {/* NAME */}               {" "}
                <div>
                                   {" "}
                  <label
                    htmlFor="edit-name"
                    className="mb-2 block text-sm font-medium text-[#41004C]"
                  >
                                        Product Name                  {" "}
                  </label>
                                   {" "}
                  <input
                    id="edit-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    disabled={uploading}
                    className="w-full rounded-xl border border-[#41004C]/10 bg-[#FFF9FF] px-4 py-3.5 text-sm text-[#41004C] outline-none focus:border-[#750080] focus:ring-2 focus:ring-[#750080]/10 disabled:opacity-60"
                  />
                                 {" "}
                </div>
                                {/* TYPE + CATEGORY */}               {" "}
                <div className="grid gap-5 md:grid-cols-2">
                                   {" "}
                  <div>
                                       {" "}
                    <label
                      htmlFor="edit-type"
                      className="mb-2 block text-sm font-medium text-[#41004C]"
                    >
                                            Product Type                  
                       {" "}
                    </label>
                                       {" "}
                    <select
                      id="edit-type"
                      value={type}
                      onChange={(event) =>
                        setType(
                          event.target.value as "fragrance" | "sunglasses",
                        )
                      }
                      disabled={uploading}
                      className="w-full rounded-xl border border-[#41004C]/10 bg-[#FFF9FF] px-4 py-3.5 text-sm text-[#41004C] outline-none focus:border-[#750080] focus:ring-2 focus:ring-[#750080]/10 disabled:opacity-60"
                    >
                                           {" "}
                      <option value="fragrance">Fragrance</option>             
                              <option value="sunglasses">Sunglasses</option>   
                                     {" "}
                    </select>
                                     {" "}
                  </div>
                                   {" "}
                  <div>
                                       {" "}
                    <label
                      htmlFor="edit-category"
                      className="mb-2 block text-sm font-medium text-[#41004C]"
                    >
                                            Category                    {" "}
                    </label>
                                       {" "}
                    <select
                      id="edit-category"
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      disabled={uploading}
                      className="w-full rounded-xl border border-[#d9b7df] bg-white px-4 py-3 text-sm text-[#41004C] outline-none transition focus:border-[#750080] focus:ring-2 focus:ring-[#750080]/20"
                    >
                                           {" "}
                      <option value="">Select category</option>                 
                         {" "}
                      {type === "fragrance" ? (
                        <>
                                                   {" "}
                          <option value="For Him">For Him</option>             
                                      <option value="For Her">For Her</option> 
                                                 {" "}
                          <option value="Unisex">Unisex</option>               
                                 {" "}
                        </>
                      ) : (
                        <>
                                                   {" "}
                          <option value="Men">Men</option>                     
                              <option value="Women">Women</option>             
                                      <option value="Unisex">Unisex</option>   
                                             {" "}
                        </>
                      )}
                                         {" "}
                    </select>
                                     {" "}
                  </div>
                                 {" "}
                </div>
                                {/* PRICE + SIZE / FRAME */}               {" "}
                <div className="grid gap-5 md:grid-cols-2">
                                   {" "}
                  <div>
                                       {" "}
                    <label
                      htmlFor="edit-price"
                      className="mb-2 block text-sm font-medium text-[#41004C]"
                    >
                                            Price (₦)                    {" "}
                    </label>
                                       {" "}
                    <input
                      id="edit-price"
                      type="number"
                      min="0"
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
                      required
                      disabled={uploading}
                      className="w-full rounded-xl border border-[#41004C]/10 bg-[#FFF9FF] px-4 py-3.5 text-sm text-[#41004C] outline-none focus:border-[#750080] focus:ring-2 focus:ring-[#750080]/10 disabled:opacity-60"
                    />
                                     {" "}
                  </div>
                                   {" "}
                  <div>
                                       {" "}
                    <label
                      htmlFor="edit-size"
                      className="mb-2 block text-sm font-medium text-[#41004C]"
                    >
                                           {" "}
                      {type === "fragrance" ? "Size" : "Frame / Style"}         
                               {" "}
                    </label>
                                       {" "}
                    <input
                      id="edit-size"
                      type="text"
                      value={size}
                      onChange={(event) => setSize(event.target.value)}
                      placeholder={
                        type === "fragrance" ? "e.g. 100ml" : "e.g. Aviator"
                      }
                      disabled={uploading}
                      className="w-full rounded-xl border border-[#41004C]/10 bg-[#FFF9FF] px-4 py-3.5 text-sm text-[#41004C] outline-none focus:border-[#750080] focus:ring-2 focus:ring-[#750080]/10 disabled:opacity-60"
                    />
                                     {" "}
                  </div>
                                 {" "}
                </div>
                                {/* DESCRIPTION */}               {" "}
                <div>
                                   {" "}
                  <label
                    htmlFor="edit-description"
                    className="mb-2 block text-sm font-medium text-[#41004C]"
                  >
                                        Description                  {" "}
                  </label>
                                   {" "}
                  <textarea
                    id="edit-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={5}
                    required
                    disabled={uploading}
                    className="w-full resize-none rounded-xl border border-[#41004C]/10 bg-[#FFF9FF] px-4 py-3.5 text-sm leading-6 text-[#41004C] outline-none focus:border-[#750080] focus:ring-2 focus:ring-[#750080]/10 disabled:opacity-60"
                  />
                                 {" "}
                </div>
                                {/* IMAGE */}               {" "}
                <div>
                                   {" "}
                  <label
                    htmlFor="edit-product-image"
                    className="mb-2 block text-sm font-medium text-[#41004C]"
                  >
                                        Product Image                  {" "}
                  </label>
                                   {" "}
                  <div className="rounded-2xl border border-dashed border-[#750080]/30 bg-[#F6EAF8]/40 p-5">
                                       {" "}
                    {imagePreview ? (
                      <div className="space-y-4">
                                               {" "}
                        <div className="overflow-hidden rounded-xl">
                                                   {" "}
                          <Image
                            src={imagePreview}
                            alt="product preview"
                            width={300}
                            height={300}
                            className="..."
                          />
                                                 {" "}
                        </div>
                                               {" "}
                        <label
                          htmlFor="edit-product-image"
                          className="inline-block cursor-pointer text-sm font-medium text-[#750080] hover:underline"
                        >
                                                    Choose a different image    
                                             {" "}
                        </label>
                                             {" "}
                      </div>
                    ) : (
                      <label
                        htmlFor="edit-product-image"
                        className="flex cursor-pointer flex-col items-center justify-center py-10 text-center"
                      >
                                               {" "}
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F6EAF8] text-[#750080]">
                                                    <Plus size={24} />         
                                       {" "}
                        </div>
                                               {" "}
                        <p className="mt-4 text-sm font-medium text-[#41004C]">
                                                    Upload new product image    
                                             {" "}
                        </p>
                                               {" "}
                        <p className="mt-1 text-xs text-[#41004C]/50">
                                                    PNG, JPG or WEBP · Max 5MB  
                                               {" "}
                        </p>
                                             {" "}
                      </label>
                    )}
                                       {" "}
                    <input
                      id="edit-product-image"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                      disabled={uploading}
                      className="hidden"
                    />
                                     {" "}
                  </div>
                                 {" "}
                </div>
                                {/* BUTTONS */}               {" "}
                <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
                                   {" "}
                  <button
                    type="button"
                    onClick={() => {
                      if (!uploading) {
                        setShowEditProduct(false);

                        setError("");

                        resetForm();
                      }
                    }}
                    disabled={uploading}
                    className="rounded-full border border-[#41004C]/10 px-6 py-3 text-sm font-medium text-[#41004C] transition hover:bg-[#F6EAF8] disabled:opacity-50"
                  >
                                        Cancel                  {" "}
                  </button>
                                   {" "}
                  <button
                    type="submit"
                    disabled={uploading}
                    className="rounded-full bg-[#41004C] px-7 py-3 text-sm font-medium text-[#FFF9FF] transition hover:bg-[#750080] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                                       {" "}
                    {uploading ? "Updating..." : "Update Product"}             
                       {" "}
                  </button>
                                 {" "}
                </div>
                             {" "}
              </form>
                         {" "}
            </div>
                     {" "}
          </div>
        )}
               {" "}
        {/* ========================================



            DELETE CONFIRMATION MODAL



        ======================================== */}
               {" "}
        {deletingProduct && (
          <div className="fixed inset-0 z-4000 flex items-center justify-center bg-[#41004C]/50 px-5 backdrop-blur-sm">
                       {" "}
            <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
                           {" "}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                                <Trash2 size={25} />             {" "}
              </div>
                           {" "}
              <h3 className="mt-6 text-xl font-semibold text-[#41004C]">
                                Delete Product?              {" "}
              </h3>
                           {" "}
              <p className="mt-3 text-sm leading-6 text-[#41004C]/55">
                                Are you sure you want to delete                {" "}
                <span className="font-semibold text-[#41004C]">
                                    {deletingProduct.name}               {" "}
                </span>
                                ? This action cannot be undone.            
                 {" "}
              </p>
                           {" "}
              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                               {" "}
                <button
                  type="button"
                  onClick={() => setDeletingProduct(null)}
                  disabled={deleting}
                  className="rounded-full border border-[#41004C]/10 px-6 py-3 text-sm font-medium text-[#41004C] transition hover:bg-[#F6EAF8] disabled:opacity-50"
                >
                                    Cancel                {" "}
                </button>
                               {" "}
                <button
                  type="button"
                  onClick={handleDeleteProduct}
                  disabled={deleting}
                  className="rounded-full bg-red-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                                    {deleting ? "Deleting..." : "Yes, Delete"} 
                               {" "}
                </button>
                             {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </div>
        )}
             {" "}
      </section>
         {" "}
    </main>
  );
}
