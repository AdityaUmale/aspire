'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import {
  Mail,
  Phone,
  User,
  Send,
  MessageSquare,
  Sparkles,
  Loader2,
  Calendar
} from "lucide-react";

// Fonts setup
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans' });

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
    <section id="enquiry" className={`py-24 relative bg-white border-t border-gray-100 ${playfair.variable} ${jakarta.variable} font-sans`}>
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1a237e]/10 bg-white shadow-sm">
            <Mail className="h-3.5 w-3.5 text-[#1a237e]" />
            <span className="text-xs font-bold tracking-widest text-[#1a237e] uppercase">Contact Us</span>
          </div>
          
          <div className="max-w-2xl space-y-4">
            <h2 className="font-serif text-4xl md:text-5xl text-[#1a237e] leading-tight">
              Start Your <span className="italic text-[#3949ab]">Transformation.</span>
            </h2>
            <p className="text-gray-500 text-lg font-light">
              Have questions about our programs? Fill out the form below and our admissions team will guide you on the right path.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-gray-100 relative overflow-hidden">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#1a237e] via-[#3949ab] to-[#1a237e]"></div>

            <form onSubmit={handleSubmitEnquiry} className="space-y-8">
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold text-[#1a237e] uppercase tracking-widest">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#1a237e] transition-colors duration-300" />
                    <Input 
                      type="text" 
                      name="name" 
                      id="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      placeholder="Your Name" 
                      required 
                      className="h-12 pl-12 w-full border-gray-200 bg-gray-50/30 rounded-xl focus:ring-2 focus:ring-[#1a237e]/10 focus:border-[#1a237e] transition-all" 
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold text-[#1a237e] uppercase tracking-widest">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#1a237e] transition-colors duration-300" />
                    <Input 
                      type="email" 
                      name="email" 
                      id="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      placeholder="you@example.com" 
                      required 
                      className="h-12 pl-12 w-full border-gray-200 bg-gray-50/30 rounded-xl focus:ring-2 focus:ring-[#1a237e]/10 focus:border-[#1a237e] transition-all" 
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-bold text-[#1a237e] uppercase tracking-widest">Phone Number</Label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#1a237e] transition-colors duration-300" />
                    <Input 
                      type="tel" 
                      name="phone" 
                      id="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      placeholder="+91 98765 43210"
                      required 
                      className="h-12 pl-12 w-full border-gray-200 bg-gray-50/30 rounded-xl focus:ring-2 focus:ring-[#1a237e]/10 focus:border-[#1a237e] transition-all" 
                    />
                  </div>
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-xs font-bold text-[#1a237e] uppercase tracking-widest">Age</Label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#1a237e] transition-colors duration-300" />
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
                      className="h-12 pl-12 w-full border-gray-200 bg-gray-50/30 rounded-xl focus:ring-2 focus:ring-[#1a237e]/10 focus:border-[#1a237e] transition-all" 
                    />
                  </div>
                </div>
              </div>

              {/* Enquiry */}
              <div className="space-y-2">
                <Label htmlFor="enquiry" className="text-xs font-bold text-[#1a237e] uppercase tracking-widest">Your Message</Label>
                <div className="relative group">
                  <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-[#1a237e] transition-colors duration-300" />
                  <Textarea 
                    name="enquiry" 
                    id="enquiry" 
                    rows={4} 
                    value={formData.enquiry} 
                    onChange={handleInputChange} 
                    placeholder="Tell us which course you are interested in or ask any questions..." 
                    required 
                    className="min-h-[120px] pl-12 py-4 w-full border-gray-200 bg-gray-50/30 rounded-xl focus:ring-2 focus:ring-[#1a237e]/10 focus:border-[#1a237e] transition-all resize-none" 
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-full bg-[#1a237e] hover:bg-[#0d1642] text-white text-lg font-medium shadow-lg shadow-[#1a237e]/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] flex items-center justify-center disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Enquiry <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Status Messages */}
            {submitMessage && (
              <div className={`mt-6 p-4 rounded-xl text-center text-sm font-medium animate-in fade-in slide-in-from-bottom-2 ${
                submitMessage.includes('successfully') 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                  : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                {submitMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}