"use client"

import {
  PenLine,
  Users,
  BookOpen,
  ArrowRight,
  Brain,
  Send,
  Eye,
  CheckCircle,
  Clock,
  TrendingUp,
  NotebookPen,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

function PublishJourney() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const steps = [
    {
      icon: Send,
      title: "Write & Submit",
      description: "Pour your thoughts into words. Share your growth story, insights, or lessons learned.",
      status: "Your draft is ready",
    },
    {
      icon: Eye,
      title: "Team Reviews",
      description: "Our editorial team carefully reviews your submission for quality and relevance.",
      status: "Under review",
    },
    {
      icon: CheckCircle,
      title: "Get Published",
      description: "Once approved, your article goes live for thousands of students to read and be inspired by.",
      status: "Published!",
    },
  ]

  return (
    <div className="relative bg-white rounded-3xl p-8 lg:p-10 border border-[#e8eaf6] shadow-[0_8px_40px_-12px_rgba(26,35,126,0.12)] overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#e8eaf6] to-transparent opacity-50 rounded-bl-full" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e8eaf6] mb-4">
              <PenLine className="w-3.5 h-3.5 text-[#1a237e]" />
              <span className="text-xs font-sans font-semibold text-[#1a237e] uppercase tracking-wide">
                Your Voice Matters
              </span>
            </div>
            <h3 className="font-bold text-3xl lg:text-4xl text-[#1a237e] mb-2">Publish Your Story</h3>
            <p className="font-sans text-gray-600 max-w-md">
              Transform your experiences into inspiration for others. Your journey could be the spark someone needs.
            </p>
          </div>
        </div>

        {/* Timeline Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-[#e8eaf6] hidden md:block" />
          <div
            className="absolute left-6 top-8 w-0.5 bg-gradient-to-b from-[#1a237e] to-[#3949ab] hidden md:block transition-all duration-500"
            style={{ height: `${(activeStep + 1) * 33.33}%`, maxHeight: "calc(100% - 64px)" }}
          />

          <div className="space-y-6">
            {steps.map((step, index) => {
              const isActive = index === activeStep
              const isCompleted = index < activeStep

              return (
                <div
                  key={step.title}
                  className={`relative flex items-start gap-5 p-5 rounded-2xl transition-all duration-500 cursor-pointer ${isActive ? "bg-[#e8eaf6]/60 scale-[1.02]" : "hover:bg-[#e8eaf6]/30"
                    }`}
                  onClick={() => setActiveStep(index)}
                >
                  {/* Step Number/Icon */}
                  <div
                    className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${isActive
                      ? "bg-gradient-to-br from-[#1a237e] to-[#3949ab] shadow-lg shadow-[#1a237e]/30"
                      : isCompleted
                        ? "bg-[#3949ab]"
                        : "bg-white border-2 border-[#e8eaf6]"
                      }`}
                  >
                    <step.icon
                      className={`w-5 h-5 transition-colors duration-300 ${isActive || isCompleted ? "text-white" : "text-[#3949ab]"
                        }`}
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4
                        className={`font-sans font-semibold text-lg transition-colors duration-300 ${isActive ? "text-[#1a237e]" : "text-gray-700"
                          }`}
                      >
                        {step.title}
                      </h4>
                      {isActive && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#1a237e] text-white text-xs font-sans font-medium animate-pulse">
                          {step.status}
                        </span>
                      )}
                    </div>
                    <p
                      className={`font-sans text-sm leading-relaxed transition-colors duration-300 ${isActive ? "text-gray-700" : "text-gray-500"
                        }`}
                    >
                      {step.description}
                    </p>
                  </div>

                  {/* Step indicator for mobile */}
                  <div className="md:hidden text-xs font-sans font-medium text-[#3949ab]">{index + 1}/3</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 pt-6 border-t border-[#e8eaf6]">
          <Link
            href="/publish-article"
            className="inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-[#1a237e] to-[#3949ab] text-white font-sans font-semibold rounded-xl hover:shadow-lg hover:shadow-[#1a237e]/25 transition-all duration-300 group"
          >
            <span>Start Writing Today</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function StudentStoriesCard() {
  const storyTypes = [
    {
      icon: TrendingUp,
      title: "Growth Journeys",
      description: "Personal transformation stories and breakthrough moments",

    },
    {
      icon: Brain,
      title: "Learning Experiences",
      description: "Academic challenges overcome and study techniques that work",

    },
    {
      icon: Users,
      title: "Relationship Wisdom",
      description: "Friendships, family dynamics, and social connections",

    }
  ]

  return (
    <div className="relative bg-gradient-to-br from-[#1a237e] to-[#3949ab] rounded-3xl p-8 lg:p-10 overflow-hidden text-white">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 backdrop-blur">
            <Users className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
          <span className="text-sm font-sans font-semibold text-white/80 uppercase tracking-wide">Student Voices</span>
        </div>

        <h3 className="font-bold text-3xl lg:text-4xl text-white mb-3">Authentic Stories</h3>
        <p className="font-sans text-white/70 mb-8 max-w-sm leading-relaxed">
          From overcoming challenges to celebrating victories, our students share their most meaningful experiences and lessons learned.
        </p>

        {/* Story type cards */}
        <div className="space-y-3 mb-8">
          {storyTypes.map((story, index) => (
            <div
              key={story.title}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-colors duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20">
                <story.icon className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-sans font-semibold text-sm text-white">{story.title}</p>

                </div>
                <p className="font-sans text-xs text-white/70 leading-relaxed">{story.description}</p>
              </div>
            </div>
          ))}
        </div>



        {/* CTA */}
        <Link
          href="/student-articles"
          className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#1a237e] font-sans font-semibold rounded-xl hover:bg-[#e8eaf6] transition-colors duration-300 group"
        >
          <span>Explore Stories</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  )
}

function AspireInsightsCard() {
  const topics = [
    { icon: TrendingUp, label: "Productivity" },
    { icon: Brain, label: "Mindset" },
    { icon: Clock, label: "Time Management" },
  ]

  return (
    <div className="relative bg-white rounded-3xl p-8 lg:p-10 border border-[#e8eaf6] shadow-[0_8px_40px_-12px_rgba(26,35,126,0.12)] overflow-hidden">
      {/* Decorative */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#e8eaf6] rounded-full opacity-50" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a237e] to-[#3949ab]">
            <BookOpen className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
          <span className="text-sm font-sans font-semibold text-[#1a237e] uppercase tracking-wide">Expert Content</span>
        </div>

        <h3 className="font-bold text-3xl lg:text-4xl text-[#1a237e] mb-3">Aspire Insights</h3>
        <p className="font-sans text-gray-600 mb-8 max-w-sm leading-relaxed">
          Curated knowledge from our team. Deep dives into personal development strategies that actually work.
        </p>

        {/* Topic Pills */}
        <div className="space-y-3 mb-8">
          {topics.map((topic) => (
            <div
              key={topic.label}
              className="flex items-center gap-4 p-4 rounded-xl bg-[#e8eaf6]/50 transition-colors duration-300 group cursor-pointer"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#e8eaf6] group-hover:bg-white transition-colors duration-300">
                <topic.icon className="w-5 h-5 text-[#3949ab]" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="font-sans font-semibold text-[#1a237e]">{topic.label}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#3949ab] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#1a237e] text-white font-sans font-semibold rounded-xl hover:bg-[#3949ab] transition-colors duration-300 group"
        >
          <span>Read Articles</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  )
}

export default function ArticlesSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-0 w-96 h-96 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-20 right-0 w-80 h-80 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e8eaf6] mb-6">
            <NotebookPen className="w-4 h-4 text-[#1a237e]" />
            <span className="text-sm font-sans font-semibold text-[#1a237e] tracking-wide uppercase">
              Knowledge Hub
            </span>
          </div>
          <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl text-[#1a237e] mb-6 text-balance">
            Articles That Inspire
          </h2>
          <p className="font-sans text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-pretty">
            Share your story, learn from peers, or dive into expert insights. Our article ecosystem fuels your growth
            journey.
          </p>
        </div>

        <div className="space-y-6 lg:space-y-8">
          {/* Publish Journey - Full Width */}
          <PublishJourney />

          {/* Two Cards Side by Side */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <StudentStoriesCard />
            <AspireInsightsCard />
          </div>
        </div>
      </div>
    </section>
  )
}
