import { Leaf, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-canopy text-primary-foreground mt-24">
      <div className="container py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="h-10 w-10 rounded-2xl grid place-items-center bg-white/10 backdrop-blur">
              <Leaf className="h-5 w-5" />
            </span>
            <div>
              <div className="font-serif text-xl">Salonga National Park</div>
              <div className="text-xs uppercase tracking-[0.18em] opacity-70">UNESCO World Heritage</div>
            </div>
          </div>
          <p className="mt-6 max-w-md text-primary-foreground/80 leading-relaxed">{t("footer.about")}</p>
        </div>
        <div>
          <h4 className="font-serif text-lg mb-4">{t("footer.explore")}</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/organization" className="hover:text-accent">{t("footer.park")}</Link></li>
            <li><Link to="/opportunities" className="hover:text-accent">{t("footer.opportunities")}</Link></li>
            <li><Link to="/recruiter/login?redirect=%2Fdashboard" className="hover:text-accent">{t("footer.portal")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-lg mb-4">{t("footer.contact")}</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5" /> Monkoto, DR Congo</li>
            <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5" /> careers@salonga.org</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-primary-foreground/60">
          <p>{t("footer.rights", { year: new Date().getFullYear() })}</p>
          <p>{t("footer.crafted")}</p>
        </div>
      </div>
    </footer>
  );
};
