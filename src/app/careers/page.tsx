'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
    ArrowRight,
    Briefcase,
    GraduationCap,
    BookOpen,
    HeadphonesIcon,
    ClipboardList,
    Heart,
    Users,
    Target,
    Shield,
    TrendingUp,
    Clock,
    Plus,
} from 'lucide-react';

/* ─── Data ─── */

const values = [
    {
        icon: Heart,
        title: 'Discipline & Character',
        description:
            'At Aspire, leadership is not about position. It is about responsibility, discipline and character.',
    },
    {
        icon: Shield,
        title: 'Trust & Accountability',
        description:
            'Every team member is trusted with something valuable, the growth of learners and the strength of the institution.',
    },
    {
        icon: Users,
        title: 'Mentorship & Growth',
        description:
            'A rare chance to be mentored, challenged, and shaped in an environment that builds both competence and character.',
    },
    {
        icon: Target,
        title: 'Clarity & Direction',
        description:
            'Aspire is remembered as a phase that built discipline, clarity and direction for everyone who becomes part of the team.',
    },
    {
        icon: TrendingUp,
        title: 'Commitment & Integrity',
        description:
            'We invite committed joiners who understand that meaningful growth requires effort and gratitude.',
    },
];

const roles = [
    {
        id: 'internship',
        title: 'Internship Program',
        duration: '1 Year',
        tagline: 'Learn with Humility. Grow with Discipline.',
        icon: GraduationCap,
        description:
            'This one-year internship is a structured journey inside the institution.',
        responsibilities: [
            'Support training sessions and workshops',
            'Assist in managing learner batches',
            'Contribute to communication and internal work',
            'Participate in planning and institutional activities',
        ],
        eligibility: [
            'Graduates or Postgraduates only',
            'Strong communication skills',
            'Discipline and consistency',
            'Commitment to complete the full one-year journey',
        ],
        note: 'At Aspire, internship is not treated lightly. You are given exposure, mentorship and responsibility that shape your thinking and work ethic.',
        closing:
            'It is a valuable opportunity, one that demands seriousness, but rewards you with clarity, confidence and direction.',
    },
    {
        id: 'project-trainee',
        title: 'Project Trainee Program',
        duration: '6 Months',
        tagline: 'Responsibility Before Recognition.',
        icon: ClipboardList,
        description:
            'This six-month journey allows you to take ownership of defined institutional responsibilities.',
        responsibilities: [
            'Handle assigned tasks',
            'Complete work within timelines',
            'Study, prepare and present structured reports',
            'Coordinate with internal teams',
        ],
        eligibility: [
            'Graduates or Postgraduates only',
            'Organised and dependable individuals',
            'Ability to work steadily',
        ],
        note: 'This program builds discipline and professional maturity.',
        closing:
            'Being trusted with institutional responsibilities at this stage is not ordinary, it is an opportunity to prove your capability and strengthen your foundation.',
    },
    {
        id: 'trainer',
        title: 'English Language Trainer / Assistant Trainer',
        duration: 'Full-Time',
        tagline: 'Build Expression. Build Confidence. Build Individuals.',
        icon: BookOpen,
        description:
            'Language training at Aspire goes beyond basics. It builds confidence, clarity and personality.',
        responsibilities: [
            'Conduct structured sessions',
            'Execute practical learning activities',
            'Track student improvement',
            'Guide learners towards confident communication',
        ],
        eligibility: [
            'Graduates or Postgraduates (English background preferred)',
            'Strong command over English',
            'Confidence in addressing groups',
            'Long-term commitment',
        ],
        note: 'To be entrusted with shaping learners\u2019 confidence is a significant responsibility.',
        closing:
            'This role is both an honour and an opportunity to influence lives positively while growing as a leader yourself.',
    },
    {
        id: 'office-assistant',
        title: 'Office Assistant',
        duration: 'Full-Time',
        tagline: 'Stability. Order. Accountability.',
        icon: Briefcase,
        description: 'Behind every smooth workday is disciplined coordination.',
        responsibilities: [
            'Maintains records and documentation',
            'Coordinates with assigned teams',
            'Supports daily institutional functioning',
        ],
        eligibility: [
            'Graduates or Postgraduates only',
            'Organised and punctual',
            'Clear and respectful communication',
            'Responsible and trustworthy',
        ],
        note: 'This role may not always be visible, but it is deeply valuable.',
        closing:
            'Being trusted with institutional systems reflects the confidence Aspire places in you, and that trust is something to hold with gratitude.',
    },
    {
        id: 'counsellor',
        title: 'Career Counsellor',
        duration: 'Full-Time',
        tagline: 'Clarity. Listening. Direction.',
        icon: HeadphonesIcon,
        description:
            'At Aspire, career guidance begins with understanding the individual.',
        responsibilities: [
            'Listens with patience',
            'Helps them understand their strengths',
            'Guides them towards suitable learning paths',
            'Supports their long-term progress',
        ],
        eligibility: [
            'Graduates or Postgraduates',
            'Strong listening skills',
            'Emotional maturity',
            'Balanced judgment',
        ],
        note: 'To guide a student\u2019s direction in life is not a small responsibility.',
        closing:
            'It is a meaningful opportunity to create impact, one conversation at a time.',
    },
];

const whyJoinReasons = [
    'You grow under structured mentorship',
    'You are given real responsibility',
    'You work in a disciplined environment',
    'You develop professionally and personally',
    "You become part of India's leading personal and professional development training institute",
];

/* ─── Expandable Role Card ─── */
function RoleCard({ role }: { role: typeof roles[number] }) {
    const [expanded, setExpanded] = React.useState(false);

    return (
        <div
            className="group relative bg-white border border-zinc-200/80 rounded-[2rem] hover:border-zinc-300 hover:shadow-sm transition-all duration-500 overflow-hidden"
        >
            <div className="p-6 md:p-8 md:pb-8">
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h3 className="text-2xl font-semibold tracking-tight text-zinc-900">
                                {role.title}
                            </h3>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-50 border border-zinc-200 text-zinc-600 text-xs font-medium rounded-full">
                                <Clock className="h-3 w-3 text-zinc-400" />
                                {role.duration}
                            </span>
                        </div>
                        <p className="text-zinc-500 text-sm md:text-base leading-relaxed max-w-3xl">
                            {role.description}
                        </p>

                        {/* Preview Snippets */}
                        {!expanded && (
                            <div className="mt-5 flex flex-wrap gap-2">
                                {role.responsibilities.slice(0, 3).map((item: string, i: number) => (
                                    <span
                                        key={i}
                                        className="inline-flex items-center text-xs font-medium text-zinc-500 bg-zinc-50 border border-zinc-100 px-2.5 py-1 rounded-md"
                                    >
                                        {item}
                                    </span>
                                ))}
                                {role.responsibilities.length > 3 && (
                                    <span className="inline-flex items-center text-xs font-medium text-[#3949ab] px-2 py-1">
                                        +{role.responsibilities.length - 3} more
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Expand Trigger */}
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="self-start inline-flex items-center justify-center h-10 w-10 md:w-auto md:px-5 rounded-full border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-900 transition-all duration-300 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20"
                        aria-expanded={expanded}
                    >
                        <span className="hidden md:block text-sm font-semibold mr-2">
                            {expanded ? 'Close details' : 'View details'}
                        </span>
                        <Plus
                            className={`h-4 w-4 transition-transform duration-500 ${expanded ? 'rotate-[135deg]' : 'rotate-0'}`}
                        />
                    </button>
                </div>

                {/* Expanded Content Accordion */}
                <div
                    className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${expanded
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0'
                        }`}
                >
                    <div className="overflow-hidden">
                        <div className="pt-8 mt-8 border-t border-zinc-100">

                            {/* Tagline */}
                            <div className="mb-8 pl-4 border-l-2 border-[#1a237e]/20">
                                <p className="text-lg font-medium text-[#1a237e] tracking-tight">
                                    {role.tagline}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-10 md:gap-16 mb-8">
                                {/* Responsibilities */}
                                <div>
                                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
                                        <Briefcase className="h-4 w-4 text-[#3949ab]" />
                                        Key Responsibilities
                                    </h4>
                                    <ul className="space-y-4">
                                        {role.responsibilities.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 group/item">
                                                <ArrowRight className="h-4 w-4 text-zinc-300 flex-shrink-0 mt-0.5 group-hover/item:text-[#3949ab] transition-colors" />
                                                <span className="text-zinc-600 text-sm leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Eligibility */}
                                <div>
                                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4 text-[#3949ab]" />
                                        Eligibility
                                    </h4>
                                    <ul className="space-y-4">
                                        {role.eligibility.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 group/item">
                                                <div className="h-1.5 w-1.5 rounded-full bg-zinc-300 flex-shrink-0 mt-2 group-hover/item:bg-[#3949ab] transition-colors" />
                                                <span className="text-zinc-600 text-sm leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Note + Closing */}
                            <div className="bg-zinc-50/50 rounded-2xl p-6 border border-zinc-100 space-y-4">
                                <p className="text-zinc-500 text-sm md:text-base leading-relaxed">
                                    {role.note}
                                </p>
                                <p className="text-zinc-900 font-semibold text-sm md:text-base leading-relaxed">
                                    {role.closing}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Page Component ─── */
export default function CareersPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* ────────────────────────────────────────────────
             GLOBAL GRADIENT BACKGROUND — fixed, spans entire page
            ──────────────────────────────────────────────── */}
            <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
                {/* Large primary blob — right side, drifts slowly */}
                <div className="absolute top-[20%] right-[-10%] w-[350px] md:w-[700px] h-[350px] md:h-[700px] rounded-full bg-gradient-to-br from-[#7c4dff]/20 md:from-[#7c4dff]/25 via-[#536dfe]/15 md:via-[#536dfe]/20 to-transparent blur-[60px] md:blur-[120px]"></div>
                {/* Secondary blob — left side */}
                <div className="absolute top-[55%] left-[-8%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-gradient-to-tr from-[#448aff]/15 md:from-[#448aff]/20 via-[#7c4dff]/10 md:via-[#7c4dff]/15 to-transparent blur-[50px] md:blur-[100px]"></div>
                {/* Accent blob — bottom right */}
                <div className="absolute bottom-[10%] right-[5%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] rounded-full bg-gradient-to-tl from-[#e040fb]/10 md:from-[#e040fb]/15 via-[#7c4dff]/10 md:via-[#7c4dff]/10 to-transparent blur-[40px] md:blur-[100px]"></div>
            </div>
            <Navbar />

            {/* ════════════════════════════════════════════════
          HERO — Clean, minimal, centered (Giddly style)
         ════════════════════════════════════════════════ */}
            <section className="relative pt-40 pb-32 md:pt-52 md:pb-44 z-10">

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <p className="text-sm text-gray-400 tracking-widest mb-6 font-medium">
                            ( Your Journey Begins Here )
                        </p>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.1]">
                            Careers at{' '}
                            <span className="text-[#1a237e]">Aspire Institute</span>
                        </h1>

                        <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-4">
                            Aspire The Institute of Human Development
                        </p>

                        <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10">
                            Building Leaders. Transforming Potential. Join our team to shape
                            the future of personal and professional development.
                        </p>

                        <Link href="#open-roles">
                            <button className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1a237e] text-white font-semibold rounded-xl shadow-lg hover:bg-[#283593] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                                See Open Positions
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════
          CORE VALUES — Glassmorphism Cards + Gradient Blob
         ════════════════════════════════════════════════ */}
            <section className="relative py-24 md:py-36 z-10">

                <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
                        {/* Left — Heading */}
                        <div className="lg:sticky lg:top-40">
                            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-gray-900 leading-tight mb-6">
                                Our Core Values Drive
                                <br />
                                Our Culture and Success
                            </h2>
                            <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-md">
                                Aspire Institute is built on a foundation of values that inspire
                                everything we do, from training sessions to team culture.
                            </p>
                        </div>

                        {/* Right — Stacked glassmorphism cards */}
                        <div className="space-y-5 relative">
                            {/* Colorful blobs behind the cards to emphasize the glass effect */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#7c4dff] to-[#e040fb] rounded-full blur-[80px] opacity-30 -z-10 mix-blend-multiply"></div>
                            <div className="absolute bottom-10 left-0 w-48 h-48 bg-gradient-to-tr from-[#448aff] to-[#536dfe] rounded-full blur-[60px] opacity-30 -z-10 mix-blend-multiply"></div>

                            {values.map((value, index) => (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/30 rounded-[2rem] p-6 md:p-8 hover:bg-white/20 hover:border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] hover:shadow-[0_20px_48px_0_rgba(26,35,126,0.1)] transition-all duration-500 hover:-translate-y-1"
                                >
                                    {/* Glass sheen / diagonal reflection */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/5 to-transparent pointer-events-none"></div>
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-50 pointer-events-none"></div>

                                    {/* Subtle internal glow */}
                                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#1a237e]/5 rounded-full blur-2xl group-hover:bg-[#1a237e]/10 transition-colors duration-500 pointer-events-none"></div>

                                    {/* Glass-like Icon Container */}
                                    <div className="relative z-10 h-14 w-14 rounded-2xl bg-white/30 backdrop-blur-md border border-white/50 shadow-sm flex items-center justify-center mb-6 group-hover:bg-white/50 transition-all duration-500 group-hover:scale-110">
                                        <value.icon className="h-6 w-6 text-[#1a237e]" />
                                    </div>

                                    <div className="relative z-10">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#1a237e] transition-colors duration-300">
                                            {value.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm md:text-base leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                                            {value.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════
          CULTURE PHILOSOPHY — Editorial Pull-Quote
         ════════════════════════════════════════════════ */}
            <section className="relative py-20 md:py-28 z-10">
                <div className="container mx-auto px-4 md:px-6 max-w-5xl">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">

                        {/* Large decorative quote mark */}
                        <div className="lg:col-span-2 flex lg:justify-end">
                            <span className="text-[8rem] md:text-[10rem] leading-none font-serif text-[#1a237e]/10 select-none -mt-8">
                                &ldquo;
                            </span>
                        </div>

                        {/* Text content */}
                        <div className="lg:col-span-10 space-y-8">
                            <p className="text-2xl md:text-3xl text-gray-800 leading-[1.4] font-medium tracking-tight">
                                Being selected at Aspire Institute as a part of Team Aspire is not
                                just about receiving a role. It is not just an opportunity. It is{' '}
                                <span className="text-[#1a237e] font-bold">a rare chance to be mentored, challenged, and shaped</span>{' '}
                                in an environment that builds both competence and character.
                            </p>

                            <p className="text-2xl md:text-3xl text-gray-800 leading-[1.4] font-medium tracking-tight">
                                Aspire is not remembered as just a place of work. It is remembered
                                as a phase that built{' '}
                                <span className="text-[#1a237e] font-bold">discipline, clarity and direction</span>.
                                We invite committed joiners who understand that meaningful growth
                                requires effort and gratitude.
                            </p>

                            <div className="pt-4">
                                <div className="h-0.5 w-16 bg-[#1a237e]/20"></div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════
          OPEN POSITIONS — Clean card list (Giddly style)
         ════════════════════════════════════════════════ */}
            <section id="open-roles" className="relative py-20 md:py-28 z-10">

                <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-12 tracking-tight">
                        Explore Open Positions
                    </h2>

                    <div className="space-y-5">
                        {roles.map((role) => (
                            <RoleCard key={role.id} role={role} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════
          WHY JOIN — Minimal grid
         ════════════════════════════════════════════════ */}
            <section className="relative py-20 md:py-28 z-10">
                <div className="container mx-auto px-4 md:px-6 max-w-6xl">

                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">

                        {/* Left — Sticky heading */}
                        <div className="lg:col-span-4 lg:sticky lg:top-32">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-5">
                                Why Join<br />
                                <span className="text-[#1a237e]">Aspire?</span>
                            </h2>
                            <p className="text-gray-500 text-base leading-relaxed mb-8">
                                Aspire does not offer casual roles. It offers growth journeys.
                            </p>
                            {/* Closing quote */}
                            <div className="border-l-2 border-[#1a237e] pl-4 space-y-2">
                                <p className="text-base font-semibold text-gray-900">
                                    Those who recognise its value, <span className="text-[#1a237e]">grow.</span>
                                </p>
                                <p className="text-base font-semibold text-gray-900">
                                    Those who commit to it, <span className="text-[#1a237e]">transform.</span>
                                </p>
                            </div>
                        </div>

                        {/* Right — Numbered typographic list */}
                        <div className="lg:col-span-8">
                            <div className="border-t border-gray-200">
                                {whyJoinReasons.map((reason, index) => (
                                    <div
                                        key={index}
                                        className="group flex items-start gap-6 md:gap-10 py-7 border-b border-gray-200 hover:bg-white/60 transition-colors px-2 -mx-2"
                                    >
                                        <span className="text-3xl md:text-4xl font-bold text-gray-100 group-hover:text-[#c5cae9] transition-colors duration-300 flex-shrink-0 leading-none mt-0.5 select-none">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <p className="text-lg md:text-xl font-semibold text-gray-800 leading-snug group-hover:text-[#1a237e] transition-colors duration-300">
                                            {reason}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Closing paragraph */}
                            <p className="text-gray-500 text-sm md:text-base leading-relaxed mt-8 max-w-2xl">
                                Being a part of Team Aspire, the leading personal and professional
                                development training institute&apos;s team, is a valuable
                                opportunity, one that should be approached with gratitude,
                                commitment and integrity.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════
          CTA
         ════════════════════════════════════════════════ */}
            <section className="relative py-16 md:py-24 z-10">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="relative bg-gradient-to-r from-[#1a237e] via-[#283593] to-[#3949ab] rounded-3xl py-16 md:py-20 px-8 md:px-16 overflow-hidden shadow-2xl">
                            {/* Decorative */}
                            <div
                                className="absolute inset-0 opacity-[0.03]"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                                }}
                            ></div>
                            <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-60 h-60 bg-[#c5cae9]/20 rounded-full blur-3xl"></div>
                            <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-60 h-60 bg-[#c5cae9]/20 rounded-full blur-3xl"></div>

                            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                                <div className="text-center lg:text-left">
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                                        Join Team Aspire
                                    </h2>
                                    <p className="text-[#c5cae9] text-base md:text-lg max-w-xl">
                                        Take the next step in your journey. Drop your resume and a brief introduction at:
                                    </p>
                                    <div className="mt-4">
                                        <a href="mailto:aspire.ihd@gmail.com" className="text-2xl md:text-3xl font-semibold text-white tracking-wide hover:text-[#e8eaf6] transition-colors relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:bg-white after:transition-transform after:duration-300">
                                            aspire.ihd@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                                    <a href="mailto:aspire.ihd@gmail.com">
                                        <button className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#1a237e] font-bold rounded-xl shadow-lg hover:shadow-[0_10px_40px_-5px_rgba(255,255,255,0.4)] hover:-translate-y-1 transition-all duration-300 whitespace-nowrap">
                                            <span>Email Your Resume</span>
                                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
