/**
 * Mock Data for Culture Flow Curated University Programs
 * Designed for easy backend API / CMS integration in future phases.
 */

export interface UniversityProgram {
  id: string;
  universityName: string;
  location: string;
  country: string;
  disciplines: string[];
  taglineScript: string;
  titleSerif: string;
  titleSub: string;
  rankingBadge: string;
  image: string;
  description: string;
  subDescription: string;
  duration: string;
  intake: string;
  credits: string;
  housing: string;
  visaSupport: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
}

export const PROGRAMS_DATA: UniversityProgram[] = [
  {
    id: "oxford-global-fellows",
    universityName: "University of Oxford",
    location: "Oxford, Oxfordshire",
    country: "United Kingdom",
    disciplines: ["law-humanities", "ivy-russell", "research"],
    taglineScript: "Collegiate Excellence",
    titleSerif: "OXFORD",
    titleSub: "GLOBAL FELLOWS",
    rankingBadge: "Ranked #1 in Europe · QS 2026",
    image: "/homepage_assets/programs/oxford.jpg",
    description:
      "We have pushed beyond conventional boundaries of international student mobility. The Oxford Global Scholars pathway immerses students into centuries of collegiate academic rigor, historic high-table tutorials, and direct access to world-leading research faculties across the Bodleian library network.",
    subDescription:
      "Every admitted student receives end-to-end relocation infrastructure: verified college lodging, express UK visa facilitation, airport reception, and local peer mentorship throughout their term.",
    duration: "1–2 Academic Terms",
    intake: "Michaelmas & Hilary",
    credits: "Fully Transferable (ECTS)",
    housing: "Guaranteed College Rooms",
    visaSupport: "UK Student Visa Fast-Track",
    features: [
      "1-on-1 Faculty Tutorial System",
      "Exclusive Bodleian Library Access",
      "Full Collegiate Dining & Society Privileges",
      "Zero Logistics & On-Ground Mentor Escort",
    ],
    ctaText: "Explore Oxford Pathway",
    ctaLink: "/contact?program=oxford",
  },
  {
    id: "harvard-leadership",
    universityName: "Harvard University",
    location: "Cambridge, Massachusetts",
    country: "United States",
    disciplines: ["business-leadership", "ivy-russell", "law-humanities"],
    taglineScript: "Ivy League Legacy",
    titleSerif: "HARVARD",
    titleSub: "LEADERSHIP COHORT",
    rankingBadge: "Ivy League · Boston Innovation Hub",
    image: "/homepage_assets/programs/harvard.jpg",
    description:
      "An extraordinary cross-border educational experience uniting pioneering research with executive leadership workshops in Harvard Yard. Designed specifically for forward-thinking Indian scholars ready to command global stages and multinational career tracks.",
    subDescription:
      "From seamless SEVIS F-1 processing to Harvard Square residential onboarding and private campus briefings, Culture Flow delivers uncompromising peace of mind for parents and students alike.",
    duration: "Full Semester / Summer",
    intake: "Fall & Summer Intensive",
    credits: "Ivy League Transfer Credits",
    housing: "Harvard Quad & Upper Houses",
    visaSupport: "F-1 SEVIS Expedited Prep",
    features: [
      "Case Method Leadership Workshops",
      "Harvard Innovation Labs (i-lab) Access",
      "Boston Tech & Finance Venture Visits",
      "24/7 Dedicated Student Safety Officer",
    ],
    ctaText: "Explore Harvard Pathway",
    ctaLink: "/contact?program=harvard",
  },
  {
    id: "tum-deep-tech",
    universityName: "Technical University of Munich",
    location: "Munich, Bavaria",
    country: "Germany",
    disciplines: ["stem-ai", "venture-innovation", "engineering"],
    taglineScript: "Engineering Pioneers",
    titleSerif: "TUM MUNICH",
    titleSub: "DEEP TECH & AI",
    rankingBadge: "Germany's #1 University of Excellence",
    image: "/homepage_assets/programs/munich.jpg",
    description:
      "Positioned at the epicenter of Europe's high-tech industrial corridor, this program connects students directly with frontier research in automotive robotics, aerospace systems, and applied artificial intelligence alongside leading European industry partners.",
    subDescription:
      "Includes German blocked account setup, statutory health insurance onboarding, Schengen mobility clearances, and bilingual academic advisors based right in Munich.",
    duration: "Semester / Academic Year",
    intake: "Winter & Summer Semesters",
    credits: "30 ECTS per Semester",
    housing: "Studentenwerk Partner Lodging",
    visaSupport: "German National D-Visa Support",
    features: [
      "TUM Venture Lab Co-working Access",
      "BMW & Siemens Innovation Internships",
      "Tuition-Subsidized Excellence Model",
      "Structured Post-Study Work Orientation",
    ],
    ctaText: "Explore TUM Pathway",
    ctaLink: "/contact?program=tum",
  },
  {
    id: "nus-venture-asia",
    universityName: "National University of Singapore",
    location: "Kent Ridge",
    country: "Singapore",
    disciplines: ["venture-innovation", "stem-ai", "business-leadership"],
    taglineScript: "Future of Asia",
    titleSerif: "NUS SINGAPORE",
    titleSub: "VENTURE VANGUARD",
    rankingBadge: "#1 in Asia · Global Innovation Epicenter",
    image: "/homepage_assets/programs/singapore.jpg",
    description:
      "Gateway to the world's most dynamic financial and technological ecosystem. Experience world-class biophilic campus learning, deep-tech incubators, and direct access to ASEAN industry leaders in one of the safest, most vibrant cities on earth.",
    subDescription:
      "Full Student's Pass clearance, guaranteed residential college placement at University Town, and 24/7 localized support teams ensuring complete cultural acclimation from day one.",
    duration: "1 Semester Immersion",
    intake: "August & January Intakes",
    credits: "Modular Credits Transferable",
    housing: "UTown Residential Colleges",
    visaSupport: "Singapore ICA Fast-Track",
    features: [
      "BLOCK71 Startup Ecosystem Immersion",
      "FinTech & AI Venture Mentorship",
      "Biophilic Sustainable Campus Living",
      "Seamless Direct Flight Connectivity to India",
    ],
    ctaText: "Explore NUS Pathway",
    ctaLink: "/contact?program=nus",
  },
];
