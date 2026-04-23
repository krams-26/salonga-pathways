import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CheckCircle2, Clock, Filter, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Active applications", value: "248", trend: "+12% this month", icon: Users },
  { label: "Open positions", value: "8", trend: "3 closing soon", icon: Filter },
  { label: "Hired this year", value: "34", trend: "+8 vs last year", icon: TrendingUp },
  { label: "Avg. time to hire", value: "21d", trend: "-3d improved", icon: Clock },
];

type Status = "New" | "Reviewing" | "Interview" | "Offer";
const candidates: { name: string; role: string; location: string; status: Status; days: number }[] = [
  { name: "Amani Lokoso", role: "Anti-Poaching Ranger", location: "Monkoto", status: "Interview", days: 4 },
  { name: "Dr. Léa Mbenga", role: "Bonobo Researcher", location: "Lomako", status: "Reviewing", days: 2 },
  { name: "Joseph Iyanga", role: "Community Liaison", location: "Boende", status: "New", days: 1 },
  { name: "Sarah Kowalski", role: "GIS Analyst", location: "Remote", status: "Offer", days: 7 },
  { name: "Patrick Bofili", role: "River Patrol Officer", location: "Salonga", status: "Reviewing", days: 5 },
  { name: "Dr. Niamh O'Connor", role: "Wildlife Veterinarian", location: "Mobile", status: "Interview", days: 3 },
];

const statusStyles: Record<Status, string> = {
  New: "bg-accent-soft text-primary border-accent/30",
  Reviewing: "bg-secondary text-secondary-foreground border-primary/15",
  Interview: "bg-earth-soft text-earth border-earth/30",
  Offer: "bg-canopy text-primary-foreground border-transparent",
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-10">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.22em] text-accent font-semibold">Recruiter portal</span>
              <h1 className="mt-3 font-serif text-4xl md:text-5xl text-foreground leading-tight">Applications dashboard</h1>
              <p className="mt-2 text-muted-foreground">A calm overview of candidates moving through the pipeline.</p>
            </div>
            <button className="px-5 py-3 rounded-full bg-canopy text-primary-foreground text-sm font-medium shadow-soft hover:shadow-leaf transition-smooth">
              + New role
            </button>
          </div>

          {/* STATS */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="nature-card p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</span>
                  <span className="h-9 w-9 grid place-items-center rounded-full bg-leaf text-primary"><s.icon className="h-4 w-4" /></span>
                </div>
                <div className="mt-4 font-serif text-4xl text-foreground">{s.value}</div>
                <div className="mt-1 text-xs text-accent font-medium">{s.trend}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {/* CANDIDATES TABLE */}
            <div className="lg:col-span-2 nature-card p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl text-foreground">Recent candidates</h2>
                <button className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5" /> Filter
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
                      <th className="py-3 font-medium">Candidate</th>
                      <th className="py-3 font-medium">Role</th>
                      <th className="py-3 font-medium">Status</th>
                      <th className="py-3 font-medium text-right">Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((c) => (
                      <tr key={c.name} className="border-b border-border/60 last:border-0 hover:bg-secondary/40 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-leaf grid place-items-center font-serif text-primary">
                              {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{c.name}</div>
                              <div className="text-xs text-muted-foreground">{c.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-muted-foreground">{c.role}</td>
                        <td className="py-4">
                          <span className={cn("inline-flex px-3 py-1 rounded-full text-xs font-medium border", statusStyles[c.status])}>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-4 text-right text-xs text-muted-foreground">{c.days}d ago</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PIPELINE */}
            <div className="nature-card p-6 md:p-8">
              <h2 className="font-serif text-2xl text-foreground">Pipeline health</h2>
              <p className="text-sm text-muted-foreground mt-1">Candidates by stage</p>
              <div className="mt-6 space-y-5">
                {[
                  { label: "New", value: 86, pct: 70 },
                  { label: "Reviewing", value: 64, pct: 55 },
                  { label: "Interview", value: 38, pct: 36 },
                  { label: "Offer", value: 12, pct: 14 },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground font-medium">{row.label}</span>
                      <span className="text-muted-foreground">{row.value}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-canopy rounded-full transition-all duration-700" style={{ width: `${row.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-5 rounded-2xl bg-leaf">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">3 offers ready</div>
                    <p className="text-xs text-muted-foreground mt-1">Two ranger roles and one researcher are awaiting your final review.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;
