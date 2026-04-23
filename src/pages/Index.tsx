import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { StatCard } from "@/components/site/StatCard";
import { JobCard } from "@/components/site/JobCard";
import { jobs } from "@/data/jobs";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, HeartHandshake, Sprout, TreePine } from "lucide-react";
import heroImg from "@/assets/hero-rainforest.jpg";
import bonoboImg from "@/assets/wildlife-bonobo.jpg";
import elephantImg from "@/assets/wildlife-elephant.jpg";
import canopyImg from "@/assets/scene-canopy.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar transparentOnTop />

      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Aerial view of Congo rainforest at sunrise, mist over the canopy"
            className="h-full w-full object-cover animate-parallax-slow"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-overlay" />
        </div>

        <div className="container relative z-10 pb-20 pt-40 text-primary-foreground">
          <div className="max-w-3xl animate-fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-xs uppercase tracking-[0.22em]">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              UNESCO World Heritage · DR Congo
            </span>
            <h1 className="mt-8 font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.02] text-balance">
              Protect one of the world's largest tropical forests.
            </h1>
            <p className="mt-8 text-lg md:text-xl text-primary-foreground/85 max-w-2xl leading-relaxed">
              Salonga shelters bonobos, forest elephants and 36,000 km² of irreplaceable wilderness. We are recruiting the people who will keep it standing.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/opportunities"
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-accent text-accent-foreground font-medium shadow-glow hover:shadow-leaf transition-smooth"
              >
                Join the mission
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/organization"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full glass-dark text-primary-foreground hover:bg-white/15 transition-smooth"
              >
                Discover the park
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-primary-foreground/70 text-xs tracking-widest uppercase animate-fade-in-slow">
          Scroll to explore
        </div>
      </section>

      {/* STATS */}
      <section className="container -mt-20 relative z-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in">
          <StatCard value="36,000" label="km² of protected forest" sublabel="Largest tropical reserve in Africa" />
          <StatCard value="700+" label="documented species" sublabel="Bonobos · elephants · pangolins" />
          <StatCard value="1970" label="Founded" sublabel="UNESCO listed in 1984" />
          <StatCard value="320" label="Active rangers" sublabel="On patrol every day" />
        </div>
      </section>

      {/* MISSION */}
      <section className="container py-28 md:py-36">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          <div className="animate-fade-in">
            <span className="text-xs uppercase tracking-[0.22em] text-accent font-semibold">Our mission</span>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl text-foreground leading-tight text-balance">
              The forest does not need saving. It needs people who refuse to look away.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              For half a century, Salonga's rangers, scientists and surrounding communities have stood between Africa's largest rainforest and the pressures that threaten it. We are growing the team behind that quiet, daily resistance.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {[
                { icon: TreePine, title: "Conservation", text: "Protect intact forest from poaching and encroachment." },
                { icon: Sprout, title: "Biodiversity", text: "Monitor and study the species that call Salonga home." },
                { icon: HeartHandshake, title: "Community", text: "Co-design futures with surrounding villages." },
                { icon: Compass, title: "Discovery", text: "Map the unknown — the park is still revealing itself." },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="p-5 rounded-2xl bg-leaf border border-border/60">
                  <Icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-3 font-serif text-xl text-foreground">{title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 animate-scale-in">
            <div className="space-y-4">
              <img src={bonoboImg} alt="Wild bonobo in Congo rainforest" loading="lazy" className="w-full h-64 object-cover rounded-2xl shadow-leaf" />
              <img src={canopyImg} alt="Rainforest canopy seen from below" loading="lazy" className="w-full h-44 object-cover rounded-2xl shadow-soft" />
            </div>
            <div className="space-y-4 pt-12">
              <img src={elephantImg} alt="Forest elephant in misty rainforest" loading="lazy" className="w-full h-44 object-cover rounded-2xl shadow-soft" />
              <div className="rounded-2xl bg-canopy text-primary-foreground p-6 h-64 flex flex-col justify-between shadow-leaf">
                <span className="text-xs uppercase tracking-[0.22em] opacity-70">Living archive</span>
                <div>
                  <div className="font-serif text-4xl">15,000+</div>
                  <div className="text-sm opacity-80 mt-1">bonobos protected — roughly 40% of the world's wild population.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OPPORTUNITIES PREVIEW */}
      <section className="container py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.22em] text-accent font-semibold">Open roles</span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl text-foreground leading-tight">Find your place in the canopy</h2>
          </div>
          <Link to="/opportunities" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
            View all opportunities <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.slice(0, 3).map((j) => <JobCard key={j.id} job={j} />)}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="container py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-canopy text-primary-foreground p-10 md:p-16 shadow-leaf">
          <div className="absolute inset-0 opacity-30">
            <img src={canopyImg} alt="" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="relative max-w-2xl">
            <h2 className="font-serif text-4xl md:text-5xl leading-tight text-balance">A forest this vast cannot protect itself.</h2>
            <p className="mt-5 text-lg text-primary-foreground/85">Whether you bring a machete, a microscope or a spreadsheet — Salonga has a role for those who care.</p>
            <Link to="/opportunities" className="mt-8 inline-flex items-center gap-2 px-7 py-4 rounded-full bg-accent text-accent-foreground font-medium hover:shadow-glow transition-smooth">
              Explore opportunities <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
