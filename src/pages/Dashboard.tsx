import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Filter, Users } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type Status = "submitted" | "reviewing" | "interview" | "offer" | "rejected";

type AppRow = {
  id: string;
  full_name: string;
  email: string;
  job_title: string;
  status: Status;
  created_at: string;
};

const statusStyles: Record<Status, string> = {
  submitted: "bg-accent-soft text-primary border-accent/30",
  reviewing: "bg-secondary text-secondary-foreground border-primary/15",
  interview: "bg-earth-soft text-earth border-earth/30",
  offer: "bg-canopy text-primary-foreground border-transparent",
  rejected: "bg-secondary text-muted-foreground border-border",
};

const statusOrder: Status[] = ["submitted", "reviewing", "interview", "offer", "rejected"];

const Dashboard = () => {
  const { t } = useTranslation();
  const [rows, setRows] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("applications")
      .select("id, full_name, email, job_title, status, created_at")
      .order("created_at", { ascending: false });
    if (error || !data) {
      setRows([]);
    } else {
      setRows(data as AppRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const onChangeStatus = async (id: string, status: Status) => {
    const { error } = await supabase.from("applications").update({ status }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    toast.success(t("dashboard.statusUpdated"));
  };

  const stats = useMemo(() => {
    const total = rows.length;
    const byStatus = (s: Status) => rows.filter((r) => r.status === s).length;
    return [
      { label: t("dashboard.stats.total"), value: total },
      { label: t("dashboard.statuses.submitted"), value: byStatus("submitted") },
      { label: t("dashboard.statuses.reviewing"), value: byStatus("reviewing") },
      { label: t("dashboard.statuses.offer"), value: byStatus("offer") },
    ];
  }, [rows, t]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-10">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.22em] text-accent font-semibold">
                {t("dashboard.eyebrow")}
              </span>
              <h1 className="mt-3 font-serif text-4xl md:text-5xl text-foreground leading-tight">
                {t("dashboard.title")}
              </h1>
              <p className="mt-2 text-muted-foreground">{t("dashboard.lead")}</p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="nature-card p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</span>
                  <span className="h-9 w-9 grid place-items-center rounded-full bg-leaf text-primary">
                    <Users className="h-4 w-4" />
                  </span>
                </div>
                <div className="mt-4 font-serif text-4xl text-foreground">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 nature-card p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-foreground">{t("dashboard.recent")}</h2>
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5" /> {rows.length}
              </span>
            </div>

            {loading ? (
              <div className="text-sm text-muted-foreground">…</div>
            ) : rows.length === 0 ? (
              <div className="text-sm text-muted-foreground">{t("dashboard.empty")}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
                      <th className="py-3 font-medium">{t("dashboard.candidate")}</th>
                      <th className="py-3 font-medium">{t("dashboard.role")}</th>
                      <th className="py-3 font-medium">{t("dashboard.status")}</th>
                      <th className="py-3 font-medium text-right">{t("dashboard.activity")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((c) => (
                      <tr key={c.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/40 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-leaf grid place-items-center font-serif text-primary">
                              {c.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{c.full_name}</div>
                              <div className="text-xs text-muted-foreground">{c.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-muted-foreground">{c.job_title}</td>
                        <td className="py-4">
                          <select
                            value={c.status}
                            onChange={(e) => onChangeStatus(c.id, e.target.value as Status)}
                            className={cn(
                              "px-3 py-1 rounded-full text-xs font-medium border outline-none cursor-pointer",
                              statusStyles[c.status]
                            )}
                          >
                            {statusOrder.map((s) => (
                              <option key={s} value={s} className="bg-background text-foreground">
                                {t(`dashboard.statuses.${s}`)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-4 text-right text-xs text-muted-foreground">
                          {new Date(c.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;
