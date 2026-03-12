'use client';

import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        const res = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError('Invalid email or password');
        } else {
            router.push('/');
            router.refresh();
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Welcome Back</h2>
                <p>Sign in to your Cafe account</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@cafe.com"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Sign In with Email</button>

                    <div className="divider">
                        <span>OR</span>
                    </div>

                    <button 
                        type="button" 
                        onClick={() => signIn('google', { callbackUrl: '/' })} 
                        className="google-button"
                    >
                        <svg className="google-icon" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            <path d="M1 1h22v22H1z" fill="none"/>
                        </svg>
                        Continue with Google
                    </button>
                </form>
            </div>

            <style jsx>{`
        .login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          position: relative;
          overflow: hidden;
        }

        .login-container::before {
          content: '';
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          top: -100px;
          left: -100px;
          border-radius: 50%;
        }

        .login-container::after {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%);
          bottom: -200px;
          right: -200px;
          border-radius: 50%;
        }

        .login-card {
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 3rem;
          border-radius: 24px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          z-index: 10;
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        h2 {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
          color: #f8fafc;
          text-align: center;
        }

        p {
          color: #94a3b8;
          text-align: center;
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          text-align: center;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-size: 0.875rem;
          color: #cbd5e1;
          font-weight: 500;
        }

        .input-group input {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.875rem 1rem;
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .input-group input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
          background: rgba(15, 23, 42, 0.8);
        }

        .login-button {
          margin-top: 1rem;
          background: linear-gradient(to right, #6366f1, #a855f7);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -10px rgba(99, 102, 241, 0.6);
        }

        .login-button:active {
          transform: translateY(0);
        }

        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          color: #64748b;
          font-size: 0.875rem;
          margin: 0.5rem 0;
        }

        .divider::before, .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .divider span {
          padding: 0 1rem;
        }

        .google-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          background: white;
          color: #1e293b;
          border: none;
          padding: 1rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .google-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -10px rgba(255, 255, 255, 0.3);
        }

        .google-icon {
          width: 24px;
          height: 24px;
        }
      `}</style>
        </div>
    );
}
