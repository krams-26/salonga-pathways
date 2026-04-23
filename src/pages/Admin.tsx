import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Shield, UserPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import type { AppRole } from "@/hooks/useUserRole";

type RoleRow = {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
  full_name: string | null;
};

const Admin = () => {
  const { t } = useTranslation();
  const [rows, setRows] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetUserId, setTargetUserId] = useState("");
  const [role, setRole] = useState<AppRole>("recruiter");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: roles, error } = await supabase
      .from("user_roles")
      .select("id, user_id, role, created_at")
      .order("created_at", { ascending: false });
    if (error || !roles) {
      setRows([]);
      setLoading(false);
      return;
    }
    const ids = Array.from(new Set(roles.map((r) => r.user_id)));
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", ids);
    const nameById = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));
    setRows(
      roles.map((r) => ({
        ...(r as { id: string; user_id: string; role: AppRole; created_at: string }),
        full_name: nameById.get(r.user_id) ?? null,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const onAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId.trim()) return;
    setBusy(true);
    const { error } = await supabase.from("user_roles").insert({
      user_id: targetUserId.trim(),
      role,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(t("admin.assignSuccess"));
    setTargetUserId("");
    load();
  };

  const onDelete = async (id: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(t("admin.removeSuccess"));
    load();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-10">
        <div className="container">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <span className="text-xs uppercase tracking-[0.22em] text-accent font-semibold">
                {t("admin.eyebrow")}
              </span>
              <h1 className="mt-3 font-serif text-4xl md:text-5xl text-foreground leading-tight">
                {t("admin.title")}
              </h1>
              <p className="mt-2 text-muted-foreground">{t("admin.lead")}</p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="nature-card p-6 md:p-8 lg:col-span-1">
              <div className="flex items-center gap-2 mb-2">
                <UserPlus className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-xl text-foreground">{t("admin.assignTitle")}</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-5">{t("admin.assignLead")}</p>
              <form onSubmit={onAssign} className="space-y-3">
                <input
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  placeholder={t("admin.userIdPlaceholder")}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border outline-none text-sm focus:border-accent"
                  required
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AppRole)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border outline-none text-sm focus:border-accent"
                >
                  <option value="recruiter">{t("roles.recruiter")}</option>
                  <option value="admin">{t("roles.admin")}</option>
                  <option value="candidate">{t("roles.candidate")}</option>
                </select>
                <button
                  disabled={busy}
                  className="w-full px-5 py-3 rounded-xl bg-canopy text-primary-foreground font-medium hover:shadow-leaf transition-smooth disabled:opacity-50"
                >
                  {busy ? "…" : t("admin.assign")}
                </button>
              </form>
              <p className="mt-4 text-xs text-muted-foreground">{t("admin.userIdHint")}</p>
            </div>

            <div className="nature-card p-6 md:p-8 lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-xl text-foreground">{t("admin.listTitle")}</h2>
              </div>
              {loading ? (
                <div className="text-sm text-muted-foreground">…</div>
              ) : rows.length === 0 ? (
                <div className="text-sm text-muted-foreground">{t("admin.empty")}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
                        <th className="py-3 font-medium">{t("admin.user")}</th>
                        <th className="py-3 font-medium">{t("admin.role")}</th>
                        <th className="py-3 font-medium text-right"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr key={r.id} className="border-b border-border/60 last:border-0">
                          <td className="py-4">
                            <div className="font-medium text-foreground">
                              {r.full_name || "—"}
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">{r.user_id}</div>
                          </td>
                          <td className="py-4">
                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-leaf text-primary border border-primary/15">
                              {t(`roles.${r.role}`)}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => onDelete(r.id)}
                              className="inline-flex items-center gap-1.5 text-xs text-earth hover:opacity-80"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> {t("admin.remove")}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Admin;
