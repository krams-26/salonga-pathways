import { Link, NavLink, useLocation } from "react-router-dom";
import { Leaf, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/opportunities", label: "Opportunities" },
  { to: "/organization", label: "The Park" },
  { to: "/dashboard", label: "Dashboard" },
];

export const Navbar = ({ transparentOnTop = false }: { transparentOnTop?: boolean }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

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
          <span
            className={cn(
              "h-10 w-10 rounded-2xl grid place-items-center transition-smooth",
              transparent ? "bg-white/15 backdrop-blur-md" : "bg-canopy"
            )}
          >
            <Leaf className={cn("h-5 w-5", transparent ? "text-white" : "text-primary-foreground")} />
          </span>
          <div className="leading-tight">
            <div className={cn("font-serif text-lg font-semibold", transparent ? "text-white" : "text-foreground")}>
              Salonga
            </div>
            <div className={cn("text-[10px] uppercase tracking-[0.18em]", transparent ? "text-white/70" : "text-muted-foreground")}>
              National Park
            </div>
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
                  transparent
                    ? "text-white/85 hover:text-white hover:bg-white/10"
                    : "text-foreground/75 hover:text-foreground hover:bg-secondary",
                  isActive && (transparent ? "bg-white/15 text-white" : "bg-secondary text-foreground")
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/opportunities"
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-medium transition-smooth",
              transparent
                ? "bg-white text-primary hover:bg-accent hover:text-accent-foreground"
                : "bg-canopy text-primary-foreground hover:opacity-90 shadow-soft"
            )}
          >
            Join the mission
          </Link>
        </div>

        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "md:hidden h-10 w-10 grid place-items-center rounded-full",
            transparent ? "text-white bg-white/10" : "text-foreground bg-secondary"
          )}
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
                  cn(
                    "px-4 py-3 rounded-xl text-sm font-medium",
                    isActive ? "bg-secondary text-foreground" : "text-foreground/80"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/opportunities" className="mt-2 px-4 py-3 rounded-xl bg-canopy text-primary-foreground text-sm font-medium text-center">
              Join the mission
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
