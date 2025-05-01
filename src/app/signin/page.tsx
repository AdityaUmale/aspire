'use client'; // Mark as a client component

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import { Button } from '@/components/ui/button'; // Assuming you have a Button component
import { Input } from '@/components/ui/input'; // Assuming you have an Input component
import { Label } from '@/components/ui/label'; // Assuming you have a Label component

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(''); // Clear previous errors
        setLoading(true);

        try {
            const response = await fetch('/api/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle API errors (e.g., invalid credentials)
                setError(data.error || `An error occurred: ${response.statusText}`);
            } else {
                // Handle success
                console.log('Login successful:', data);
                // Redirect to admin dashboard or another protected page
                router.push('/admin'); // Adjust the redirect path as needed
            }
        } catch (err) {
            console.error('Sign-in request failed:', err);
            setError('Sign-in request failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f8f9fa] via-[#e8eaf6] to-[#c5cae9]">
            <div className="relative w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/30">
                {/* Optional: Add subtle background elements like the main page if desired */}
                {/* <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#1a237e]/10 rounded-full blur-xl -z-10"></div> */}
                {/* <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#1a237e]/10 rounded-full blur-xl -z-10"></div> */}

                <h1 className="text-2xl font-bold text-center text-[#1a237e]">Admin Sign In</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="email" className="text-gray-700">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@example.com"
                            className="mt-1 border-gray-300 focus:border-[#1a237e] focus:ring focus:ring-[#1a237e]/50 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <Label htmlFor="password" className="text-gray-700">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="********"
                            className="mt-1 border-gray-300 focus:border-[#1a237e] focus:ring focus:ring-[#1a237e]/50 rounded-md shadow-sm"
                        />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div>
                        <Button
                            type="submit"
                            className="w-full bg-[#1a237e] hover:bg-[#0d1642] text-white shadow-md transition-all duration-300 hover:shadow-lg"
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}