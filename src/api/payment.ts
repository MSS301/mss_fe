const API_BASE = "http://localhost:8080";

export interface Package {
  id: number;
  name: string;
  code: string;
  description: string;
  credits: number;
  bonusCredits: number;
  price: number;
  currency: string;
  isActive: boolean;
  sortOrder: number;
  metadata: string;
  createdAt: string;
  updatedAt: string;
}

export interface PackagesResponse {
  code: number;
  message: string;
  result: Package[];
}

export interface PaymentResponse {
  orderId: number;
  orderCode: string;
  userId: string;
  packageId: number;
  packageName: string;
  credits: number;
  bonusCredits: number;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  currency: string;
  status: string;
  description: string;
  paymentUrl: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

// Alias for backward compatibility
export type OrderResponse = PaymentResponse;

export interface CreatePaymentRequest {
  packageId: number;
  paymentMethodCode: string;
  promotionCode: string;
  userId: string;
}

export interface CreatePaymentResponse {
  code: number;
  message: string;
  result: PaymentResponse;
}

/**
 * Lấy danh sách packages
 */
export async function getPackages(token: string): Promise<Package[]> {
  const url = `${API_BASE}/payment-service/api/payments/packages`;

  const resp = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const data: PackagesResponse = await resp.json();
  if (data && data.code === 1000 && data.result) {
    // Filter only active packages and sort by sortOrder
    return data.result
      .filter((pkg) => pkg.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  throw new Error("Không thể lấy danh sách gói");
}

/**
 * Tạo order payment cho package
 */
export async function createPayment(
  token: string,
  packageId: number,
  userId: string,
  paymentMethodCode: string = "PayOS",
  promotionCode: string = ""
): Promise<PaymentResponse> {
  const url = `${API_BASE}/payment-service/api/payments/orders/create`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      packageId,
      paymentMethodCode,
      promotionCode,
      userId,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const data: PaymentResponse = await resp.json();
  if (data && data.orderId) {
    return data;
  }

  throw new Error("Không thể tạo thanh toán");
}

/**
 * Format số tiền theo định dạng VND
 */
export function formatPrice(price: number, currency: string = "VND"): string {
  if (currency === "VND") {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }
  return `${price} ${currency}`;
}

/**
 * Format số credits
 */
export function formatCredits(credits: number): string {
  return new Intl.NumberFormat("vi-VN").format(credits);
}

/**
 * Parse metadata JSON
 */
export function parseMetadata(metadata: string): Record<string, any> {
  try {
    return JSON.parse(metadata);
  } catch {
    return {};
  }
}

/**
 * Lấy userId từ JWT token
 */
export function getUserIdFromToken(token: string): string {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.sub || "";
  } catch {
    return "";
  }
}
