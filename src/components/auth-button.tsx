import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

import { UserAvatar } from "@/components/custome/user-avatar";

export async function AuthButton() {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profile")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return user ? (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase overflow-hidden border relative">
          <UserAvatar 
            url={profile?.avatar_url} 
            fallbackText={profile?.full_name?.charAt(0) || user.email?.charAt(0) || "U"} 
          />
        </div>
        <span className="text-sm font-medium hidden sm:inline-block">
          {profile?.full_name || user.email}
        </span>
      </div>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Link href="/auth/login" className={buttonVariants({ size: "sm", variant: "outline" })}>
        Sign in
      </Link>
      <Link href="/auth/sign-up" className={buttonVariants({ size: "sm", variant: "default" })}>
        Sign up
      </Link>
    </div>
  );
}
