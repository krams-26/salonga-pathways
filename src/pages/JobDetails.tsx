import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { jobs } from "@/data/jobs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, FileText, MapPin, Sparkles, Upload, X } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import canopyImg from "@/assets/scene-canopy.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const MAX_SIZE = 10 * 1024 * 1024;

type DocType = "cv" | "cover_letter" | "diploma" | "other";

const schema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  nationality: z.string().trim().max(80).optional().or(z.literal("")),
  motivation: z.string().trim().max(2000).optional().or(z.literal("")),
});

const FilePicker = ({
  label,
  multiple,
  files,
  onChange,
  accept,
}: {
  label: string;
  multiple?: boolean;
  files: File[];
  onChange: (files: File[]) => void;
  accept?: string;
}) => {
  const id = `f-${label}`;
  const handle = (list: FileList | null) => {
    if (!list) return;
    const arr = Array.from(list).filter((f) => {
      if (f.size > MAX_SIZE) {
        toast.error(`${f.name}: max 10 MB`);
        return false;
      }
      return true;
    });
    onChange(multiple ? [...files, ...arr] : arr.slice(0, 1));
  };
  return (
    <div>
      <label className="text-sm font-medium text-foreground/85">{label}</label>
      <label
        htmlFor={id}
        className="mt-2 flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-border bg-background hover:border-accent/50 cursor-pointer transition-smooth"
      >
        <Upload className="h-4 w-4 text-accent" />
        <span className="text-sm text-muted-foreground">{multiple ? "Choisir des fichiers" : "Choisir un fichier"}</span>
        <input id={id} type="file" multiple={multiple} accept={accept} className="hidden" onChange={(e) => handle(e.target.files)} />
      </label>
      {files.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-leaf text-sm">
              <span className="flex items-center gap-2 truncate"><FileText className="h-3.5 w-3.5 text-primary shrink-0" />{f.name}</span>
              <button
                type="button"
                onClick={() => onChange(files.filter((_, j) => j !== i))}
                className="text-muted-foreground hover:text-destructive shrink-0"
                aria-label="remove"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const JobDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const job = jobs.find((j) => j.id === id);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const [motivation, setMotivation] = useState("");
  const [cv, setCv] = useState<File[]>([]);
  const [coverLetter, setCoverLetter] = useState<File[]>([]);
  const [diplomas, setDiplomas] = useState<File[]>([]);
  const [other, setOther] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-40 pb-20 text-center">
          <h1 className="font-serif text-4xl">{t("job.notFound")}</h1>
          <Link to="/opportunities" className="mt-6 inline-flex items-center gap-2 text-primary"><ArrowLeft className="h-4 w-4" /> {t("job.backShort")}</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const reqs = t("job.reqs", { returnObjects: true }) as string[];
  const requirements = Array.isArray(reqs) ? reqs : [];

  const uploadDoc = async (applicationId: string, userId: string, file: File, doc_type: DocType) => {
    const path = `${userId}/${applicationId}/${doc_type}-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("applications").upload(path, file, { upsert: false });
    if (error) throw error;
    await supabase.from("application_documents").insert({
      application_id: applicationId,
      user_id: userId,
      doc_type,
      file_name: file.name,
      storage_path: path,
      size_bytes: file.size,
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (cv.length === 0) {
      toast.error(t("apply.cvRequired"));
      return;
    }
    const parsed = schema.safeParse({ fullName, email, phone, nationality, motivation });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    try {
      const { data: app, error } = await supabase
        .from("applications")
        .insert({
          user_id: user.id,
          job_id: job.id,
          job_title: job.title,
          full_name: fullName,
          email,
          phone: phone || null,
          nationality: nationality || null,
          motivation: motivation || null,
        })
        .select()
        .single();
      if (error || !app) throw error;

      for (const f of cv) await uploadDoc(app.id, user.id, f, "cv");
      for (const f of coverLetter) await uploadDoc(app.id, user.id, f, "cover_letter");
      for (const f of diplomas) await uploadDoc(app.id, user.id, f, "diploma");
      for (const f of other) await uploadDoc(app.id, user.id, f, "other");

      toast.success(t("apply.success"));
      navigate("/my-applications");
    } catch (err) {
      console.error(err);
      toast.error(t("apply.error"));
    } finally {
      setBusy(false);
    }
  };

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
            <ArrowLeft className="h-4 w-4" /> {t("job.back")}
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-accent-soft text-primary border border-accent/30">
              {job.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {job.type}</span>
          </div>
          <h1 className="mt-5 font-serif text-5xl md:text-6xl text-foreground leading-[1.05] max-w-3xl text-balance">{job.title}</h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl leading-relaxed">{job.summary}</p>
          <div className="mt-8">
            <a href="#apply" className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-canopy text-primary-foreground font-medium shadow-leaf hover:shadow-glow transition-smooth">
              {t("job.apply")} <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="container grid gap-12 lg:grid-cols-3 pb-20">
        <div className="lg:col-span-2 space-y-10">
          <div className="nature-card p-8 md:p-10">
            <span className="text-xs uppercase tracking-[0.22em] text-accent font-semibold">{t("job.mission")}</span>
            <h2 className="mt-3 font-serif text-3xl text-foreground leading-tight">{job.mission}</h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">{t("job.teamText")}</p>
          </div>

          <div className="nature-card p-8 md:p-10 bg-leaf">
            <span className="text-xs uppercase tracking-[0.22em] text-primary font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> {t("job.impact")}
            </span>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              <div>
                <div className="font-serif text-3xl text-primary">36 000 km²</div>
                <div className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{t("job.impactItems.habitat")}</div>
              </div>
              <div>
                <div className="font-serif text-3xl text-primary">700+</div>
                <div className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{t("job.impactItems.species")}</div>
              </div>
              <div>
                <div className="font-serif text-3xl text-primary">120</div>
                <div className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{t("job.impactItems.community")}</div>
              </div>
            </div>
          </div>

          <div className="nature-card p-8 md:p-10">
            <h3 className="font-serif text-2xl text-foreground">{t("job.requirements")}</h3>
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
          {!user && !loading ? (
            <div className="nature-card p-7 bg-canopy text-primary-foreground">
              <h3 className="font-serif text-2xl">{t("apply.signInRequired")}</h3>
              <p className="mt-2 text-sm text-primary-foreground/80">{t("apply.signInLead")}</p>
              <Link
                to="/auth"
                state={{ from: `/opportunities/${job.id}` }}
                className="mt-5 inline-flex items-center justify-center w-full px-5 py-3 rounded-xl bg-accent text-accent-foreground font-medium hover:shadow-glow transition-smooth"
              >
                {t("apply.goSignIn")}
              </Link>
            </div>
          ) : (
            <div className="nature-card p-7">
              <h3 className="font-serif text-2xl text-foreground">{t("apply.formTitle")}</h3>
              <form className="mt-5 space-y-4" onSubmit={onSubmit}>
                <input className="w-full px-4 py-3 rounded-xl bg-background border border-border outline-none text-sm focus:border-accent" placeholder={t("apply.fullName")} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                <input className="w-full px-4 py-3 rounded-xl bg-background border border-border outline-none text-sm focus:border-accent" placeholder={t("apply.email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input className="w-full px-4 py-3 rounded-xl bg-background border border-border outline-none text-sm focus:border-accent" placeholder={t("apply.phone")} value={phone} onChange={(e) => setPhone(e.target.value)} />
                <input className="w-full px-4 py-3 rounded-xl bg-background border border-border outline-none text-sm focus:border-accent" placeholder={t("apply.nationality")} value={nationality} onChange={(e) => setNationality(e.target.value)} />
                <textarea rows={3} className="w-full px-4 py-3 rounded-xl bg-background border border-border outline-none text-sm focus:border-accent resize-none" placeholder={t("apply.motivation")} value={motivation} onChange={(e) => setMotivation(e.target.value)} />

                <div className="pt-2 space-y-4 border-t border-border">
                  <div className="text-xs uppercase tracking-widest text-accent font-semibold pt-2">{t("apply.documents")}</div>
                  <FilePicker label={t("apply.cv")} files={cv} onChange={setCv} accept=".pdf,.doc,.docx" />
                  <FilePicker label={t("apply.coverLetter")} files={coverLetter} onChange={setCoverLetter} accept=".pdf,.doc,.docx,.txt" />
                  <FilePicker label={t("apply.diplomas")} multiple files={diplomas} onChange={setDiplomas} accept=".pdf,.jpg,.jpeg,.png" />
                  <FilePicker label={t("apply.other")} multiple files={other} onChange={setOther} />
                </div>

                <button disabled={busy} className="w-full px-5 py-3 rounded-xl bg-canopy text-primary-foreground font-medium hover:shadow-leaf transition-smooth disabled:opacity-50">
                  {busy ? t("apply.submitting") : t("apply.submit")}
                </button>
              </form>
            </div>
          )}
        </aside>
      </section>

      <Footer />
    </div>
  );
};

export default JobDetails;
