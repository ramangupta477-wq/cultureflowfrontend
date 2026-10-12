export interface Review {
  id: number;
  name: string;
  date: string;
  rating: number; // 1–5 stars
  text: string;
  isRecommendation?: boolean; // shows "recommends Culture Flow" badge
  /** visual column placement hint: 0=left, 1=center, 2=right */
  column: 0 | 1 | 2;
}

export const REVIEWS_DATA: Review[] = [
  {
    id: 1,
    name: "Arjun Mehta",
    date: "September 4",
    rating: 5,
    text: "Culture Flow made my dream of studying at TU Munich a reality. From application guidance to visa support and finding accommodation — every single step was handled with such precision. I felt completely at ease throughout the process.",
    isRecommendation: true,
    column: 0,
  },
  {
    id: 2,
    name: "Priya Sharma",
    date: "August 22",
    rating: 5,
    text: "I was overwhelmed with the entire overseas education process. Culture Flow broke everything down into clear, manageable steps. Their team personally guided me through the UK visa interview — I'm now at Oxford and couldn't be happier!",
    isRecommendation: true,
    column: 1,
  },
  {
    id: 3,
    name: "Rishi Kapoor",
    date: "August 15",
    rating: 5,
    text: "The level of personal attention is unmatched. My counselor knew my application inside-out and helped me craft essays that genuinely stood out. Secured admission with a scholarship. 100% recommend Culture Flow.",
    isRecommendation: true,
    column: 2,
  },
  {
    id: 4,
    name: "Ananya Desai",
    date: "July 30",
    rating: 5,
    text: "From shortlisting universities to settling into my dorm in Singapore — Culture Flow was there at every milestone. The relocation support alone is worth it. They don't just get you admitted, they make sure you thrive.",
    column: 0,
  },
  {
    id: 5,
    name: "Vikram Nair",
    date: "July 18",
    rating: 5,
    text: "Seriously the best education consultancy I've worked with. Transparent, professional, and genuinely invested in my future. Thank you Culture Flow!",
    isRecommendation: true,
    column: 1,
  },
  {
    id: 6,
    name: "Sneha Iyer",
    date: "July 6",
    rating: 5,
    text: "The course curation was detailed and the personalised pathway they designed for me made the entire decision-making process so much simpler. Their knowledge of global programs is genuinely impressive.",
    isRecommendation: true,
    column: 2,
  },
  {
    id: 7,
    name: "Rohan Chatterjee",
    date: "June 28",
    rating: 5,
    text: "I just completed my first semester at Harvard Extension and it's all thanks to Culture Flow's meticulous planning. Worth EVERY PENNY. The pre-departure briefing alone saved me from so many rookie mistakes abroad.",
    isRecommendation: true,
    column: 0,
  },
  {
    id: 8,
    name: "Kavya Reddy",
    date: "June 20",
    rating: 5,
    text: "Having anxiety about moving abroad as a first-gen student was real. Culture Flow's team held my hand through everything — SOP reviews, mock interviews, airport assistance. They treat you like family.",
    column: 1,
  },
  {
    id: 9,
    name: "Aditya Joshi",
    date: "June 12",
    rating: 5,
    text: "Great consultancy that helped me get into NUS Singapore. The application timeline they built for me was incredibly organised. Their end-to-end support is not a marketing gimmick — it's genuine.",
    isRecommendation: true,
    column: 2,
  },
  {
    id: 10,
    name: "Meera Krishnan",
    date: "May 28",
    rating: 5,
    text: "Culture Flow doesn't just process applications — they build careers. My counselor spent hours understanding my goals before even suggesting a single program. That kind of dedication is rare.",
    isRecommendation: true,
    column: 0,
  },
  {
    id: 11,
    name: "Siddharth Patel",
    date: "May 15",
    rating: 5,
    text: "I had almost given up on my dream of studying in Germany after two rejections. Culture Flow re-strategised my entire profile, and I got accepted at TU Munich on my third attempt. Forever grateful.",
    column: 1,
  },
  {
    id: 12,
    name: "Ishita Gupta",
    date: "May 3",
    rating: 5,
    text: "The scholarship guidance was exceptional. I didn't even know half the funding options available to Indian students. Culture Flow's research saved me lakhs in tuition. Absolutely phenomenal service.",
    isRecommendation: true,
    column: 2,
  },
];
