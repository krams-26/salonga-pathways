import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Clock, FileText } from "lucide-react";

type App = {
  id: string;
  job_id: string;
  job_title: string;
  status: string;
  created_at: string;
};

const MyApplications = () => {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const [apps, setApps] = useState<App[] | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("applications")
      .select("id, job_id, job_title, status, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => setApps(data ?? []));
  }, [user]);

  if (!loading && !user) return <Navigate to="/auth" state={{ from: "/my-applications" }} replace />;

  const statusLabel = (s: string) =>
    s === "reviewing" ? t("mine.reviewing") : s === "interview" ? t("mine.interview") : s === "offer" ? t("mine.offer") : t("mine.submitted");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20">
        <div className="container max-w-4xl">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground">{t("mine.title")}</h1>

          {!apps ? (
            <div className="mt-10 nature-card p-10 text-center text-muted-foreground">…</div>
          ) : apps.length === 0 ? (
            <div className="mt-10 nature-card p-10 text-center">
              <FileText className="h-10 w-10 text-accent mx-auto mb-4" />
              <p className="text-muted-foreground">{t("mine.empty")}</p>
              <Link to="/opportunities" className="mt-6 inline-flex px-5 py-3 rounded-full bg-canopy text-primary-foreground text-sm font-medium">
                {t("nav.opportunities")}
              </Link>
            </div>
          ) : (
            <div className="mt-10 space-y-4">
              {apps.map((a) => (
                <Link
                  key={a.id}
                  to={`/opportunities/${a.job_id}`}
                  className="nature-card p-6 flex items-center justify-between gap-4 hover:border-accent/40"
                >
                  <div>
                    <div className="font-serif text-xl text-foreground">{a.job_title}</div>
                    <div className="mt-1 text-xs text-muted-foreground inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> {new Date(a.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent-soft text-primary border border-accent/30">
                    {statusLabel(a.status)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default MyApplications;
