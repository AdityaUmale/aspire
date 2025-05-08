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
  Send
} from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  enquiry: string;
}

export default function EnquiryForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
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
    // console.log('Enquiry data:', formData); // You can keep this for debugging if you like
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
        // Handle specific validation errors if provided by the backend
        if (result.errors) {
          const errorMessages = Object.values(result.errors).map((err: any) => err.message).join(', ');
          throw new Error(`Validation failed: ${errorMessages}`);
        } else {
          throw new Error(result.message || 'Failed to submit enquiry');
        }
      }
      setSubmitMessage('Enquiry submitted successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', enquiry: '' }); // Reset form
    } catch (error: any) {
      console.error('Enquiry submission error:', error);
      setSubmitMessage(error.message || 'Failed to submit enquiry. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="enquiry" className="py-16 md:py-20 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-[#e8eaf6] px-3 py-1 text-sm text-[#1a237e] shadow-sm">
            <Mail className="h-3.5 w-3.5 mr-1.5 text-[#1a237e]" />
            Get in Touch
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#1a237e]">
            Have Questions? Reach Out to Us!
          </h2>
          <p className="text-gray-500 md:text-lg max-w-2xl">
            Fill out the form below and our team will get back to you as soon as possible.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-gradient-to-br from-[#f8f9fa] to-[#e8eaf6] p-8 rounded-xl shadow-xl border border-[#c5cae9]/50">
          <form onSubmit={handleSubmitEnquiry} className="space-y-6">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-[#1a237e] mb-1">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  type="text" 
                  name="name" 
                  id="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="John Doe" 
                  required 
                  className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e]" 
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-[#1a237e] mb-1">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  type="email" 
                  name="email" 
                  id="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  placeholder="you@example.com" 
                  required 
                  className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e]" 
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone" className="block text-sm font-medium text-[#1a237e] mb-1">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  type="tel" 
                  name="phone" 
                  id="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  placeholder="91-9876543210"
                  required 
                  className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e]" 
                />
              </div>
            </div>
            <div>
              <Label htmlFor="enquiry" className="block text-sm font-medium text-[#1a237e] mb-1">Your Enquiry</Label>
              <Textarea 
                name="enquiry" 
                id="enquiry" 
                rows={4} 
                value={formData.enquiry} 
                onChange={handleInputChange} 
                placeholder="How can we help you?" 
                required 
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e]" 
              />
            </div>
            <div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#1a237e] hover:bg-[#0d1642] text-white font-semibold py-3 px-4 rounded-md shadow-md transition-all duration-300 hover:shadow-lg flex items-center justify-center disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Send Enquiry <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
          {submitMessage && (
            <p className={`mt-4 text-center text-sm ${submitMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {submitMessage}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}