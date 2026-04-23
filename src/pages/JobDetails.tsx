import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { jobs } from "@/data/jobs";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, MapPin, Sparkles } from "lucide-react";
import canopyImg from "@/assets/scene-canopy.jpg";

const requirements = [
  "2+ years of relevant field or research experience",
  "Comfort working in remote, humid rainforest conditions for extended deployments",
  "Working French; local language a strong plus",
  "Deep alignment with conservation values and community-first practice",
];

const impact = [
  { value: "36,000 km²", label: "of habitat under your team's protection" },
  { value: "700+", label: "species directly affected by your work" },
  { value: "120", label: "community members partnered with each season" },
];

const JobDetails = () => {
  const { id } = useParams();
  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-40 pb-20 text-center">
          <h1 className="font-serif text-4xl">Role not found</h1>
          <Link to="/opportunities" className="mt-6 inline-flex items-center gap-2 text-primary"><ArrowLeft className="h-4 w-4" /> Back to opportunities</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={canopyImg} alt="" className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
        </div>
        <div className="container">
          <Link to="/opportunities" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> All opportunities
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-accent-soft text-primary border border-accent/30">
              {job.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {job.type}</span>
          </div>
          <h1 className="mt-5 font-serif text-5xl md:text-6xl text-foreground leading-[1.05] max-w-3xl text-balance">
            {job.title}
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl leading-relaxed">{job.summary}</p>
          <div className="mt-8">
            <a
              href="#apply"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-canopy text-primary-foreground font-medium shadow-leaf hover:shadow-glow transition-smooth"
            >
              Apply for this mission <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="container grid gap-12 lg:grid-cols-3 pb-20">
        <div className="lg:col-span-2 space-y-10">
          <div className="nature-card p-8 md:p-10">
            <span className="text-xs uppercase tracking-[0.22em] text-accent font-semibold">The mission</span>
            <h2 className="mt-3 font-serif text-3xl text-foreground leading-tight">{job.mission}</h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              You will operate as part of a deeply committed team — combining traditional knowledge, modern tools and the patience that the forest demands. Every day looks different. The stakes never change.
            </p>
          </div>

          <div className="nature-card p-8 md:p-10 bg-leaf">
            <span className="text-xs uppercase tracking-[0.22em] text-primary font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Your impact
            </span>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {impact.map((i) => (
                <div key={i.label}>
                  <div className="font-serif text-3xl text-primary">{i.value}</div>
                  <div className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{i.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="nature-card p-8 md:p-10">
            <h3 className="font-serif text-2xl text-foreground">What we're looking for</h3>
            <ul className="mt-6 space-y-3">
              {requirements.map((r) => (
                <li key={r} className="flex gap-3 text-foreground/85">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside id="apply" className="space-y-6 lg:sticky lg:top-28 self-start">
          <div className="nature-card p-7 bg-canopy text-primary-foreground">
            <h3 className="font-serif text-2xl">Apply</h3>
            <p className="mt-2 text-sm text-primary-foreground/80">Tell us your story. We read every application personally.</p>
            <form className="mt-6 space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 placeholder:text-primary-foreground/60 outline-none text-sm" placeholder="Full name" />
              <input className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 placeholder:text-primary-foreground/60 outline-none text-sm" placeholder="Email" type="email" />
              <textarea rows={4} className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 placeholder:text-primary-foreground/60 outline-none text-sm resize-none" placeholder="Why this mission?" />
              <button className="w-full px-5 py-3 rounded-xl bg-accent text-accent-foreground font-medium hover:shadow-glow transition-smooth">
                Send application
              </button>
            </form>
          </div>
          <div className="nature-card p-6 text-sm text-muted-foreground">
            Applications close 30 days after posting. Selected candidates are interviewed remotely, then invited for a field assessment.
          </div>
        </aside>
      </section>

      <Footer />
    </div>
  );
};

export default JobDetails;
