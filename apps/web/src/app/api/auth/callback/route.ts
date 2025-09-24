import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const redirectUrl = new URL("/", request.nextUrl.origin);
  if (error) {
    redirectUrl.pathname = "/signin";
    redirectUrl.searchParams.set(
      "error",
      errorDescription || error || "Google sign-in failed",
    );
  }

  return NextResponse.redirect(redirectUrl);
}

export async function POST(request: NextRequest) {
  // Some providers may POST back; normalize by redirecting in the same way
  return GET(request);
}

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/auth/supabase-client";

export async function GET(request: NextRequest) {
  try {
    // Parse the URL and get the code parameter
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    // Get the redirect destination (or default to home)
    const redirectTo = requestUrl.searchParams.get("redirect") || "/";

    if (code) {
      // Get Supabase client
      const supabase = getSupabaseClient();

      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Error exchanging code for session:", error);
        throw error;
      }

      // Successfully authenticated
    }

    // Redirect to the requested page or home
    return NextResponse.redirect(new URL(redirectTo, request.url));
  } catch (error) {
    console.error("Auth callback error:", error);

    // In case of error, redirect to sign-in with error message
    const errorUrl = new URL("/signin", request.url);
    errorUrl.searchParams.set(
      "error",
      "Authentication failed. Please try again.",
    );

    return NextResponse.redirect(errorUrl);
  }
}
