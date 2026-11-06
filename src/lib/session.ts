import type { User } from "@supabase/supabase-js";
import { redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { localePath } from "@/i18n/routing";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/lib/member-store";

/** Sign-in page that returns the visitor to `next` afterwards. */
export const signinHref = (locale: string, next: string) =>
  `${localePath(locale, "signin")}?next=${encodeURIComponent(next)}`;

/**
 * Client-only gate for member pages: the session lives in browser storage,
 * so routes using this set `ssr: false`.
 */
export const requireSession = async (locale: string, href: string) => {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user) throw redirect({ href: signinHref(locale, href), replace: true });
  return { user };
};

/** Current signed-in user for UI affordances (header icons). */
export const useAuthUser = () => {
  const [state, setState] = useState<{ user: User | null; ready: boolean }>({
    user: null,
    ready: false,
  });

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (active) setState({ user: data.session?.user ?? null, ready: true });
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setState({ user: session?.user ?? null, ready: true });
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return state;
};

const metaString = (user: User, key: string) => {
  const value = (user.user_metadata as Record<string, unknown> | undefined)?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
};

export const displayName = (user: User, profile?: Profile) =>
  profile?.name?.trim() ||
  metaString(user, "full_name") ||
  metaString(user, "name") ||
  (user.email ?? "").split("@")[0] ||
  "HISA";

export const initialsOf = (name: string) =>
  name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "H";

export const signInProvider = (user: User) => {
  const provider = (user.app_metadata as Record<string, unknown> | undefined)?.["provider"];
  return provider === "google" ? "google" : "email";
};
