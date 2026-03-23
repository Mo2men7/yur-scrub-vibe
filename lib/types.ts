export type Product = {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: string[];
  is_active: boolean;
  created_at: string;
};

export type OrderStatus =
  | "pending"
  | "awaiting_confirmation"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cod" | "bank_transfer";

export type Order = {
  id: string;
  product_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  size: string;
  color: string;
  payment_method: PaymentMethod;
  transfer_screenshot_url: string | null;
  status: OrderStatus;
  total_price: number;
  created_at: string;
  products?: Product;
};

export type OrderFormData = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  size: string;
  color: string;
  payment_method: PaymentMethod;
  transfer_screenshot?: File;
};
