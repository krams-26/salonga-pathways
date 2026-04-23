import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import bonoboImg from "@/assets/wildlife-bonobo.jpg";
import elephantImg from "@/assets/wildlife-elephant.jpg";
import riverImg from "@/assets/scene-river.jpg";
import rangerImg from "@/assets/scene-ranger.jpg";

const timeline = [
  { year: "1970", title: "Park founded", text: "Salonga is established to protect the heart of the Congo Basin." },
  { year: "1984", title: "UNESCO World Heritage", text: "Recognized for its outstanding universal value." },
  { year: "1999", title: "In Danger listing", text: "Conflict and poaching pressure prompt international response." },
  { year: "2021", title: "Removed from Danger list", text: "A milestone — the result of decades of patrol and partnership." },
  { year: "Today", title: "Next chapter", text: "Scaling community programs, science, and ranger capacity." },
];

const wildlife = [
  { img: bonoboImg, name: "Bonobo", text: "Found nowhere else on Earth — Salonga shelters the largest known population." },
  { img: elephantImg, name: "Forest Elephant", text: "Critically endangered ecosystem engineers shaping the rainforest." },
  { img: riverImg, name: "Salonga River system", text: "Lifelines of the park — habitat, transport, and patrol corridors." },
];

const Organization = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-36 pb-16 bg-leaf">
        <div className="container grid gap-10 lg:grid-cols-2 items-end">
          <div>
            <span className="text-xs uppercase tracking-[0.22em] text-accent font-semibold">The Park</span>
            <h1 className="mt-3 font-serif text-5xl md:text-6xl text-foreground leading-[1.05] text-balance">
              Salonga — the silent green heart of Africa.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              At 36,000 km², Salonga is Africa's largest tropical rainforest reserve and the only protected area in the world's second largest rainforest. It is pristine, remote and irreplaceable.
            </p>
          </div>
          <img src={rangerImg} alt="Salonga ranger in the rainforest" loading="lazy" className="rounded-2xl shadow-leaf w-full h-80 object-cover" />
        </div>
      </section>

      {/* CONSERVATION EFFORTS */}
      <section className="container py-24">
        <div className="grid gap-10 lg:grid-cols-3">
          {[
            { title: "Anti-poaching", text: "320 rangers conduct foot, river and aerial patrols across the park's vast sectors." },
            { title: "Science", text: "Long-term monitoring stations track bonobos, elephants and forest health." },
            { title: "Communities", text: "Co-managed projects support sustainable livelihoods around the park." },
          ].map((c) => (
            <div key={c.title} className="nature-card p-8">
              <div className="font-serif text-3xl text-primary">{c.title}</div>
              <p className="mt-4 text-muted-foreground leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WILDLIFE */}
      <section className="container py-12">
        <span className="text-xs uppercase tracking-[0.22em] text-accent font-semibold">Wildlife</span>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl text-foreground leading-tight max-w-2xl">
          A living archive of the Congo Basin.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {wildlife.map((w) => (
            <div key={w.name} className="nature-card overflow-hidden p-0">
              <img src={w.img} alt={w.name} loading="lazy" className="h-72 w-full object-cover" />
              <div className="p-6">
                <div className="font-serif text-2xl text-foreground">{w.name}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{w.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="container py-24">
        <span className="text-xs uppercase tracking-[0.22em] text-accent font-semibold">Our story</span>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl text-foreground leading-tight">Five decades of patient stewardship.</h2>

        <div className="mt-14 relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-12">
            {timeline.map((t, i) => (
              <div key={t.year} className={`relative md:grid md:grid-cols-2 md:gap-16 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
                <div className="pl-12 md:pl-0 md:pr-12 md:text-right">
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 mt-1.5 h-3 w-3 rounded-full bg-accent ring-4 ring-background" />
                  <div className="font-serif text-3xl text-primary">{t.year}</div>
                  <h3 className="mt-2 font-serif text-2xl text-foreground">{t.title}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{t.text}</p>
                </div>
                <div />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Organization;
