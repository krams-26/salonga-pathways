import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export const LangSwitcher = ({ transparent }: { transparent?: boolean }) => {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith("en") ? "en" : "fr";
  const next = current === "fr" ? "en" : "fr";

  return (
    <button
      onClick={() => i18n.changeLanguage(next)}
      aria-label="Change language"
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-smooth",
        transparent
          ? "text-white/85 hover:bg-white/10 hover:text-white"
          : "text-foreground/70 hover:bg-secondary hover:text-foreground"
      )}
    >
      <Globe className="h-3.5 w-3.5" />
      {current}
    </button>
  );
};
