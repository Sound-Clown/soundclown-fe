// Tạo thanh toán (POST /api/payments/checkout)
export type CheckoutResult = {
  paymentUrl: string;
  txnRef: string;
  amount: number;
  currency: string;
};

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";

// Lịch sử giao dịch (GET /api/payments/me)
export type Payment = {
  id: number;
  txnRef: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  orderInfo?: string;
  durationDays: number;
  createdAt: string;
  paidAt: string | null;
};
