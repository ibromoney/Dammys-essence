import "server-only";

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getAdminClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing server-side Supabase configuration.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

type OrderRequest = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: "delivery" | "pickup";
  address?: string;
  city?: string;
  state?: string;
  paymentMethod: "online" | "pay_on_delivery";
  items: Array<{
    productId: number;
    quantity: number;
  }>;
};

function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid order details." },
        { status: 400 },
      );
    }

    const input = body as Partial<OrderRequest>;

    const customerName = cleanText(input.customerName, 120);
    const customerEmail = cleanText(input.customerEmail, 254).toLowerCase();
    const customerPhone = cleanText(input.customerPhone, 30);

    if (
      customerName.length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail) ||
      customerPhone.length < 7
    ) {
      return NextResponse.json(
        { error: "Enter a valid name, email, and phone number." },
        { status: 400 },
      );
    }

    if (
      input.deliveryMethod !== "delivery" &&
      input.deliveryMethod !== "pickup"
    ) {
      return NextResponse.json(
        { error: "Choose a valid delivery method." },
        { status: 400 },
      );
    }

    if (
      input.paymentMethod !== "online" &&
      input.paymentMethod !== "pay_on_delivery"
    ) {
      return NextResponse.json(
        { error: "Choose a valid payment method." },
        { status: 400 },
      );
    }

    const address = cleanText(input.address, 300);
    const city = cleanText(input.city, 100);
    const state = cleanText(input.state, 100);

    if (
      input.deliveryMethod === "delivery" &&
      (!address || !city || !state)
    ) {
      return NextResponse.json(
        { error: "A delivery address, city, and state are required." },
        { status: 400 },
      );
    }

    if (
      !Array.isArray(input.items) ||
      input.items.length === 0 ||
      input.items.length > 20
    ) {
      return NextResponse.json(
        { error: "Your order must contain between 1 and 20 products." },
        { status: 400 },
      );
    }

    // Validate product IDs and quantities, combining repeated product IDs.
    const quantities = new Map<number, number>();

    for (const item of input.items) {
      if (
        !item ||
        !Number.isSafeInteger(item.productId) ||
        item.productId <= 0 ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 20
      ) {
        return NextResponse.json(
          { error: "One or more product quantities are invalid." },
          { status: 400 },
        );
      }

      const nextQuantity =
        (quantities.get(item.productId) ?? 0) + item.quantity;

      if (nextQuantity > 20) {
        return NextResponse.json(
          { error: "The maximum quantity per product is 20." },
          { status: 400 },
        );
      }

      quantities.set(item.productId, nextQuantity);
    }

    const supabase = getAdminClient();
    const productIds = Array.from(quantities.keys());

    // Fetch trusted prices from Supabase, never from the browser.
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, type, price, image")
      .in("id", productIds);

    if (productsError) {
      console.error("Product lookup failed:", productsError.message);

      return NextResponse.json(
        { error: "We could not verify your products. Please try again." },
        { status: 500 },
      );
    }

    if (!products || products.length !== productIds.length) {
      return NextResponse.json(
        { error: "A product is no longer available. Refresh your cart." },
        { status: 400 },
      );
    }

    const productMap = new Map(
      products.map((product) => [Number(product.id), product]),
    );

    const orderLines: Array<{
      product_id: number;
      product_name: string;
      product_type: "fragrance" | "sunglasses";
      product_image: string | null;
      unit_price: number;
      quantity: number;
      line_total: number;
    }> = [];

    let subtotal = 0;

    for (const [productId, quantity] of quantities.entries()) {
      const product = productMap.get(productId);
      const unitPrice = Number(product?.price);

      if (
        !product ||
        !Number.isFinite(unitPrice) ||
        unitPrice < 0 ||
        (product.type !== "fragrance" && product.type !== "sunglasses")
      ) {
        return NextResponse.json(
          { error: "A product has invalid pricing or details." },
          { status: 400 },
        );
      }

      const lineTotal = Math.round(unitPrice * quantity * 100) / 100;
      subtotal = Math.round((subtotal + lineTotal) * 100) / 100;

      orderLines.push({
        product_id: Number(product.id),
        product_name: product.name,
        product_type: product.type,
        product_image: product.image || null,
        unit_price: unitPrice,
        quantity,
        line_total: lineTotal,
      });
    }

    // Delivery fee remains zero until delivery charges are configured.
    const deliveryFee = 0;
    const totalAmount = Math.round((subtotal + deliveryFee) * 100) / 100;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        delivery_method: input.deliveryMethod,
        delivery_address:
          input.deliveryMethod === "delivery" ? address : null,
        delivery_city: input.deliveryMethod === "delivery" ? city : null,
        delivery_state: input.deliveryMethod === "delivery" ? state : null,
        payment_method: input.paymentMethod,
        payment_status: "pending",
        order_status: "pending",
        subtotal,
        delivery_fee: deliveryFee,
        total_amount: totalAmount,
      })
      .select("id, order_number, total_amount")
      .single();

    if (orderError || !order) {
      console.error("Order creation failed:", orderError?.message);

      return NextResponse.json(
        { error: "We could not create your order. Please try again." },
        { status: 500 },
      );
    }

    // Save order items.
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(
        orderLines.map((line) => ({
          ...line,
          order_id: order.id,
        })),
      );

    if (itemsError) {
      console.error("Order items creation failed:", itemsError.message);

      // Attempt to remove the order if its items could not be saved.
      const { error: rollbackError } = await supabase
        .from("orders")
        .delete()
        .eq("id", order.id);

      if (rollbackError) {
        console.error("Order rollback failed:", rollbackError.message);
      }

      return NextResponse.json(
        { error: "We could not save your order items. Please try again." },
        { status: 500 },
      );
    }

    // Return the saved order details needed for the confirmation and receipt.
    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          orderNumber: order.order_number,
          subtotal,
          deliveryFee,
          totalAmount: Number(order.total_amount),
          paymentStatus: "pending",
          orderStatus: "pending",
          paymentMethod: input.paymentMethod,
        },
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
        },
        delivery: {
          method: input.deliveryMethod,
          address: input.deliveryMethod === "delivery" ? address : null,
          city: input.deliveryMethod === "delivery" ? city : null,
          state: input.deliveryMethod === "delivery" ? state : null,
        },
        items: orderLines.map((line) => ({
          productId: line.product_id,
          name: line.product_name,
          type: line.product_type,
          image: line.product_image,
          unitPrice: line.unit_price,
          quantity: line.quantity,
          lineTotal: line.line_total,
        })),
        message:
          input.paymentMethod === "online"
            ? "Order created. Online payment must be completed separately."
            : "Order created. Payment is still pending.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Order API error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred while creating your order." },
      { status: 500 },
    );
  }
}
