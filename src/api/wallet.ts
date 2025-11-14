const API_BASE = "http://localhost:8080";

export interface Wallet {
  id: number;
  balance: number;
  currency: string;
  status: string;
  user_id: string;
  total_spent: number;
  total_earned: number;
  total_refunded: number;
  locked_balance: number;
  token: number;
  created_at: string;
  updated_at: string;
}

export interface WalletResponse {
  code: number;
  result: Wallet;
}

export interface Transaction {
  id: number;
  amount: number;
  description: string;
  status: string;
  metadata: string;
  wallet_id: number;
  transaction_type: string;
  reference_type: string;
  reference_id: string;
  balance_before: number;
  balance_after: number;
  related_transaction_id: number | null;
  processed_by: string | null;
  processed_at: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionsResponse {
  code: number;
  result: {
    content: Transaction[];
    pageable: {
      pageNumber: number;
      pageSize: number;
      sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
      };
      offset: number;
      paged: boolean;
      unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    numberOfElements: number;
    first: boolean;
    empty: boolean;
  };
}

/**
 * Lấy thông tin ví của user hiện tại
 */
export async function getMyWallet(
  token: string,
  userId: string
): Promise<Wallet> {
  const url = `${API_BASE}/wallet-service/api/wallets/my`;

  const resp = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${token}`,
      "X-User-Id": userId,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const data: WalletResponse = await resp.json();
  if (data && data.code === 1000 && data.result) {
    return data.result;
  }

  throw new Error("Không thể lấy thông tin ví");
}

/**
 * Lấy danh sách giao dịch của ví
 */
export async function getMyTransactions(
  token: string,
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<TransactionsResponse["result"]> {
  const url = `${API_BASE}/wallet-service/api/wallets/my/transactions?page=${page}&limit=${limit}`;

  const resp = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${token}`,
      "X-User-Id": userId,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const data: TransactionsResponse = await resp.json();
  if (data && data.code === 1000 && data.result) {
    return data.result;
  }

  throw new Error("Không thể lấy danh sách giao dịch");
}

/**
 * Format số tiền theo định dạng VND
 */
export function formatCurrency(
  amount: number,
  currency: string = "VND"
): string {
  if (currency === "VND") {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }
  return `${amount} ${currency}`;
}

/**
 * Format transaction type thành tiếng Việt
 */
export function getTransactionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    WITHDRAW: "Rút tiền",
    PAYMENT: "Thanh toán",
    REFUND: "Hoàn tiền",
    TRANSFER: "Chuyển tiền",
    REWARD: "Thưởng",
    DEDUCTION: "Trừ tiền",
  };
  return labels[type] || type;
}

/**
 * Format transaction status thành tiếng Việt
 */
export function getTransactionStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    SUCCESS: "Thành công",
    PENDING: "Đang xử lý",
    FAILED: "Thất bại",
    CANCELLED: "Đã hủy",
    REFUNDED: "Đã hoàn tiền",
  };
  return labels[status] || status;
}

/**
 * Lấy màu badge cho transaction status
 */
export function getTransactionStatusColor(status: string): string {
  const colors: Record<string, string> = {
    SUCCESS: "success",
    PENDING: "warning",
    FAILED: "error",
    CANCELLED: "secondary",
    REFUNDED: "info",
  };
  return colors[status] || "secondary";
}

export interface DeductTokenRequest {
  tokens: number;
  description: string;
  user_id: string;
  reference_type: string;
  reference_id: string;
}

export interface TokenResponse {
  user_id: string;
  token_before: number;
  token_after: number;
  tokens_deducted: number;
  transaction_id: number;
  status: string;
  message: string;
}

export interface ApiResponse<T> {
  code: number;
  result: T;
}

/**
 * Trừ token từ ví của user
 */
export async function deductToken(
  token: string,
  userId: string,
  request: DeductTokenRequest
): Promise<TokenResponse> {
  const url = `${API_BASE}/wallet-service/internal/wallets/deduct-token`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      Authorization: `Bearer ${token}`,
      "X-User-Id": userId,
    },
    body: JSON.stringify(request),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const data: ApiResponse<TokenResponse> = await resp.json();
  if (data && data.code === 1000 && data.result) {
    return data.result;
  }

  throw new Error(data?.result?.message || "Không thể trừ token");
}