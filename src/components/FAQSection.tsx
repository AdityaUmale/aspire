"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQItem = {
    question: string;
    answer: string;
};

const faqs: FAQItem[] = [
    {
        question: "1. What are the fees for Aspire Institute’s Training Program?",
        answer: "The Training Program fees vary depending on the program, duration, and level of proficiency. Aspire Institute offers different courses tailored for learners, professionals, and leaders. For a detailed fee structure, learners can contact the office.",
    },
    {
        question: "2. What is the duration of the offered Training Program?",
        answer: "Course duration depends on the selected program. Some programs run for a few weeks, while others are structured as 3-month, 6-month, or long-term development programs. A clear timeline is shared at the time of enrolment, regardless of the courses.",
    },
    {
        question: "3. Are training programs available on the online platform?",
        answer: "Yes, Aspire Institute offers both offline and online sessions. Online sessions are conducted through structured live classes with interactive learning support.",
    },
    {
        question: "4. Do you accept various payment methods?",
        answer: "Yes, Aspire Institute accepts multiple payment modes including UPI, bank transfer, cards and other standard digital payment options. Details are shared during the admission process.",
    },
    {
        question: "5. How to enrol for the Training Program?",
        answer: "Learners can enrol by telecalling, visiting the institute office, contacting the admission team, or filling out the registration form provided by Aspire Institute. The counselling team guides learners through course selection and enrolment.",
    },
    {
        question: "6. What documents do I need to submit for enrollment?",
        answer: "Basic documents such as identification proof, ‘AADHAR’ Card and recent photographs are required. The admission team provides a clear checklist during registration.",
    },
    {
        question: "7. Will I get a certificate after completion?",
        answer: "Yes, Learners receive a certificate upon successful completion of the course, subject to attendance and performance criteria.",
    },
    {
        question: "8. What are the office timings?",
        answer: "Morning 8 am to evening 8 Pm on weekdays, excluding Sundays. The timings may vary slightly on weekends or special days. Learners are encouraged to contact the office directly for updated timings.",
    },
    {
        question: "9. Why was Aspire Institute established in Akola?",
        answer: "Aspire was established in Akola with a clear mission: to bring world-class human development training to Tier-2 and Tier-3 cities equally. The vision was to create opportunities locally so students wouldn’t have to migrate to metros to access quality personal and professional development.",
    },
    {
        question: "10. Why is it called an Institute of Human Development?",
        answer: "Because Aspire focuses beyond academics. Known as the University of Life. It works on communication, confidence, leadership, emotional intelligence, public speaking, and professional growth. The goal is not just skill-enrichment, but also personality development.",
    },
    {
        question: "11. What problems do we solve at Aspire Institute for our learners?",
        answer: "Aspire addresses challenges such as lack of confidence, fear of public speaking, weak communication skills, unclear career direction, and limited leadership exposure. The institute provides structured mentorship, practical exposure, and real-world learning experiences to bridge these gaps.",
    },
    {
        question: "12. What are the most popular/sought-after courses at the institute?",
        answer: "The most sought-after programs at Aspire Institute are Self Improvement Training Program, Leadership Development Programs, English Language Training, Effective Communication & Public Speaking, Arise Language & Thoughts Enrichment Camp, Personality Development Courses and the International Workshop and conference ‘Meet Yourself’. These programs are popular because they directly impact confidence, career readiness, and real-world performance.",
    },
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 md:py-32 relative z-10 selection:bg-[#1a237e]/10 selection:text-[#1a237e]" id="faqs">
            <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                    {/* Left Column: Sticky Header Area */}
                    <div className="lg:col-span-5 lg:sticky lg:top-32 text-center lg:text-left">
                        <div className="inline-flex items-center gap-3 mb-6 justify-center lg:justify-start">
                            <span className="h-px w-8 bg-[#1a237e]/40 hidden lg:block"></span>
                            <span className="text-[#1a237e] uppercase tracking-widest text-xs font-bold">
                                Got Questions?
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1a237e] mb-6 leading-tight tracking-tight">
                            Frequently <br className="hidden lg:block" /> Asked Questions
                        </h2>
                        <p className="text-gray-600 max-w-md mx-auto lg:mx-0 text-lg md:text-xl leading-relaxed">
                            Everything you need to know about our programs, methodology, and how we help you grow.
                        </p>
                    </div>

                    {/* Right Column: Interactive FAQ List */}
                    <div className="lg:col-span-7 space-y-4">
                        {faqs.map((faq, index) => {
                            const isOpen = openIndex === index;

                            return (
                                <div
                                    key={index}
                                    className={`group border rounded-2xl bg-white transition-all duration-300 ${isOpen
                                        ? "border-[#1a237e]/30 shadow-lg shadow-[#1a237e]/5"
                                        : "border-gray-200 hover:border-[#1a237e]/20 hover:shadow-md"
                                        }`}
                                >
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a237e] focus-visible:ring-offset-2 rounded-2xl"
                                        aria-expanded={isOpen}
                                    >
                                        <span
                                            className={`font-semibold text-base md:text-lg pr-6 transition-colors duration-300 leading-snug ${isOpen ? "text-[#1a237e]" : "text-gray-800 group-hover:text-[#1a237e]"
                                                }`}
                                        >
                                            {faq.question}
                                        </span>
                                        <div
                                            className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-[#1a237e] text-white rotate-180" : "bg-gray-50 text-gray-400 group-hover:bg-[#1a237e]/10 group-hover:text-[#1a237e]"
                                                }`}
                                        >
                                            <ChevronDown className="h-5 w-5" />
                                        </div>
                                    </button>

                                    {/* CSS Grid used here for buttery-smooth height animation */}
                                    <div
                                        className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                            }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="p-6 md:p-8 pt-0 text-gray-600 md:text-lg leading-relaxed">
                                                <div className="h-px w-full bg-gray-100 mb-6"></div>
                                                {faq.answer}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
}