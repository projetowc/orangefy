import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as "invite" | "recovery" | "email" | null;

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as never)
          );
        },
      },
    }
  );

  // Fluxo via token_hash (link do e-mail de convite/recuperação)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      if (type === "invite" || type === "recovery") {
        return NextResponse.redirect(`${origin}/set-password`);
      }
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Fluxo via code (PKCE)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (type === "invite" || type === "recovery") {
        return NextResponse.redirect(`${origin}/set-password`);
      }
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Fallback: token inválido ou expirado
  return NextResponse.redirect(`${origin}/login?error=link_expirado`);
}
