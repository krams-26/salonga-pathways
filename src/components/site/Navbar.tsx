import { Link, NavLink, useLocation } from "react-router-dom";
import { Leaf, LogOut, Menu, Shield, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { LangSwitcher } from "./LangSwitcher";

export const Navbar = ({ transparentOnTop = false }: { transparentOnTop?: boolean }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { isStaff, isAdmin } = useUserRole();

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/opportunities", label: t("nav.opportunities") },
    { to: "/organization", label: t("nav.park") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const transparent = transparentOnTop && !scrolled;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-smooth",
        transparent ? "bg-transparent" : "glass shadow-soft"
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className={cn("h-10 w-10 rounded-2xl grid place-items-center transition-smooth", transparent ? "bg-white/15 backdrop-blur-md" : "bg-canopy")}>
            <Leaf className={cn("h-5 w-5", transparent ? "text-white" : "text-primary-foreground")} />
          </span>
          <div className="leading-tight">
            <div className={cn("font-serif text-lg font-semibold", transparent ? "text-white" : "text-foreground")}>Salonga</div>
            <div className={cn("text-[10px] uppercase tracking-[0.18em]", transparent ? "text-white/70" : "text-muted-foreground")}>National Park</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-smooth",
                  transparent ? "text-white/85 hover:text-white hover:bg-white/10" : "text-foreground/75 hover:text-foreground hover:bg-secondary",
                  isActive && (transparent ? "bg-white/15 text-white" : "bg-secondary text-foreground")
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <LangSwitcher transparent={transparent} />
          {user ? (
            <>
              <Link
                to="/my-applications"
                className={cn(
                  "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-smooth",
                  transparent ? "text-white/85 hover:bg-white/10" : "text-foreground/75 hover:bg-secondary"
                )}
              >
                <User className="h-4 w-4" /> {t("nav.myApplications")}
              </Link>
              <button
                onClick={signOut}
                className={cn(
                  "h-9 w-9 grid place-items-center rounded-full transition-smooth",
                  transparent ? "text-white/85 hover:bg-white/10" : "text-foreground/70 hover:bg-secondary"
                )}
                aria-label={t("nav.signOut")}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-smooth",
                transparent ? "text-white/85 hover:bg-white/10" : "text-foreground/75 hover:bg-secondary"
              )}
            >
              {t("nav.signIn")}
            </Link>
          )}
          <Link
            to="/opportunities"
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-medium transition-smooth",
              transparent ? "bg-white text-primary hover:bg-accent hover:text-accent-foreground" : "bg-canopy text-primary-foreground hover:opacity-90 shadow-soft"
            )}
          >
            {t("nav.cta")}
          </Link>
        </div>

        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className={cn("md:hidden h-10 w-10 grid place-items-center rounded-full", transparent ? "text-white bg-white/10" : "text-foreground bg-secondary")}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-border/40 animate-fade-in">
          <div className="container py-4 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  cn("px-4 py-3 rounded-xl text-sm font-medium", isActive ? "bg-secondary text-foreground" : "text-foreground/80")
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="flex items-center justify-between px-4 py-2">
              <LangSwitcher />
              {user ? (
                <button onClick={signOut} className="text-sm text-foreground/70 inline-flex items-center gap-1.5">
                  <LogOut className="h-4 w-4" /> {t("nav.signOut")}
                </button>
              ) : (
                <Link to="/auth" className="text-sm text-foreground/70">{t("nav.signIn")}</Link>
              )}
            </div>
            {user && (
              <NavLink to="/my-applications" className="px-4 py-3 rounded-xl text-sm font-medium text-foreground/80">
                {t("nav.myApplications")}
              </NavLink>
            )}
            <Link to="/opportunities" className="mt-2 px-4 py-3 rounded-xl bg-canopy text-primary-foreground text-sm font-medium text-center">
              {t("nav.cta")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
