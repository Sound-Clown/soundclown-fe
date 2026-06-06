import "server-only";
import type { ApiResponse } from "@/types";
import { SUCCESS_CODE } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetch public endpoint từ Server Component (RSC). Không gắn JWT.
 * Trả `result` nếu code === 1000, ngược lại trả null (để page xử lý notFound).
 */
export async function serverFetch<T>(
  path: string,
  init?: RequestInit & { revalidate?: number },
): Promise<T | null> {
  try {
    const { revalidate = 30, ...rest } = init ?? {};
    const res = await fetch(`${BASE_URL}${path}`, {
      ...rest,
      next: { revalidate },
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        ...(rest.headers ?? {}),
      },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ApiResponse<T>;
    if (json.code !== SUCCESS_CODE) return null;
    return json.result ?? null;
  } catch {
    return null;
  }
}
