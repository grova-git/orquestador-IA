import { createClient } from "@/utils/supabase/server";
import { InboxView } from "@/components/InboxView";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function InboxPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  // Obtener conversaciones de esta empresa
  const { data: conversations } = await supabase
    .from("conversations")
    .select("*")
    .eq("company_id", user.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="w-full">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Inbox de IA</h1>
        <p className="text-gray-400">Audita y revisa cómo la Inteligencia Artificial está interactuando con tus clientes.</p>
      </header>

      <InboxView conversations={conversations || []} />
    </div>
  );
}
