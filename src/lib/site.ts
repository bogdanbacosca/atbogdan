export const site = {
  name: "@Bogdan",
  legalName: "Creare Site-uri Web, Web Design, Promovare, SEO, Design Grafic",
  tagline: "Site-uri Web Profesionale, Web Design, Programare, Design Grafic",
  description:
    "Servicii complete web: creare site, design grafic, conținut, SEO și promovare. Construiește un site care se remarcă și atrage clienți!",
  url: "https://atbogdan.ro",
  email: "contact@atbogdan.ro",
  phone: "0720910777",
  phonePretty: "0720 910 777",
  phoneHref: "tel:+40720910777",
  whatsapp: "https://wa.me/40720910777",
  location: "Roman, România",
  github: "https://github.com/bogdanbacosca",
  logo: "/brand/logo.png",
} as const;

export const nav = [
  { href: "/", label: "Acasă" },
  { href: "/portofoliu", label: "Portofoliu" },
  { href: "/contact", label: "Contact" },
] as const;

export const hero = {
  kicker: "Web designer · Roman, România",
  title: "Cauți un web designer pentru site-ul tău?",
  subtitle: site.tagline,
  cta: "Contactează-mă",
  secondary: "Vezi portofoliul",
};

export const about = {
  eyebrow: "Despre mine",
  title: "Pasiune și expertiză în programare, web design și graphic design",
  body: "Am construit parcursul meu profesional din îmbinarea a două pasiuni care, deși par diferite, se completează perfect: estetica și tehnologia. Fascinația pentru design — felul în care culorile, formele și spațiul pot influența percepția — s‑a unit firesc cu interesul pentru algoritmi, digital și modul în care internetul conectează oameni și idei. Din această combinație a apărut direcția mea: dezvoltarea de site‑uri web create nu doar ca proiecte vizuale, ci ca instrumente strategice de comunicare, vânzare și construire a identității unui brand. Fiecare proiect devine o experiență digitală menită să transmită clar cine este brandul și ce emoție vrea să lase în urmă.",
};

export const differentiators = [
  {
    id: "meta",
    eyebrow: "Formare profesională",
    title: "Meta Front-End Developer",
    body: "Certificatul Meta Front-End Developer Professional m-a echipat cu competențe pentru a construi site-uri web interactive.",
    cta: "Vezi certificatul",
    href: "/brand/cert-meta.jpg",
    image: "/brand/cert-meta.jpg",
    external: true,
  },
  {
    id: "github",
    eyebrow: "Contribuitor și menținător",
    title: "Proiecte Open-Source",
    body: "Am menținut și contribuit la diverse proiecte pe GitHub, incluzând traducerea în limba română a site-ului javascript.info.",
    cta: "Vezi profilul de GitHub",
    href: site.github,
    image: "/brand/github.jpg",
    external: true,
  },
  {
    id: "work",
    eyebrow: "Portofoliu",
    title: "Proiecte reale, rezultate clare",
    body: "Vei găsi aici o selecție de proiecte care reflectă competențele mele în UI/UX, HTML, CSS, JavaScript.",
    cta: "Vezi",
    href: "/portofoliu",
    image: "/brand/portfolio-preview.jpg",
    external: false,
  },
] as const;

export const services = [
  {
    index: "01",
    title: "Creare site-uri web",
    body: "Ofer servicii complete de creare site-uri web, adaptate nevoilor tale. Fie că ai nevoie de un site de prezentare sau un magazin online, mă asigur că design-ul este creativ și funcțional, pe desktop cât și pe mobil.",
  },
  {
    index: "02",
    title: "Programare și elemente custom",
    body: "Transform ideile în funcționalități reale — dezvoltare web modernă, cod curat și soluții personalizate pentru fiecare proiect. Creez elemente custom care dau unicitate și performanță site‑ului tău.",
  },
  {
    index: "03",
    title: "Design grafic",
    body: "Ofer servicii de design grafic pentru a crea identități vizuale memorabile. De la logo-uri la materiale publicitare, îți transform ideile în realitate vizuală, atrăgătoare și creativă.",
  },
] as const;

export const skills = [
  "HTML",
  "CSS",
  "JavaScript",
  "UI/UX",
  "Web Design",
  "SEO",
  "Design Grafic",
  "WordPress",
  "Front-End",
  "Identitate vizuală",
  "Content",
  "Promovare",
] as const;

export type Project = {
  slug: string;
  domain: string;
  url: string;
  year: string;
  role: string;
  image: string;
  services: string;
  description: string;
  highlights: string[];
  result: string;
};

export const projects: Project[] = [
  {
    slug: "cristinahorga-ro",
    domain: "cristinahorga.ro",
    url: "https://cristinahorga.ro",
    year: "2025",
    role: "Web design · Programare · SEO",
    image: "/projects/cristinahorga.png",
    services:
      "Design web personalizat, integrare sistem de programări online, implementare teste psihologice, structurare conținut profesional, optimizare SEO",
    description:
      "CristinaHorga.ro este site-ul oficial al Cristinei Horga, psiholog clinician și psihoterapeut, care oferă servicii de consiliere psihologică, psihoterapie și testare. Obiectivul proiectului a fost crearea unei platforme profesionale, de încredere, unde pacienții pot accesa ușor informații relevante și pot face rezervări online pentru ședințe.",
    highlights: [
      "Design calm și profesionist, adaptat domeniului psihologiei și axat pe încredere și empatie",
      "Sistem de programări online, integrat pentru facilitarea rezervărilor rapide de către clienți",
      "Teste psihologice interactive, configurate pentru utilizare direct pe site, cu rezultate livrate automat sau la cerere",
      "Structurare clară a conținutului, cu secțiuni dedicate serviciilor oferite, abordărilor terapeutice, întrebărilor frecvente și blogului",
      "Optimizare SEO, pentru vizibilitate locală și atragerea de noi clienți din domeniul psihologiei",
      "Responsive design, pentru accesibilitate completă pe mobil, tabletă și desktop",
    ],
    result:
      "CristinaHorga.ro este un exemplu de proiect în care funcționalitatea practică se îmbină cu o estetică profesională și echilibrată. Platforma facilitează comunicarea directă cu clienții, oferă informații esențiale despre servicii și integrează instrumente utile precum programările online și testele psihologice — toate într-un cadru modern, sigur și prietenos.",
  },
  {
    slug: "vacantesmart-eu",
    domain: "vacantesmart.eu",
    url: "https://vacantesmart.eu",
    year: "2025",
    role: "Web design · Branding · SEO",
    image: "/projects/vacantesmart.jpg",
    services:
      "Design web complet, structurare blog, integrare SEO, optimizare performanță, branding vizual",
    description:
      "VacanteSmart.eu este un blog de călătorii creat pentru a oferi informații utile, inspirație și recomandări despre destinații turistice, croaziere și echipamente de călătorie. Proiectul a fost gândit pentru a susține o strategie de content marketing, axată pe articole optimizate SEO și o experiență de lectură plăcută, indiferent de dispozitivul folosit.",
    highlights: [
      "Design aerisit și modern, centrat pe conținut și lizibilitate",
      "Structură tip blog, cu categorii bine definite și articole ușor de navigat",
      "Identitate vizuală coerentă, cu accent pe tonul profesionist și prietenos al brandului",
      "SEO on-page, cu focus pe titluri optimizate, meta descrieri și performanță tehnică",
      "Responsive design, pentru o experiență fluidă atât pe desktop, cât și pe mobil",
      "Integrare cu rețele sociale, pentru creșterea vizibilității conținutului",
    ],
    result:
      "VacanteSmart.eu este un exemplu de proiect în care designul minimalist susține strategia editorială. Platforma pune în valoare atât conținutul informativ, cât și personalitatea brandului, fiind pregătită pentru monetizare, colaborări și atragerea de trafic organic.",
  },
  {
    slug: "reparatiimasinispalat-eu",
    domain: "reparatiimasinispalat.eu",
    url: "https://reparatiimasinispalat.eu",
    year: "2025",
    role: "Web design · SEO local",
    image: "/projects/reparatii.jpg",
    services:
      "Design web personalizat, structură SEO-friendly, optimizare viteză, interfață mobilă",
    description:
      "ReparatiiMasiniSpalat.eu este un site de prezentare dedicat serviciilor de reparații pentru mașini de spălat, adresat în principal clienților din Neamț și Bacău. Obiectivul principal al proiectului a fost crearea unei platforme simple, clare și eficiente, prin care vizitatorii să poată găsi rapid informațiile de care au nevoie și să solicite ușor o intervenție.",
    highlights: [
      "Design modern și intuitiv, adaptat pentru desktop și mobil",
      "Structură clară a paginilor, cu accent pe zonele de interes (servicii, programări, date de contact)",
      "Optimizare SEO on-page, pentru o mai bună indexare în motoarele de căutare locale",
      "Viteză de încărcare rapidă, prin optimizarea imaginilor și a codului",
      "Buton de apel direct, vizibil pentru utilizatorii de pe mobil",
    ],
    result:
      "Un site funcțional și eficient, care transmite profesionalism și încredere. ReparatiiMasiniSpalat.eu este un exemplu de proiect în care utilitatea și simplitatea se îmbină cu un design curat, orientat spre conversie.",
  },
];

export const cta = {
  title: "Îți dorești un site?",
  body: "Contactează-mă pentru detalii!",
  button: "Contactează-mă",
};

export const contactCopy = {
  title: "Contactează-mă acum",
  body: "Sunt aici să te ajut! Scrie-mi.",
  talk: "Hai să vorbim!",
  leave: "Lasă un mesaj",
  call: "Sună-mă la tel:",
  follow: "Urmărește-mă",
  send: "Trimite un mesaj",
  submit: "Trimite mesaj",
};
