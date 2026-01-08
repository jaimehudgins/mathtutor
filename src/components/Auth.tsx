"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Mail, Lock, User, LogIn, UserPlus, Sparkles } from "lucide-react";

interface AuthProps {
  onAuthSuccess: () => void;
}

type AuthMode = "login" | "signup";

export function Auth({ onAuthSuccess }: AuthProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      onAuthSuccess();
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setMessage("Check your email to confirm your account, then log in! 🐱");
      setMode("login");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-fuchsia-600 to-cyan-500 mb-4 neon-glow-pink neon-pulse">
            <span className="text-4xl">🐱</span>
          </div>
          <h1 className="text-3xl font-bold neon-text-pink flex items-center justify-center gap-2">
            Math Cat
            <Sparkles className="text-yellow-400" size={24} />
          </h1>
          <p className="text-cyan-400 mt-1">Your purr-sonal math companion</p>
        </div>

        {/* Auth Card */}
        <div className="neon-card rounded-xl p-6 neon-border-pink">
          {/* Tab Switcher */}
          <div className="flex mb-6 bg-black/30 rounded-lg p-1">
            <button
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all",
                mode === "login"
                  ? "bg-fuchsia-600 text-white neon-glow-pink"
                  : "text-gray-400 hover:text-fuchsia-400",
              )}
            >
              <LogIn size={16} />
              Log In
            </button>
            <button
              onClick={() => {
                setMode("signup");
                setError(null);
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all",
                mode === "signup"
                  ? "bg-cyan-600 text-white neon-glow-cyan"
                  : "text-gray-400 hover:text-cyan-400",
              )}
            >
              <UserPlus size={16} />
              Sign Up
            </button>
          </div>

          {/* Success Message */}
          {message && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg neon-border-green">
              <p className="text-sm text-green-400">{message}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={mode === "login" ? handleLogin : handleSignup}
            className="space-y-4"
          >
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-fuchsia-300 mb-1">
                  Name 🐱
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-fuchsia-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className={cn(
                      "w-full pl-10 pr-4 py-2.5 rounded-lg border",
                      "bg-black/30 text-white placeholder-gray-500",
                      "border-fuchsia-500/50",
                      "focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400",
                    )}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 rounded-lg border",
                    "bg-black/30 text-white placeholder-gray-500",
                    "border-cyan-500/50",
                    "focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400",
                  )}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400"
                  size={18}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 rounded-lg border",
                    "bg-black/30 text-white placeholder-gray-500",
                    "border-green-500/50",
                    "focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400",
                  )}
                  required
                  minLength={6}
                />
              </div>
              {mode === "signup" && (
                <p className="mt-1 text-xs text-gray-400">
                  Must be at least 6 characters
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full py-3 rounded-lg font-bold transition-all text-lg",
                "bg-gradient-to-r from-fuchsia-600 to-cyan-600 text-white",
                "hover:from-fuchsia-500 hover:to-cyan-500",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "neon-button",
              )}
              style={{
                boxShadow:
                  "0 0 20px rgba(255, 0, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.3)",
              }}
            >
              {loading
                ? "Please wait... 🐱"
                : mode === "login"
                  ? "Log In 🐱"
                  : "Create Account 🐱"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-fuchsia-400/60 mt-6">
          🐱 Practice math anytime, anywhere! 🐱
        </p>
      </div>
    </div>
  );
}
