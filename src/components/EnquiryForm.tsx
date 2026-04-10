'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  User,
  Send,
  MessageSquare,
  Loader2,
  Calendar,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  age: string;
  enquiry: string;
}

export default function EnquiryForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    age: '',
    enquiry: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitEnquiry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/submit-enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          const errorMessages = Object.values(result.errors).map((err: unknown) => {
            const error = err as { message: string };
            return error.message;
          }).join(', ');
          throw new Error(`Validation failed: ${errorMessages}`);
        } else {
          throw new Error(result.message || 'Failed to submit enquiry');
        }
      }
      setSubmitMessage('Enquiry submitted successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', age: '', enquiry: '' });
    } catch (error: unknown) {
      console.error('Enquiry submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit enquiry. Please try again later.';
      setSubmitMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="enquiry" className="py-24 lg:py-32 relative z-10 border-t border-gray-50 font-sans selection:bg-[#1a237e] selection:text-white">

      <div className="container px-4 md:px-6 mx-auto max-w-7xl relative z-10">

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          {/* Left Column: Context & Copy */}
          <div className="lg:col-span-5 space-y-8">
            <div className="inline-flex items-center gap-3">
              <span className="h-[2px] w-8 bg-[#3949ab]/40 rounded-full" />
              <span className="text-sm font-bold tracking-[0.2em] text-[#1a237e] uppercase">
                Connect with us
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a237e] leading-[1.1] tracking-tight text-balance">
              Start Your <br />
              <span className="text-[#3949ab] bg-clip-text text-transparent bg-gradient-to-r from-[#1a237e] to-[#3949ab]">
                Transformation.
              </span>
            </h2>

            <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed text-balance">
              Have questions about our programs? Fill out the form below and our admissions team will guide you on the right path.
            </p>


          </div>

          {/* Right Column: Form Container */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-10 lg:p-12 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-[#1a237e]/5 border border-gray-100 relative overflow-hidden group/form-container">

              {/* Dynamic Top Accent Line */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#1a237e]/20 to-transparent group-focus-within/form-container:via-[#1a237e] transition-all duration-700 ease-in-out" />

              <form onSubmit={handleSubmitEnquiry} className="space-y-6">

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Full Name</Label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-[18px] w-[18px] text-gray-400 group-focus-within/input:text-[#1a237e] transition-colors duration-300" />
                      </div>
                      <Input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your Name"
                        required
                        className="h-14 pl-11 w-full border-gray-200 bg-[#FAFAFA] rounded-2xl focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e] transition-all duration-300 text-base placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Email Address</Label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-[18px] w-[18px] text-gray-400 group-focus-within/input:text-[#1a237e] transition-colors duration-300" />
                      </div>
                      <Input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        required
                        className="h-14 pl-11 w-full border-gray-200 bg-[#FAFAFA] rounded-2xl focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e] transition-all duration-300 text-base placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Phone Input */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Phone Number</Label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-[18px] w-[18px] text-gray-400 group-focus-within/input:text-[#1a237e] transition-colors duration-300" />
                      </div>
                      <Input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        required
                        className="h-14 pl-11 w-full border-gray-200 bg-[#FAFAFA] rounded-2xl focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e] transition-all duration-300 text-base placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Age Input */}
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Age</Label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Calendar className="h-[18px] w-[18px] text-gray-400 group-focus-within/input:text-[#1a237e] transition-colors duration-300" />
                      </div>
                      <Input
                        type="number"
                        name="age"
                        id="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="18"
                        min={5}
                        max={120}
                        required
                        className="h-14 pl-11 w-full border-gray-200 bg-[#FAFAFA] rounded-2xl focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e] transition-all duration-300 text-base placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Enquiry Textarea */}
                <div className="space-y-2">
                  <Label htmlFor="enquiry" className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Your Message</Label>
                  <div className="relative group/input">
                    <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                      <MessageSquare className="h-[18px] w-[18px] text-gray-400 group-focus-within/input:text-[#1a237e] transition-colors duration-300" />
                    </div>
                    <Textarea
                      name="enquiry"
                      id="enquiry"
                      rows={4}
                      value={formData.enquiry}
                      onChange={handleInputChange}
                      placeholder="Tell us which program you’re interested in or share any questions you have..."
                      required
                      className="min-h-[140px] pl-11 py-4 w-full border-gray-200 bg-[#FAFAFA] rounded-2xl focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e] transition-all duration-300 text-base placeholder:text-gray-400 resize-none"
                    />
                  </div>
                </div>

                {/* Status Messages - Repositioned above button for better flow */}
                {submitMessage && (
                  <div className={`flex items-start gap-3 p-4 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-bottom-2 ${submitMessage.includes('successfully')
                    ? 'bg-emerald-50/80 text-emerald-800 border border-emerald-100'
                    : 'bg-red-50/80 text-red-800 border border-red-100'
                    }`}>
                    {submitMessage.includes('successfully') ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <span className="leading-relaxed">{submitMessage}</span>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 rounded-2xl bg-[#1a237e] hover:bg-[#10164f] text-white text-base font-semibold shadow-[0_4px_14px_0_rgba(26,35,126,0.39)] hover:shadow-[0_6px_20px_rgba(26,35,126,0.23)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1a237e]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                        Sending Message...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Connect with us
                        <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </span>
                    )}
                  </Button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}