import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { JobCard } from "@/components/site/JobCard";
import { jobs } from "@/data/jobs";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = ["All", "Field", "Research", "NGO"] as const;
const locations = ["All locations", ...Array.from(new Set(jobs.map((j) => j.location)))];

const Opportunities = () => {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const [loc, setLoc] = useState<string>("All locations");

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchQ = !q || (j.title + j.summary + j.mission).toLowerCase().includes(q.toLowerCase());
      const matchC = cat === "All" || j.category === cat;
      const matchL = loc === "All locations" || j.location === loc;
      return matchQ && matchC && matchL;
    });
  }, [q, cat, loc]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-36 pb-12 bg-leaf">
        <div className="container">
          <span className="text-xs uppercase tracking-[0.22em] text-accent font-semibold">Opportunities</span>
          <h1 className="mt-3 font-serif text-5xl md:text-6xl text-foreground leading-[1.05] max-w-3xl text-balance">
            Roles that move the needle for the rainforest.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            From patrol to publication — explore live missions across Salonga and join a team protecting one of the planet's last great wildernesses.
          </p>
        </div>
      </section>

      <section className="container -mt-8 relative z-10">
        <div className="glass rounded-2xl shadow-soft p-4 md:p-5 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-background/60 border border-border">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search roles, missions, skills…"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
          </div>
          <select
            value={loc}
            onChange={(e) => setLoc(e.target.value)}
            className="px-4 py-3 rounded-xl bg-background/60 border border-border text-sm outline-none cursor-pointer"
          >
            {locations.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium border transition-smooth",
                cat === c
                  ? "bg-canopy text-primary-foreground border-transparent shadow-soft"
                  : "bg-card text-foreground border-border hover:border-accent/40"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="container py-16">
        <div className="mb-6 text-sm text-muted-foreground">{filtered.length} open role{filtered.length !== 1 ? "s" : ""}</div>
        {filtered.length === 0 ? (
          <div className="nature-card p-12 text-center text-muted-foreground">No roles match your search yet — try widening your filters.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((j) => <JobCard key={j.id} job={j} />)}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Opportunities;
