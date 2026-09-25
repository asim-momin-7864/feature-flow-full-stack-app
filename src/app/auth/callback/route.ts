import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Fetch user to check/create profile
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: existingProfile } = await supabase
          .from("profile")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!existingProfile) {
          await supabase.from("profile").insert({
            id: user.id,
            full_name: user.user_metadata.full_name || "UnNamed User",
            avatar_url:
              user.user_metadata.avatar_url ||
              "https://img.magnific.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?semt=ais_hybrid&w=740&q=80",
            role: "USER",
          });
        }
      }

      // Redirect to the next page
      return NextResponse.redirect(new URL(next, request.url));
    } else {
      console.error("exchangeCodeForSession error:", error.message);
      return NextResponse.redirect(
        new URL(
          `/auth/error?error=${encodeURIComponent(error.message)}`,
          request.url,
        ),
      );
    }
  }

  // If there's no code
  return NextResponse.redirect(
    new URL("/auth/error?error=NoCodeProvided", request.url),
  );
}
