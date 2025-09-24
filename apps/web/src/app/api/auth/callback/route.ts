import type { NextRequest } from "next/server";
import { getSupabaseClient } from "@/lib/auth/supabase-client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redirect") || "/";

  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  if (error) {
    const back = new URL("/signin", requestUrl.origin);
    back.searchParams.set(
      "error",
      errorDescription || error || "Google sign-in failed",
    );
    return Response.redirect(back);
  }

  if (code) {
    try {
      const supabase = getSupabaseClient();
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
        code,
      );
      if (exchangeError) {
        throw exchangeError;
      }
    } catch (_e) {
      const errUrl = new URL("/signin", requestUrl.origin);
      errUrl.searchParams.set(
        "error",
        "Authentication failed. Please try again.",
      );
      return Response.redirect(errUrl);
    }
  }

  return Response.redirect(new URL(redirectTo, requestUrl.origin));
}

export const POST = GET;
