import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // user fetch
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // user check
      if (user) {
        const { data: existingProfile } = await supabase
          .from("profile")
          .select("id")
          .eq("id", user.id)
          .single();

        // check profile exist or no or they signup with google
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

      // redirect user to specified redirect URL or root of app
      redirect(next);
    } else {
      // redirect the user to an error page with some instructions
      redirect(`/auth/error?error=${error?.message}`);
    }
  }

  // redirect the user to an error page with some instructions
  redirect(`/auth/error?error=No token hash or type`);
}
