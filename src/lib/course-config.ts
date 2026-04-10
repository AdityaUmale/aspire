export const COURSE_SECTIONS = ["REGULAR", "ONLINE", "EXCLUSIVE"] as const;
export type CourseSection = (typeof COURSE_SECTIONS)[number];

export const COURSE_CTA_MODES = ["ENQUIRE"] as const;
export type CourseCtaMode = (typeof COURSE_CTA_MODES)[number];

export interface ProgramCatalogEntry {
  key: string;
  title: string;
  description: string;
  features: string[];
  slug?: string;
  image?: string;
  matchers: RegExp[];
}

export const GENERIC_UPCOMING_DESCRIPTION =
  "Upcoming training batch. Contact Aspire to confirm details and availability.";

export const GENERIC_UPCOMING_HIGHLIGHTS = [
  "Fresh batch starting soon",
  "Schedule shared in the latest poster",
  "Contact Aspire to confirm availability",
];

export const PROGRAM_CATALOG: ProgramCatalogEntry[] = [
  {
    key: "leadership-development",
    title: "Leadership Development",
    description:
      "Develop essential leadership skills for the modern workplace and learn to inspire teams.",
    features: [
      "Strategic thinking",
      "Team management",
      "Decision making",
      "Conflict resolution",
    ],
    slug: "/courses/leadership-development",
    image: "/ldp.jpg",
    matchers: [/leadership development/i],
  },
  {
    key: "personality-development",
    title: "Personality Development",
    description:
      "Build confidence and enhance your personal growth through comprehensive self-improvement.",
    features: [
      "Self-confidence",
      "Communication skills",
      "Emotional intelligence",
      "Personal branding",
    ],
    slug: "/courses/personality-development",
    image: "/pdc.jpg",
    matchers: [/personality development/i],
  },
  {
    key: "public-speaking",
    title: "Public Speaking",
    description:
      "Master the art of effective communication and captivate any audience with your words.",
    features: [
      "Speech preparation",
      "Delivery techniques",
      "Audience engagement",
      "Overcoming anxiety",
    ],
    slug: "/courses/public-speaking",
    image: "/public-speaking.jpg",
    matchers: [/public speaking/i],
  },
  {
    key: "english-language-training",
    title: "English Language Training",
    description: "Enhance your English skills for better communication.",
    features: ["Vocabulary", "Pronunciation", "Fluency", "Confidence"],
    slug: "/courses/english-language-training",
    image: "/elt8.jpg",
    matchers: [/english language training/i, /\belt\b/i],
  },
  {
    key: "childrens-learning-program",
    title: "Summer Special Course For Kids",
    description:
      "Fun, structured programs that build confidence and curiosity in children.",
    features: ["Creativity", "Learning Skills", "Teamwork", "Confidence"],
    slug: "/courses/childrens-learning-program",
    image: "/elt.jpg",
    matchers: [
      /summer special course for kids/i,
      /children'?s learning program/i,
      /\bkids\b/i,
    ],
  },
  {
    key: "voice-and-accent",
    title: "Voice & Accent",
    description: "Improve your voice modulation and accent.",
    features: ["Clarity", "Tone", "Accent training", "Expression"],
    slug: "/courses/voice-and-accent",
    image: "/voice-and-accent.jpg",
    matchers: [/voice\s*&\s*accent/i, /voice and accent/i],
  },
  {
    key: "entrepreneurship-development",
    title: "Entrepreneurship Development",
    description: "Build skills to start and grow your business.",
    features: [
      "Innovation",
      "Business planning",
      "Leadership",
      "Risk management",
    ],
    slug: "/courses/entrepreneurship-development",
    image: "/edp-logo.jpg",
    matchers: [/entrepreneurship development/i],
  },
  {
    key: "teachers-training-program",
    title: "Teachers Training Program",
    description: "Empower educators with modern teaching methods.",
    features: [
      "Pedagogy",
      "Classroom management",
      "Engagement",
      "Assessment",
    ],
    slug: "/courses/teachers-training-program",
    image: "/teacher2.png",
    matchers: [/teachers? training/i],
  },
  {
    key: "arise-camp",
    title: "ARISE Language And Thought Enrichment Camp",
    description: "A unique camp for personal growth.",
    features: [
      "Mindset",
      "Language Skills",
      "Critical Thinking",
      "Self-Expression",
    ],
    slug: "/courses/arise-camp",
    image: "/arise-logo.jpg",
    matchers: [/arise/i, /thought enrichment camp/i],
  },
  {
    key: "international-workshop",
    title: "International Workshop",
    description:
      "Immersive global learning experiences that expand perspective and networks.",
    features: [
      "Cross-cultural skills",
      "Global trends",
      "Networking",
      "Innovation",
    ],
    slug: "/courses/international-workshop",
    image: "/international.jpg",
    matchers: [/international workshop/i],
  },
  {
    key: "interview-skills-techniques",
    title: "Interview Skills & Techniques",
    description:
      "A powerful transformation program designed to help learners prepare for interviews and corporate interactions.",
    features: [
      "Interview Prep",
      "Group Discussion",
      "Mindset Shift",
      "Placement Readiness",
    ],
    slug: "/courses/interview-skills-techniques",
    image: "/ist2.jpg",
    matchers: [/interview skills/i, /interview skills\s*&\s*techniques/i],
  },
  {
    key: "workshops-keynote-talks",
    title: "Exclusive Workshops & Keynote Talks",
    description:
      "High-impact, focused sessions that cut straight to what matters. Led by Sachin Burghate.",
    features: [
      "Mindset & Confidence",
      "Communication Mastery",
      "Leadership & Growth",
      "Customised Topics",
    ],
    slug: "/courses/workshops-keynote-talks",
    image: "/workshop1.jpeg",
    matchers: [/exclusive workshops/i, /keynote talks/i, /workshop/i],
  },
];

export const AVAILABLE_PROGRAMS = PROGRAM_CATALOG.map((program) => ({
  title: program.title,
  description: program.description,
  features: program.features,
  slug: program.slug,
}));

export const findProgramByCourseName = (courseName: string) => {
  const normalizedName = courseName.trim();
  return (
    PROGRAM_CATALOG.find((program) =>
      program.matchers.some((matcher) => matcher.test(normalizedName))
    ) ?? null
  );
};

export const getCourseSectionLabel = (section?: string | null) => {
  switch (section) {
    case "ONLINE":
      return "Online";
    case "EXCLUSIVE":
      return "Exclusive";
    case "REGULAR":
      return "Regular";
    default:
      return null;
  }
};
