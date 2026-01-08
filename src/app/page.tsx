"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { createClient, hasSupabaseConfig } from "@/lib/supabase";
import { Auth } from "@/components/Auth";
import { PracticeArea, StandardSelector } from "@/components/PracticeArea";
import { ProgressCard } from "@/components/ProgressCard";
import { ChatTutor } from "@/components/ChatTutor";
import {
  BookOpen,
  MessageCircle,
  BarChart3,
  GraduationCap,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "practice" | "chat" | "progress";

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

  const handleSuggestPractice = (standardId: string) => {
    setSelectedStandardId(standardId);
  };

  // Show config error
  if (configError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-yellow-600" size={32} />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Configuration Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Supabase credentials are not configured. Please add your Supabase
            URL and API key to the environment variables.
          </p>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-left text-sm font-mono">
            <p className="text-gray-600 dark:text-gray-400">
              NEXT_PUBLIC_SUPABASE_URL=...
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              NEXT_PUBLIC_SUPABASE_ANON_KEY=...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="text-white" size={24} />
          </div>
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <GraduationCap className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Math Tutor
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  7th Grade Mississippi Standards
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user.user_metadata?.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            <TabButton
              active={activeTab === "practice"}
              onClick={() => setActiveTab("practice")}
              icon={<BookOpen size={18} />}
              label="Practice"
            />
            <TabButton
              active={activeTab === "chat"}
              onClick={() => setActiveTab("chat")}
              icon={<MessageCircle size={18} />}
              label="Tutor Chat"
            />
            <TabButton
              active={activeTab === "progress"}
              onClick={() => setActiveTab("progress")}
              icon={<BarChart3 size={18} />}
              label="Progress"
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
            <div className="lg:col-span-1">
              <ProgressCard key={refreshKey} userId={user.id} />
            </div>
          </div>
        )}

        {activeTab === "chat" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ChatTutor
                className="h-[600px]"
                onSuggestPractice={handleSuggestPractice}
              />
            </div>
            <div className="lg:col-span-1">
              <ProgressCard key={refreshKey} userId={user.id} />
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Quick Topics
                </h3>
                <div className="space-y-2">
                  <QuickTopicButton label="Help with percents" />
                  <QuickTopicButton label="Explain negative numbers" />
                  <QuickTopicButton label="Give me a problem" />
                  <QuickTopicButton label="Help with equations" />
                  <QuickTopicButton label="Circle formulas" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "progress" && (
          <div className="space-y-6">
            <ProgressCard
              key={refreshKey}
              userId={user.id}
              className="max-w-2xl mx-auto"
            />
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Study Tips
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">&#10003;</span>
                  <span>
                    Practice a little bit every day rather than cramming
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">&#10003;</span>
                  <span>
                    If you get a problem wrong, read the explanation carefully
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">&#10003;</span>
                  <span>Focus on your weakest topics first</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">&#10003;</span>
                  <span>
                    Use the chat tutor to ask questions about concepts
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">&#10003;</span>
                  <span>Aim for 80% mastery on each standard</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          7th Grade Math Tutor - Mississippi College and Career Readiness
          Standards
        </p>
      </footer>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2",
        active
          ? "text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400"
          : "text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function QuickTopicButton({ label }: { label: string }) {
  return (
    <button className="w-full text-left px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
      {label}
    </button>
  );
}
