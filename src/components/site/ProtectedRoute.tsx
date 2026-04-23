import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole, type AppRole } from "@/hooks/useUserRole";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

type Props = {
  children: ReactNode;
  requiredRole?: AppRole | "staff";
};

export const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isRecruiter, isStaff, loading: roleLoading } = useUserRole();
  const location = useLocation();

  if (authLoading || (user && roleLoading)) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="text-sm text-muted-foreground">…</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  let allowed = true;
  if (requiredRole === "admin") allowed = isAdmin;
  else if (requiredRole === "recruiter") allowed = isRecruiter;
  else if (requiredRole === "staff") allowed = isStaff;

  if (!allowed) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-32 pb-20">
          <div className="container max-w-lg text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-earth-soft grid place-items-center mb-6">
              <ShieldAlert className="h-8 w-8 text-earth" />
            </div>
            <h1 className="font-serif text-3xl text-foreground">{t("access.denied")}</h1>
            <p className="mt-3 text-muted-foreground">{t("access.deniedLead")}</p>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return <>{children}</>;
};
