import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Lock, Loader2 } from 'lucide-react';

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log('Attempting login with:', email);

            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            console.log('Login response:', data);

            if (res.ok) {
                console.log('Login successful, redirecting...');
                // Force a hard navigation to ensure state is clear and middleware runs
                window.location.href = '/admin/dashboard';
            } else {
                setError(data.error || 'Login failed');
                setLoading(false); // Only stop loading if we failed
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Connection error. Please check your network.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Head>
                <title>Admin Login | Magri Cabinets</title>
            </Head>

            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 transition-all duration-300">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#7FFF00]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#7FFF00]/20 shadow-[0_0_15px_rgba(127,255,0,0.1)]">
                        <Lock className="w-8 h-8 text-[#7FFF00]" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 italic">Ecoink <span className="text-[#7FFF00] not-italic">Admin</span></h1>
                    <p className="text-gray-500 text-sm mt-2">Enter credentials to manage Ecoink content</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center font-medium border border-red-100 animate-pulse">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#7FFF00] focus:ring-2 focus:ring-[#7FFF00]/20 outline-none transition-all disabled:opacity-50 disabled:bg-gray-50 text-gray-900"
                            placeholder="admin@ecoink.com.au"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#7FFF00] focus:ring-2 focus:ring-[#7FFF00]/20 outline-none transition-all disabled:opacity-50 disabled:bg-gray-50 text-gray-900"
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#7FFF00] hover:bg-[#6ee600] text-black font-bold py-6 rounded-xl text-lg shadow-lg hover:shadow-[#7FFF00]/25 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Authenticating...
                            </>
                        ) : (
                            'Access Dashboard'
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
