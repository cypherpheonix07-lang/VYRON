import { withSupabase } from "npm:@supabase/server";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface MockGenRequest {
  project_id?: string;
  requirements_text?: string;
  backend_blueprint?: any;
}

function synthesizeMockData(backendBlueprint?: any): Record<string, Array<Record<string, any>>> {
  // Generate deterministic UUIDs with strictly preserved foreign key referential integrity
  const customerIds = Array.from({ length: 12 }, (_, i) => `10000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`);
  const productIds = Array.from({ length: 16 }, (_, i) => `20000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`);
  const orderIds = Array.from({ length: 16 }, (_, i) => `30000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`);
  const orderItemIds = Array.from({ length: 20 }, (_, i) => `40000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`);

  const customerNames = [
    "Aarav Sharma", "Priya Nair", "Vikram Malhotra", "Ananya Iyer", "Rohan Mehta",
    "Sneha Patel", "Aditya Verma", "Kavita Rao", "Siddharth Gupta", "Meera Joshi",
    "Rajesh Kumar", "Divya Menon"
  ];

  const customers = customerIds.map((id, idx) => ({
    id,
    auth_user_id: `auth-${id}`,
    email: `${customerNames[idx].toLowerCase().replace(/\s+/g, ".")}@example.com`,
    full_name: customerNames[idx],
    created_at: new Date(Date.now() - (idx + 1) * 86400000 * 3).toISOString(),
  }));

  const productTitles = [
    { title: "Obsidian Pro Monitor Arm", sku: "SKU-MON-01", price: 14900, category: "Hardware" },
    { title: "Quantum Mechanical Keyboard (Cherry Brown)", sku: "SKU-KEY-02", price: 18500, category: "Peripherals" },
    { title: "Ergonomic Mesh Task Chair", sku: "SKU-CHR-03", price: 34900, category: "Furniture" },
    { title: "Studio Noise-Cancelling Headphones", sku: "SKU-AUD-04", price: 28900, category: "Audio" },
    { title: "Thunderbolt 4 Docking Station (10-in-1)", sku: "SKU-DCK-05", price: 21900, category: "Hardware" },
    { title: "Magnetic Wireless Charging Pad", sku: "SKU-CHG-06", price: 4900, category: "Accessories" },
    { title: "Ultra-Wide 34-inch Curved OLED Display", sku: "SKU-DSP-07", price: 89900, category: "Displays" },
    { title: "Precision Wireless Laser Mouse", sku: "SKU-MOU-08", price: 8900, category: "Peripherals" },
    { title: "High-Speed USB-C Braided Cable 2M", sku: "SKU-CBL-09", price: 2500, category: "Accessories" },
    { title: "Desk Mat Extended Felt & Leather", sku: "SKU-MAT-10", price: 3900, category: "Accessories" },
    { title: "Smart Ambient LED Lightbar", sku: "SKU-LGT-11", price: 6500, category: "Lighting" },
    { title: "Portable 2TB NVMe SSD", sku: "SKU-SSD-12", price: 17900, category: "Storage" },
    { title: "Dual Monitor Laptop Riser", sku: "SKU-RSR-13", price: 7200, category: "Hardware" },
    { title: "Mechanical Keycap Artisan Set", sku: "SKU-CAP-14", price: 5400, category: "Peripherals" },
    { title: "Acoustic Wall Panels (Pack of 8)", sku: "SKU-PAN-15", price: 9800, category: "Studio" },
    { title: "Smart Temperature Control Desk Mug", sku: "SKU-MUG-16", price: 6900, category: "Lifestyle" },
  ];

  const products = productIds.map((id, idx) => ({
    id,
    title: productTitles[idx].title,
    sku: productTitles[idx].sku,
    price_cents: productTitles[idx].price,
    stock_quantity: 15 + idx * 8,
    category: productTitles[idx].category,
    created_at: new Date(Date.now() - (idx + 1) * 86400000 * 5).toISOString(),
  }));

  const orderStatuses = ["paid", "paid", "pending", "paid", "refunded", "paid"];

  const orders = orderIds.map((id, idx) => {
    const custId = customerIds[idx % customerIds.length];
    return {
      id,
      customer_id: custId,
      total_amount_cents: (idx + 2) * 9500,
      payment_status: orderStatuses[idx % orderStatuses.length],
      tracking_number: `TRK-2026-${String(1000 + idx)}`,
      created_at: new Date(Date.now() - idx * 86400000).toISOString(),
    };
  });

  const orderItems = orderItemIds.map((id, idx) => {
    const orderId = orderIds[idx % orderIds.length];
    const prodId = productIds[idx % productIds.length];
    const product = products.find((p) => p.id === prodId)!;
    const qty = (idx % 3) + 1;

    return {
      id,
      order_id: orderId,
      product_id: prodId,
      quantity: qty,
      unit_price_cents: product.price_cents,
    };
  });

  return {
    customers,
    products,
    orders,
    order_items: orderItems,
  };
}

export default {
  fetch: withSupabase({ auth: "none" }, async (req, ctx) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    try {
      const body: MockGenRequest = await req.json().catch(() => ({}));
      const mockData = synthesizeMockData(body.backend_blueprint);

      const totalRows = Object.values(mockData).reduce((sum, list) => sum + list.length, 0);

      // Persist to website_projects
      if (ctx.supabase && body.project_id) {
        await ctx.supabase
          .from("website_projects")
          .update({
            mock_data: mockData,
            status: "previewing",
            generation_step: 4,
            updated_at: new Date().toISOString(),
          })
          .eq("id", body.project_id);

        await ctx.supabase.from("website_generations").insert({
          website_project_id: body.project_id,
          generation_number: 3,
          trigger_type: "initial",
          user_feedback: `Generated ${totalRows} mock rows with referential integrity`,
          input_snapshot: { backend_blueprint: body.backend_blueprint },
          output_snapshot: { mock_data_summary: { totalRows, tables: Object.keys(mockData) } },
          llm_metadata: { generator: "brahma-mock-engine-v1" },
        });
      }

      return new Response(
        JSON.stringify({
          ok: true,
          mock_data: mockData,
          row_count: totalRows,
        }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    } catch (err: any) {
      console.error("[website-generate-mock] Error:", err);
      const fallback = synthesizeMockData();
      const totalRows = Object.values(fallback).reduce((sum, list) => sum + list.length, 0);

      return new Response(
        JSON.stringify({
          ok: true,
          fallback_used: true,
          mock_data: fallback,
          row_count: totalRows,
          error: err?.message,
        }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
  }),
};
