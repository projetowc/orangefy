import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cs: { name: string; value: string; options?: Record<string, unknown> }[]) =>
          cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options as never)),
      },
    }
  );
}

export async function GET() {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("user_missions")
    .select("*")
    .eq("user_id", user.id);

  return NextResponse.json({ missions: data || [] });
}

export async function POST(req: NextRequest) {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { mission_id, checklist_item_id, completed } = await req.json();

  const { data: existing } = await supabase
    .from("user_missions")
    .select("*")
    .eq("user_id", user.id)
    .eq("mission_id", mission_id)
    .single();

  const progress = existing?.checklist_progress || {};
  progress[checklist_item_id] = completed;

  // Verifica quantos itens completados
  const totalChecked = Object.values(progress).filter(Boolean).length;

  const missionCompleted = existing?.completed || false;

  if (existing) {
    await supabase
      .from("user_missions")
      .update({
        checklist_progress: progress,
        completed: missionCompleted,
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("user_missions").insert({
      user_id: user.id,
      mission_id,
      checklist_progress: progress,
      completed: false,
    });
  }

  return NextResponse.json({ success: true, progress, totalChecked });
}

export async function PATCH(req: NextRequest) {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { mission_id, xp } = await req.json();

  // Marca missão como concluída
  const { data: existing } = await supabase
    .from("user_missions")
    .select("id, completed")
    .eq("user_id", user.id)
    .eq("mission_id", mission_id)
    .single();

  if (existing?.completed) return NextResponse.json({ already: true });

  if (existing) {
    await supabase
      .from("user_missions")
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq("id", existing.id);
  } else {
    await supabase.from("user_missions").insert({
      user_id: user.id,
      mission_id,
      completed: true,
      completed_at: new Date().toISOString(),
      checklist_progress: {},
    });
  }

  // Adiciona XP ao usuário
  const { data: profile } = await supabase
    .from("users")
    .select("xp, level")
    .eq("id", user.id)
    .single();

  if (profile) {
    const newXp = (profile.xp || 0) + xp;
    const newLevel = Math.floor(newXp / 1000) + 1;
    await supabase
      .from("users")
      .update({ xp: newXp, level: Math.min(newLevel, 10) })
      .eq("id", user.id);
  }

  return NextResponse.json({ success: true });
}
