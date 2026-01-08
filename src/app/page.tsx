"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { createClient, hasSupabaseConfig } from "@/lib/supabase";
import { Auth } from "@/components/Auth";
import { PracticeArea, StandardSelector } from "@/components/PracticeArea";
import { ProgressCard } from "@/components/ProgressCard";
import { PlayerCard } from "@/components/PlayerCard";
import { BadgesDisplay } from "@/components/BadgesDisplay";
import { HomeworkHelper } from "@/components/HomeworkHelper";
import { ReferenceCard } from "@/components/ReferenceCard";
import { FlashCardGame } from "@/components/FlashCardGame";
import {
  BookOpen,
  BarChart3,
  LogOut,
  AlertTriangle,
  Camera,
  Sparkles,
  Library,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "practice" | "homework" | "reference" | "progress";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("practice");
  const [selectedStandardId, setSelectedStandardId] = useState<string | null>(
    null,
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [configError, setConfigError] = useState(false);

  useEffect(() => {
    // Check if Supabase is configured
    if (!hasSupabaseConfig()) {
      setConfigError(true);
      setLoading(false);
      return;
    }

    const supabase = createClient();

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  const handleProblemComplete = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Show config error
  if (configError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="neon-card rounded-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4 neon-border-pink">
            <AlertTriangle className="text-yellow-400" size={32} />
          </div>
          <h1 className="text-xl font-bold text-white mb-2 neon-text-pink">
            Configuration Required
          </h1>
          <p className="text-gray-300 mb-4">
            Supabase credentials are not configured. Please add your Supabase
            URL and API key to the environment variables.
          </p>
          <div className="bg-black/50 rounded-lg p-4 text-left text-sm font-mono neon-border-cyan">
            <p className="text-cyan-400">NEXT_PUBLIC_SUPABASE_URL=...</p>
            <p className="text-cyan-400">NEXT_PUBLIC_SUPABASE_ANON_KEY=...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-fuchsia-600 flex items-center justify-center mx-auto mb-4 neon-glow-pink neon-pulse">
            <span className="text-3xl">🐱</span>
          </div>
          <p className="neon-text-cyan text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not logged in
  if (!user) {
    return <Auth onAuthSuccess={() => {}} />;
  }

  // Main app
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="neon-card border-b border-fuchsia-500/30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-fuchsia-600 to-cyan-500 flex items-center justify-center neon-glow-pink">
                <span className="text-2xl">🐱</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold neon-text-pink flex items-center gap-2">
                  Math Cat
                  <Sparkles className="text-yellow-400" size={20} />
                </h1>
                <p className="text-sm text-cyan-400">
                  7th Grade Mississippi Standards
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-fuchsia-300 hidden sm:inline">
                {user.user_metadata?.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-cyan-400 hover:bg-cyan-500/20 transition-colors neon-button"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="neon-card border-b border-fuchsia-500/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            <TabButton
              active={activeTab === "practice"}
              onClick={() => setActiveTab("practice")}
              icon={<BookOpen size={18} />}
              label="Practice"
              color="cyan"
            />
            <TabButton
              active={activeTab === "homework"}
              onClick={() => setActiveTab("homework")}
              icon={<Camera size={18} />}
              label="Homework Help"
              color="pink"
            />
            <TabButton
              active={activeTab === "reference"}
              onClick={() => setActiveTab("reference")}
              icon={<Library size={18} />}
              label="Reference"
              color="green"
            />
            <TabButton
              active={activeTab === "progress"}
              onClick={() => setActiveTab("progress")}
              icon={<BarChart3 size={18} />}
              label="Progress"
              color="yellow"
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === "practice" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <StandardSelector
                selectedStandardId={selectedStandardId}
                onSelectStandard={setSelectedStandardId}
              />
              <PracticeArea
                userId={user.id}
                selectedStandardId={selectedStandardId}
                onProblemComplete={handleProblemComplete}
              />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <PlayerCard key={`player-${refreshKey}`} userId={user.id} />
              <ProgressCard key={`progress-${refreshKey}`} userId={user.id} />
            </div>
          </div>
        )}

        {activeTab === "homework" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <HomeworkHelper className="h-[600px]" />
            </div>
            <div className="lg:col-span-1">
              <div className="neon-card rounded-xl p-4 mb-6 neon-border-pink">
                <h3 className="font-semibold neon-text-pink mb-3">
                  How to Use 🐱
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="neon-text-cyan font-bold">1.</span>
                    <span>Take a photo of your homework problem</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="neon-text-cyan font-bold">2.</span>
                    <span>Or type the problem in the text box</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="neon-text-cyan font-bold">3.</span>
                    <span>Click send and get step-by-step help!</span>
                  </li>
                </ul>
              </div>
              <ProgressCard key={refreshKey} userId={user.id} />
            </div>
          </div>
        )}

        {activeTab === "reference" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <FlashCardGame
                userId={user.id}
                onXPEarned={handleProblemComplete}
              />
              <ReferenceCard />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <PlayerCard key={`player-ref-${refreshKey}`} userId={user.id} />
              <div className="neon-card rounded-xl p-4 neon-border-green">
                <h3 className="font-semibold neon-text-green mb-3">
                  Study Smart 🐱
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="neon-text-cyan">📚</span>
                    <span>
                      Use the reference cards to look up formulas and vocab
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="neon-text-pink">🎮</span>
                    <span>
                      Play the flash card game to earn +5 Catnip per correct
                      answer!
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="neon-text-yellow">💡</span>
                    <span>
                      Mix it up - try vocab only, formulas only, or mixed mode
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "progress" && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <PlayerCard
              key={`player-progress-${refreshKey}`}
              userId={user.id}
            />
            <BadgesDisplay key={`badges-${refreshKey}`} userId={user.id} />
            <ProgressCard key={`progress-tab-${refreshKey}`} userId={user.id} />
            <div className="neon-card rounded-xl p-6 neon-border-yellow">
              <h3 className="font-semibold neon-text-yellow mb-4">
                Study Tips 🐱
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="neon-text-green">✓</span>
                  <span>
                    Practice a little bit every day rather than cramming
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="neon-text-green">✓</span>
                  <span>
                    If you get a problem wrong, read the explanation carefully
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="neon-text-green">✓</span>
                  <span>Focus on your weakest topics first</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="neon-text-green">✓</span>
                  <span>Use Homework Help to ask questions about concepts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="neon-text-green">✓</span>
                  <span>Aim for 80% mastery on each standard</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-fuchsia-400/60">
        <p>🐱 Math Cat - 7th Grade Mississippi Standards 🐱</p>
      </footer>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  color = "cyan",
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  color?: "cyan" | "pink" | "yellow" | "green";
}) {
  const colorClasses = {
    cyan: active
      ? "neon-text-cyan border-cyan-400"
      : "text-cyan-400/60 border-transparent hover:text-cyan-400",
    pink: active
      ? "neon-text-pink border-fuchsia-400"
      : "text-fuchsia-400/60 border-transparent hover:text-fuchsia-400",
    yellow: active
      ? "neon-text-yellow border-yellow-400"
      : "text-yellow-400/60 border-transparent hover:text-yellow-400",
    green: active
      ? "neon-text-green border-green-400"
      : "text-green-400/60 border-transparent hover:text-green-400",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-3 font-medium transition-all border-b-2 whitespace-nowrap neon-button",
        colorClasses[color],
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
