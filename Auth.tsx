import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Eye, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import illustration from "./assets/argus-connection-map.svg";

type Language = "en" | "hi" | "bn";
type Role = "family" | "community" | "organization" | "partner";
type AuthCopy = { signIn: string; signUp: string; request: string; welcome: string; join: string; partnerJoin: string; choose: string; email: string; password: string; name: string; org: string; submit: string; submitRequest: string; back: string; demo: string; demoText: string; requested: string; help: string; visualTitle: string; visualCaption: string; roles: Record<Role, string> };
const copy: Record<Language, AuthCopy> = {
  en: { signIn: "Sign in", signUp: "Create account", request: "Request access", welcome: "Welcome back", join: "Create your ARGUS account", partnerJoin: "Request partner access", choose: "Choose how you’d like to continue.", email: "Email address", password: "Password", name: "Your name", org: "Organization name", submit: "Continue to dashboard", submitRequest: "Send access request", back: "Back to ARGUS", demo: "Prototype preview", demoText: "Authentication is not connected yet. Use any email and password to preview this dashboard. No credentials are sent or saved.", requested: "Access request previewed. No information was sent or stored.", help: "Authorized partner accounts require verification before access is granted.", visualTitle: "Many clues. One clearer picture.", visualCaption: "Connect reports, observations, and verified case information in one place.", roles: { family: "Family workspace", community: "Community workspace", organization: "NGO & shelter workspace", partner: "Authorized partner workspace" } },
  hi: { signIn: "साइन इन", signUp: "खाता बनाएँ", request: "पहुँच का अनुरोध करें", welcome: "वापस स्वागत है", join: "अपना ARGUS खाता बनाएँ", partnerJoin: "भागीदार पहुँच का अनुरोध", choose: "जारी रखने का तरीका चुनें।", email: "ईमेल पता", password: "पासवर्ड", name: "आपका नाम", org: "संस्था का नाम", submit: "डैशबोर्ड पर जाएँ", submitRequest: "पहुँच अनुरोध भेजें", back: "ARGUS पर वापस", demo: "प्रोटोटाइप पूर्वावलोकन", demoText: "अभी प्रमाणीकरण सेवा जुड़ी नहीं है। डैशबोर्ड देखने के लिए कोई भी ईमेल और पासवर्ड इस्तेमाल करें। कुछ भेजा या सहेजा नहीं जाएगा।", requested: "पहुँच अनुरोध का पूर्वावलोकन हुआ। कोई जानकारी भेजी या सहेजी नहीं गई।", help: "पहुँच देने से पहले अधिकृत भागीदार खातों की पुष्टि आवश्यक है।", visualTitle: "कई सुराग। एक स्पष्ट तस्वीर।", visualCaption: "रिपोर्ट, अवलोकन और सत्यापित केस जानकारी को एक जगह जोड़ें।", roles: { family: "परिवार कार्यक्षेत्र", community: "समुदाय कार्यक्षेत्र", organization: "NGO और आश्रय कार्यक्षेत्र", partner: "अधिकृत भागीदार कार्यक्षेत्र" } },
  bn: { signIn: "সাইন ইন", signUp: "অ্যাকাউন্ট তৈরি করুন", request: "অ্যাক্সেসের অনুরোধ", welcome: "আবার স্বাগতম", join: "আপনার ARGUS অ্যাকাউন্ট তৈরি করুন", partnerJoin: "অংশীদার অ্যাক্সেসের অনুরোধ", choose: "কীভাবে এগোতে চান বেছে নিন।", email: "ইমেল ঠিকানা", password: "পাসওয়ার্ড", name: "আপনার নাম", org: "সংস্থার নাম", submit: "ড্যাশবোর্ডে যান", submitRequest: "অ্যাক্সেসের অনুরোধ পাঠান", back: "ARGUS-এ ফিরে যান", demo: "প্রোটোটাইপ প্রিভিউ", demoText: "এখনও প্রমাণীকরণ পরিষেবা যুক্ত হয়নি। ড্যাশবোর্ড দেখতে যেকোনো ইমেল ও পাসওয়ার্ড ব্যবহার করুন। কিছু পাঠানো বা সংরক্ষণ করা হয় না।", requested: "অ্যাক্সেস অনুরোধের প্রিভিউ হয়েছে। কোনো তথ্য পাঠানো বা সংরক্ষণ করা হয়নি।", help: "অনুমোদিত অংশীদারদের অ্যাকাউন্ট যাচাইয়ের পর অ্যাক্সেস দেওয়া হয়।", visualTitle: "অনেক সূত্র। আরও স্পষ্ট ছবি।", visualCaption: "রিপোর্ট, পর্যবেক্ষণ ও যাচাইকৃত কেসের তথ্য এক জায়গায় যুক্ত করুন।", roles: { family: "পরিবারের কর্মক্ষেত্র", community: "সম্প্রদায়ের কর্মক্ষেত্র", organization: "এনজিও ও আশ্রয়কেন্দ্রের কর্মক্ষেত্র", partner: "অনুমোদিত অংশীদারের কর্মক্ষেত্র" } },
};
const roleIcons: Record<Role, LucideIcon> = { family: Eye, community: Eye, organization: Eye, partner: ShieldCheck };
function isRole(value: string | undefined): value is Role { return value === "family" || value === "community" || value === "organization" || value === "partner"; }

export function Auth({ language }: { language: Language }) {
  const { audience } = useParams();
  if (!isRole(audience)) return <Navigate to="/" replace />;
  return <AuthForm key={audience} role={audience} language={language} />;
}

function AuthForm({ role, language }: { role: Role; language: Language }) {
  const t = copy[language];
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [requested, setRequested] = useState(false);
  const Icon = roleIcons[role];
  const partner = role === "partner";
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (partner && mode === "signup") { setRequested(true); return; }
    // Prototype-only navigation. Replace this session marker when real auth is integrated.
    window.sessionStorage.setItem("argus-demo-session", role);
    navigate(`/dashboard/${role}`, { replace: true });
  }
  return <main className="auth-page argus-hero flex min-h-[calc(100svh-108px)] items-center justify-center px-5 py-10 sm:px-8">
    <div className="relative z-10 grid w-full max-w-5xl overflow-hidden border border-slate-200 bg-white shadow-2xl md:grid-cols-[.9fr_1.1fr]">
      <section className="auth-visual relative flex min-h-[250px] flex-col justify-between overflow-hidden bg-[#101c2d] p-5 sm:p-7 md:min-h-[560px] md:p-8"><img src={illustration} alt="Abstract globe with connected locations" className="absolute inset-0 h-full w-full object-cover opacity-80" /><div className="absolute inset-0 bg-gradient-to-t from-[#0a1425]/95 via-[#0a1425]/35 to-[#0a1425]/20" /><div className="relative z-10 flex h-full flex-col"><Link to="/" className="inline-flex w-fit items-center gap-2 text-[10px] text-slate-300 hover:text-white"><ArrowLeft size={13} />{t.back}</Link><div className="mt-auto max-w-sm pt-10"><span className="grid size-10 place-items-center border border-argus-teal/45 bg-slate-950/30 text-argus-teal"><Icon size={20} /></span><p className="mt-4 text-[10px] font-bold uppercase tracking-[.2em] text-argus-teal">ARGUS · {t.roles[role]}</p><h1 className="mt-3 text-2xl font-semibold leading-snug text-white sm:text-3xl">{t.visualTitle}</h1><p className="mt-3 max-w-xs text-xs leading-5 text-slate-300">{t.visualCaption}</p></div></div><p className="relative z-10 mt-6 hidden text-[9px] uppercase tracking-[.13em] text-slate-300/75 md:block">Missing person identification platform</p></section>
      <section className="auth-form-panel flex flex-col justify-center p-5 sm:p-8 md:p-10">
        <div className="relative z-10 mx-auto w-full max-w-md">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-[10px] text-slate-400 hover:text-white md:hidden"><ArrowLeft size={13} />{t.back}</Link>
        <div className="mb-5 flex items-start gap-3 md:hidden"><span className="grid size-9 place-items-center border border-argus-teal/30 bg-argus-teal/[.06] text-argus-teal"><Icon size={18} /></span><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-argus-teal">ARGUS</p><h1 className="mt-1 text-sm font-semibold">{t.roles[role]}</h1></div></div>
        <div className="flex border-b border-white/[.08]">{(["login", "signup"] as const).map((tab) => <button key={tab} onClick={() => { setMode(tab); setRequested(false); }} className={`border-b-2 px-4 py-3 text-xs font-semibold ${mode === tab ? "border-argus-teal text-white" : "border-transparent text-slate-500 hover:text-slate-300"}`}>{partner && tab === "signup" ? t.request : tab === "login" ? t.signIn : t.signUp}</button>)}</div>
        {requested ? <div className="mt-7 rounded border border-argus-teal/20 bg-argus-teal/[.05] p-4 text-xs leading-6 text-argus-teal">{t.requested}</div> : <>
          <h2 className="mt-6 text-xl font-semibold text-white">{mode === "login" ? t.welcome : partner ? t.partnerJoin : t.join}</h2>
          <p className="mt-2 text-xs leading-5 text-slate-400">{mode === "login" ? t.choose : partner ? t.help : t.demoText}</p>
          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" && <label className="block text-[10px] font-medium text-slate-400">{partner || role === "organization" ? t.org : t.name}<input required autoComplete="name" className="mt-2 w-full rounded border border-white/10 bg-[#09111e] px-3 py-2.5 text-xs text-white outline-none focus:border-argus-teal/60" /></label>}
            <label className="block text-[10px] font-medium text-slate-400">{t.email}<input type="email" required autoComplete="email" className="mt-2 w-full rounded border border-white/10 bg-[#09111e] px-3 py-2.5 text-xs text-white outline-none focus:border-argus-teal/60" /></label>
            {(!partner || mode === "login") && <label className="block text-[10px] font-medium text-slate-400">{t.password}<input type="password" required minLength={mode === "signup" ? 8 : undefined} autoComplete={mode === "signup" ? "new-password" : "current-password"} className="mt-2 w-full rounded border border-white/10 bg-[#09111e] px-3 py-2.5 text-xs text-white outline-none focus:border-argus-teal/60" /></label>}
            <button type="submit" className="flex w-full items-center justify-center gap-2 bg-argus-teal px-4 py-3 text-[10px] font-bold text-slate-950 transition hover:bg-teal-200">{partner && mode === "signup" ? t.submitRequest : mode === "login" ? t.submit : t.signUp}<ArrowRight size={14} /></button>
          </form>
          <div className="mt-5 border-t border-white/[.07] pt-4"><p className="text-[9px] leading-5 text-slate-500">{t.demoText}</p></div>
        </>}
        </div>
      </section>
    </div>
  </main>;
}
