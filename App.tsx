import { useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Building2, Eye, Languages, MapPin, ShieldCheck, Users } from "lucide-react";
import { Dashboard } from "./Dashboard";
import { Auth } from "./Auth";

type Language = "en" | "hi" | "bn";
const translations = {
  en: {
    language: "Language", eyebrow: "Missing person identification platform", line1: "Every clue brings us", line2: "closer to finding them.",
    intro: "ARGUS connects reports, sightings, and verified records to help people and authorized teams coordinate the next step.",
    choose: "Choose your workspace", chooseHelp: "Select the option that best describes you.",
    family: "Family member", familyText: "Report someone missing or follow an existing case.",
    citizen: "Community member", citizenText: "Share a sighting or information that could help.",
    ngo: "NGO or shelter", ngoText: "Coordinate unidentified-person records and follow-up.",
    partner: "Police or authorized partner", partnerText: "Access verified cases and review potential links.",
    return: "Back to ARGUS", dashboard: "Dashboard", workspace: "Your workspace", welcome: "Welcome to your ARGUS workspace.",
    next: "Choose what you’d like to do next.", report: "Create a report", reports: "View and update reports", sightings: "Share a sighting", cases: "Browse assigned cases", matches: "Review potential links", people: "Manage person records", coordination: "Coordinate follow-up", verification: "Verify information", upcoming: "Dashboard sections can be tailored to your role.", sectionReady: "This section is a starting point for its reporting and case-management workflow.",
  },
  hi: {
    language: "भाषा", eyebrow: "लापता व्यक्ति पहचान मंच", line1: "हर सुराग हमें", line2: "उनके करीब लाता है।",
    intro: "ARGUS रिपोर्ट, देखे जाने की जानकारी और सत्यापित रिकॉर्ड जोड़ता है, ताकि लोग और अधिकृत टीमें अगला कदम उठा सकें।",
    choose: "अपना कार्यक्षेत्र चुनें", chooseHelp: "वह विकल्प चुनें जो आपकी भूमिका से मेल खाता हो।",
    family: "परिवार का सदस्य", familyText: "लापता व्यक्ति की रिपोर्ट करें या मौजूदा मामले की जानकारी लें।",
    citizen: "समुदाय का सदस्य", citizenText: "ऐसी जानकारी या दृश्य साझा करें जो मददगार हो सकती है।",
    ngo: "NGO या आश्रय गृह", ngoText: "अज्ञात व्यक्तियों के रिकॉर्ड और आगे की कार्रवाई में समन्वय करें।",
    partner: "पुलिस या अधिकृत भागीदार", partnerText: "सत्यापित मामलों तक पहुँचें और संभावित संबंधों की समीक्षा करें।",
    return: "ARGUS पर वापस जाएँ", dashboard: "डैशबोर्ड", workspace: "आपका कार्यक्षेत्र", welcome: "आपके ARGUS कार्यक्षेत्र में आपका स्वागत है।",
    next: "आगे क्या करना है, चुनें।", report: "रिपोर्ट बनाएँ", reports: "रिपोर्ट देखें और अपडेट करें", sightings: "किसी को देखे जाने की सूचना दें", cases: "सौंपे गए मामले देखें", matches: "संभावित संबंधों की समीक्षा करें", people: "व्यक्ति रिकॉर्ड प्रबंधित करें", coordination: "आगे की कार्रवाई का समन्वय करें", verification: "जानकारी सत्यापित करें", upcoming: "डैशबोर्ड के अनुभाग आपकी भूमिका के अनुसार बनाए जा सकते हैं।", sectionReady: "यह अनुभाग रिपोर्टिंग और केस प्रबंधन प्रक्रिया शुरू करने का स्थान है।",
  },
  bn: {
    language: "ভাষা", eyebrow: "নিখোঁজ ব্যক্তি শনাক্তকরণ প্ল্যাটফর্ম", line1: "প্রতিটি সূত্র আমাদের", line2: "তাঁদের খুঁজে পাওয়ার কাছে আনে।",
    intro: "ARGUS রিপোর্ট, খোঁজ পাওয়ার তথ্য এবং যাচাইকৃত নথি একত্র করে, যাতে মানুষ ও অনুমোদিত দল পরবর্তী পদক্ষেপ নিতে পারে।",
    choose: "আপনার কর্মক্ষেত্র বেছে নিন", chooseHelp: "আপনার ভূমিকার সঙ্গে মানানসই বিকল্পটি বেছে নিন।",
    family: "পরিবারের সদস্য", familyText: "নিখোঁজ ব্যক্তির রিপোর্ট করুন বা চলমান কেসের খোঁজ নিন।",
    citizen: "সম্প্রদায়ের সদস্য", citizenText: "সহায়ক হতে পারে এমন দেখা বা তথ্য জানান।",
    ngo: "এনজিও বা আশ্রয়কেন্দ্র", ngoText: "অজ্ঞাত ব্যক্তির নথি ও পরবর্তী পদক্ষেপে সমন্বয় করুন।",
    partner: "পুলিশ বা অনুমোদিত অংশীদার", partnerText: "যাচাইকৃত কেস দেখুন এবং সম্ভাব্য মিল পর্যালোচনা করুন।",
    return: "ARGUS-এ ফিরে যান", dashboard: "ড্যাশবোর্ড", workspace: "আপনার কর্মক্ষেত্র", welcome: "আপনার ARGUS কর্মক্ষেত্রে স্বাগতম।",
    next: "এরপর কী করতে চান বেছে নিন।", report: "রিপোর্ট তৈরি করুন", reports: "রিপোর্ট দেখুন ও আপডেট করুন", sightings: "দেখা যাওয়ার তথ্য জানান", cases: "নির্ধারিত কেস দেখুন", matches: "সম্ভাব্য সংযোগ পর্যালোচনা করুন", people: "ব্যক্তির নথি পরিচালনা করুন", coordination: "পরবর্তী পদক্ষেপে সমন্বয় করুন", verification: "তথ্য যাচাই করুন", upcoming: "আপনার ভূমিকা অনুযায়ী ড্যাশবোর্ড সাজানো যাবে।", sectionReady: "এই বিভাগে রিপোর্টিং ও কেস পরিচালনার কাজ শুরু করা যাবে।",
  },
} as const;

type CopyKey = keyof typeof translations.en;
const roles: { id: string; title: CopyKey; description: CopyKey; Icon: LucideIcon }[] = [
  { id: "family", title: "family", description: "familyText", Icon: Users },
  { id: "community", title: "citizen", description: "citizenText", Icon: MapPin },
  { id: "organization", title: "ngo", description: "ngoText", Icon: Building2 },
  { id: "partner", title: "partner", description: "partnerText", Icon: ShieldCheck },
];

function Brand({ light }: { light: boolean }) {
  return <Link to="/" className={`flex items-center gap-2.5 font-bold tracking-[.2em] ${light ? "text-slate-800" : "text-slate-50"}`} aria-label="ARGUS home"><span className={`grid size-8 place-items-center border ${light ? "border-teal-700/30 text-teal-700" : "border-argus-blue/50 text-argus-blue"}`}><Eye size={17} /></span>ARGUS</Link>;
}

function App() {
  const location = useLocation();
  const darkLanding = location.pathname === "/";
  const [language, setLanguage] = useState<Language>(() => {
    const saved = window.localStorage.getItem("argus-language");
    return saved === "hi" || saved === "bn" ? saved : "en";
  });
  const copy = translations[language];
  function changeLanguage(value: Language) {
    setLanguage(value);
    window.localStorage.setItem("argus-language", value);
  }

  return <div className={`min-h-screen ${darkLanding ? "bg-[#090e18] text-slate-50" : "bg-[#f3f6f5] text-slate-900"}`}>
    <header className={`relative z-20 flex h-[68px] w-full items-center justify-between border-b px-5 sm:px-8 lg:px-12 ${darkLanding ? "border-white/[.08]" : "border-slate-200 bg-white"}`}>
      <Brand light={!darkLanding} />
      <label className={`flex items-center gap-2 ${darkLanding ? "text-slate-400" : "text-slate-500"}`} aria-label={copy.language}>
        <Languages size={16} /><span className="sr-only">{copy.language}</span>
        <select value={language} onChange={(event) => changeLanguage(event.target.value as Language)} className={`cursor-pointer bg-transparent py-2 text-xs font-semibold outline-none focus-visible:ring-2 focus-visible:ring-argus-teal ${darkLanding ? "text-slate-200" : "text-slate-700"}`} aria-label={copy.language}>
          <option className="bg-white text-slate-900" value="en">English</option><option className="bg-white text-slate-900" value="hi">हिन्दी</option><option className="bg-white text-slate-900" value="bn">বাংলা</option>
        </select>
      </label>
    </header>
    <Routes>
      <Route path="/" element={<Landing copy={copy} />} />
      <Route path="/access/:audience" element={<Auth language={language} />} />
      <Route path="/dashboard/:audience" element={<Dashboard language={language} />} />
      <Route path="/dashboard/:audience/:section" element={<Dashboard language={language} />} />
      <Route path="*" element={<Landing copy={copy} />} />
    </Routes>
    <footer className={`border-t px-5 py-4 text-center text-[10px] ${darkLanding ? "border-white/[.07] text-slate-500" : "border-slate-200 bg-white text-slate-500"}`}>ARGUS · {language === "en" ? "Potential links are leads for authorized human review." : language === "hi" ? "संभावित संबंधों की समीक्षा अधिकृत व्यक्ति करते हैं।" : "সম্ভাব্য সংযোগ অনুমোদित পর্যালोচक যাচাই করেন।"}</footer>
  </div>;
}

function Landing({ copy }: { copy: (typeof translations)[Language] }) {
  return <main className="argus-hero relative flex min-h-[calc(100svh-108px)] flex-col items-center overflow-hidden px-5 pb-12 pt-14 text-center sm:px-8 sm:pt-[7vh]">
    <div className="relative z-10 mx-auto w-full max-w-5xl">
      <p className="mb-5 flex items-center justify-center gap-3 text-[9px] font-bold uppercase tracking-[.23em] text-slate-400 sm:mb-6 sm:text-[10px]"><span className="h-px w-6 bg-argus-teal/70" />{copy.eyebrow}<span className="h-px w-6 bg-argus-teal/70" /></p>
      <h1 className="mx-auto max-w-4xl text-[clamp(2.3rem,6vw,5rem)] font-extrabold uppercase leading-[.98] tracking-[-.045em]">{copy.line1}<br /><span className="headline-accent">{copy.line2}</span></h1>
      <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-400 sm:mt-6 sm:text-base sm:leading-7">{copy.intro}</p>
      <div className="mx-auto mt-8 max-w-4xl text-left sm:mt-9">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2"><h2 className="text-[11px] font-bold uppercase tracking-[.15em] text-slate-200">{copy.choose}</h2><p className="text-xs text-slate-500">{copy.chooseHelp}</p></div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map(({ id, title, description, Icon }) => <Link to={`/access/${id}`} key={id} className="group flex min-h-[112px] items-center gap-3 border border-white/[.12] bg-slate-950/60 p-4 text-left backdrop-blur-sm transition hover:border-argus-teal/60 hover:bg-slate-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-argus-teal">
            <span className="grid size-10 shrink-0 place-items-center border border-white/10 bg-white/[.04] text-argus-teal"><Icon size={19} /></span><span className="min-w-0 flex-1"><strong className="block text-xs leading-5 text-white">{copy[title]}</strong><span className="mt-1 block text-[11px] leading-[1.45] text-slate-400">{copy[description]}</span></span><ArrowRight className="shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-argus-teal" size={15} />
          </Link>)}
        </div>
      </div>
    </div>
    <div className="earth-scene pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-[36vh] min-h-[180px] max-h-[360px] w-full opacity-70" aria-hidden="true">
      <div className="earth-globe absolute left-1/2 top-[42%] h-[min(100vw,850px)] w-[min(100vw,850px)] -translate-x-1/2 rounded-full">
        <svg className="earth-map absolute inset-0 h-full w-full" viewBox="0 0 900 900" fill="none" preserveAspectRatio="xMidYMin slice">
          <defs><linearGradient id="land" x1=".2" y1="0" x2=".8" y2="1"><stop stopColor="#748b8b" stopOpacity=".46"/><stop offset="1" stopColor="#243b53" stopOpacity=".13"/></linearGradient><radialGradient id="glow"><stop stopColor="#7adac2" stopOpacity=".7"/><stop offset="1" stopColor="#7adac2" stopOpacity="0"/></radialGradient></defs>
          <path d="M135 330 180 286l34 8 27-31 44 5 19 25 42-3 28 24-14 31-38 10-8 28-44 14-12 40-27 9-12 51-28 20-26-11-7-40-37-17-14-52-35-20 8-37-23-22 13-38-22-22 26-28Z" fill="url(#land)"/><path d="m305 506 33-25 38 7 12 32 27 22-7 44-22 19-3 48-28 37-7 55-29 37-20-27 6-46-26-47 10-46-22-36 8-37-18-30 18-30Z" fill="url(#land)"/><path d="m469 314 34-28 57 4 21-22 56 15 19 29 54 4 43 33-11 31-42 4-15 30-39 5-9 34-32 2-22-25-28 11-34-18-36 9-28-29-41-5-21-37 23-27-9-20 30-20Z" fill="url(#land)"/><path d="m575 432 31-13 50 10 33 38 12 54-22 43-37 23-35-25-15-49-29-38 12-43Z" fill="url(#land)"/>
          <path d="M0 450Q180 335 450 450T900 450M25 315Q450 175 875 315M25 585Q450 725 875 585M450 0Q290 450 450 900M450 0Q610 450 450 900" stroke="#b4d5dc" strokeOpacity=".11"/><path d="M294 490Q355 335 493 299Q540 287 573 303M294 490Q377 420 493 299M294 490Q400 477 493 299M606 422Q573 341 493 299" stroke="#62d7a6" strokeOpacity=".72" strokeWidth="1.5"/><circle cx="294" cy="490" r="28" fill="url(#glow)"/><circle cx="493" cy="299" r="25" fill="url(#glow)"/><circle cx="606" cy="422" r="22" fill="url(#glow)"/><circle cx="294" cy="490" r="3.5" fill="#a6f4ce"/><circle cx="493" cy="299" r="3.5" fill="#a6f4ce"/><circle cx="606" cy="422" r="3.5" fill="#a6f4ce"/>
        </svg>
      </div>
    </div>
  </main>;
}

export default App;
