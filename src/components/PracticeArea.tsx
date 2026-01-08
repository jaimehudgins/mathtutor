"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  Problem,
  generateProblem,
  getRandomProblem,
  checkAnswer,
  getAvailableStandardIds,
} from "@/lib/problems";
import { STANDARDS } from "@/constants/standards";
import { recordProblemAttempt, ProblemResult } from "@/lib/supabase-storage";
import { getCelebration, getEncouragement } from "@/lib/cats";
import { XPPopup } from "./XPPopup";
import {
  CheckCircle,
  XCircle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Sparkles,
  RefreshCw,
} from "lucide-react";

interface PracticeAreaProps {
  userId: string;
  selectedStandardId?: string | null;
  onProblemComplete?: (correct: boolean) => void;
  className?: string;
}

type FeedbackState =
  | "none"
  | "correct"
  | "first-try-wrong"
  | "second-try-wrong"
  | "hint";

// Neon domain colors
const NEON_DOMAIN_COLORS: Record<string, string> = {
  RP: "bg-cyan-500",
  NS: "bg-green-500",
  EE: "bg-fuchsia-500",
  G: "bg-orange-500",
  SP: "bg-pink-500",
};

export function PracticeArea({
  userId,
  selectedStandardId,
  onProblemComplete,
  className,
}: PracticeAreaProps) {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>("none");
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [catReward, setCatReward] = useState<{
    gif: string;
    message: string;
  } | null>(null);
  const [xpResult, setXpResult] = useState<ProblemResult | null>(null);
  const [showXpPopup, setShowXpPopup] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const loadNewProblem = useCallback(() => {
    let newProblem: Problem | null;
    if (selectedStandardId) {
      newProblem = generateProblem(selectedStandardId);
    } else {
      newProblem = getRandomProblem();
    }
    setProblem(newProblem);
    setUserAnswer("");
    setFeedback("none");
    setShowExplanation(false);
    setCatReward(null);
    setXpResult(null);
    setShowXpPopup(false);
    setAttemptCount(0);
  }, [selectedStandardId]);

  useEffect(() => {
    loadNewProblem();
  }, [loadNewProblem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem || !userAnswer.trim() || submitting) return;

    setSubmitting(true);
    const isCorrect = checkAnswer(problem, userAnswer);
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);

    if (isCorrect) {
      // Record to Supabase and get XP result
      const result = await recordProblemAttempt(
        userId,
        problem,
        userAnswer.trim(),
        true,
      );
      setXpResult(result);

      const newStreak = result.currentStreak;
      setFeedback("correct");
      setStreak(newStreak);
      setCatReward(getCelebration(newStreak));
      setShowXpPopup(true);
      setShowExplanation(true);
      onProblemComplete?.(true);
    } else {
      // First wrong attempt - show hint and allow retry
      if (newAttemptCount === 1) {
        setFeedback("first-try-wrong");
        setUserAnswer(""); // Clear for second attempt
      } else {
        // Second wrong attempt - record as incorrect, show answer
        const result = await recordProblemAttempt(
          userId,
          problem,
          userAnswer.trim(),
          false,
        );
        setXpResult(result);

        setFeedback("second-try-wrong");
        setStreak(0);
        setCatReward(getEncouragement());
        setShowExplanation(true);
        onProblemComplete?.(false);
      }
    }

    setSubmitting(false);
  };

  const handleShowHint = () => {
    setFeedback("hint");
  };

  const handleNextProblem = () => {
    loadNewProblem();
  };

  if (!problem) {
    return (
      <div
        className={cn("neon-card rounded-xl p-6 neon-border-cyan", className)}
      >
        <p className="text-cyan-400">Loading problem... 🐱</p>
      </div>
    );
  }

  const standard = STANDARDS.find((s) => s.id === problem.standardId);
  const domainColor = standard
    ? NEON_DOMAIN_COLORS[standard.domainCode] || "bg-fuchsia-500"
    : "bg-fuchsia-500";

  const isFinished = feedback === "correct" || feedback === "second-try-wrong";

  return (
    <div className={cn("neon-card rounded-xl p-6 neon-border-pink", className)}>
      {/* XP Popup */}
      {showXpPopup && xpResult && (
        <XPPopup
          xpEarned={xpResult.xpEarned}
          xpBreakdown={xpResult.xpBreakdown}
          newBadges={xpResult.newBadges}
          newLevel={xpResult.newLevel}
          levelInfo={xpResult.levelInfo}
          currentStreak={xpResult.currentStreak}
          onClose={() => setShowXpPopup(false)}
        />
      )}

      {/* Header with standard info and streak */}
      <div className="flex justify-between items-start mb-4">
        <div>
          {standard && (
            <span
              className={cn(
                "inline-block px-3 py-1 rounded-full text-xs font-bold text-white",
                domainColor,
              )}
              style={{ boxShadow: "0 0 10px currentColor" }}
            >
              {standard.code}: {standard.title}
            </span>
          )}
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1 neon-text-yellow animate-pulse">
            <span className="text-lg">🔥</span>
            <span className="font-bold text-xl">{streak}</span>
            <span className="text-lg">🐱</span>
            <Sparkles size={16} className="text-yellow-400" />
          </div>
        )}
      </div>

      {/* Problem */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold neon-text-cyan mb-2">
          Problem 🐱
        </h3>
        <p className="text-xl text-white leading-relaxed">{problem.question}</p>
      </div>

      {/* Answer Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder={
              feedback === "first-try-wrong"
                ? "Try again..."
                : "Enter your answer..."
            }
            className={cn(
              "flex-1 px-4 py-3 rounded-lg border-2 text-lg font-mono",
              "bg-black/30 text-white placeholder-gray-500",
              "focus:outline-none",
              feedback === "correct" &&
                "border-green-500 bg-green-500/20 neon-border-green",
              feedback === "second-try-wrong" && "border-red-500 bg-red-500/20",
              (feedback === "none" || feedback === "first-try-wrong") &&
                "border-fuchsia-500/50 focus:border-fuchsia-400",
              feedback === "hint" && "border-yellow-500 bg-yellow-500/20",
            )}
            disabled={isFinished}
          />
          <button
            type="submit"
            disabled={!userAnswer.trim() || isFinished || submitting}
            className={cn(
              "px-6 py-3 rounded-lg font-bold transition-all",
              "bg-gradient-to-r from-fuchsia-600 to-cyan-600 text-white",
              "hover:from-fuchsia-500 hover:to-cyan-500",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "neon-button",
            )}
            style={{ boxShadow: "0 0 15px rgba(255, 0, 255, 0.5)" }}
          >
            {submitting
              ? "..."
              : feedback === "first-try-wrong"
                ? "Try Again"
                : "Check"}
          </button>
        </div>
      </form>

      {/* Hint Button - show before any attempts */}
      {feedback === "none" && (
        <button
          onClick={handleShowHint}
          className="flex items-center gap-2 neon-text-yellow hover:underline mb-4 neon-button"
        >
          <Lightbulb size={18} />
          <span>Need a hint? 🐱</span>
        </button>
      )}

      {/* Pre-attempt Hint Display */}
      {feedback === "hint" && (
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2">
            <Lightbulb className="text-yellow-400 mt-0.5" size={20} />
            <p className="text-yellow-300">{problem.hint}</p>
          </div>
        </div>
      )}

      {/* First Wrong Attempt - Show hint and encourage retry */}
      {feedback === "first-try-wrong" && (
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2 mb-3">
            <RefreshCw className="text-yellow-400 mt-0.5" size={20} />
            <div>
              <p className="text-yellow-300 font-semibold mb-1">
                Not quite - but don't give up! 🐱
              </p>
              <p className="text-yellow-200 text-sm">
                Let's paws and think about this... Here's a hint:
              </p>
            </div>
          </div>
          <div className="bg-yellow-500/10 rounded-lg p-3 ml-7">
            <p className="text-yellow-300">{problem.hint}</p>
          </div>
          <p className="text-yellow-200 text-sm mt-3 ml-7">
            You've got one more try! You're claw-some - I believe in you! 💪🐱
          </p>
        </div>
      )}

      {/* Cat Reward Display - only for correct or final wrong */}
      {catReward && isFinished && (
        <div
          className={cn(
            "rounded-lg p-4 mb-4 text-center",
            feedback === "correct"
              ? "bg-green-500/20 border border-green-500/50 neon-border-green"
              : "bg-orange-500/20 border border-orange-500/50",
          )}
        >
          <p
            className={cn(
              "text-xl font-bold mb-3",
              feedback === "correct" ? "neon-text-green" : "text-orange-400",
            )}
          >
            {catReward.message}
          </p>
          <img
            src={catReward.gif}
            alt="Cat reward"
            className="mx-auto rounded-lg max-h-40 object-contain"
            style={{
              boxShadow:
                feedback === "correct"
                  ? "0 0 20px rgba(57, 255, 20, 0.5)"
                  : "0 0 20px rgba(255, 102, 0, 0.5)",
            }}
          />
        </div>
      )}

      {/* Show correct answer for second wrong attempt */}
      {feedback === "second-try-wrong" && (
        <div className="bg-cyan-500/20 border border-cyan-500/50 rounded-lg p-4 mb-4">
          <p className="text-cyan-300">
            <strong className="neon-text-cyan">The correct answer was:</strong>{" "}
            {problem.correctAnswer}
          </p>
          <p className="text-cyan-200 text-sm mt-2">
            Don't worry - every cat learns at their own pace! Let's see the
            explanation and try another one. 🐱
          </p>
        </div>
      )}

      {/* Explanation - show after finished */}
      {showExplanation && isFinished && (
        <div className="bg-fuchsia-500/20 border border-fuchsia-500/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold neon-text-pink mb-2">Explanation 🐱</h4>
          <p className="text-fuchsia-200">{problem.explanation}</p>
        </div>
      )}

      {/* Next Problem Button */}
      {isFinished && (
        <div className="flex gap-3">
          <button
            onClick={handleNextProblem}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all",
              "bg-gradient-to-r from-green-600 to-cyan-600 text-white",
              "hover:from-green-500 hover:to-cyan-500",
              "neon-button",
            )}
            style={{ boxShadow: "0 0 15px rgba(57, 255, 20, 0.5)" }}
          >
            <span>Next Problem 🐱</span>
            <ArrowRight size={20} />
          </button>
          <button
            onClick={loadNewProblem}
            className={cn(
              "flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors",
              "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/50",
              "hover:bg-fuchsia-500/30 neon-button",
            )}
            title="Try a different problem"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

// Standard selector component
interface StandardSelectorProps {
  selectedStandardId: string | null;
  onSelectStandard: (standardId: string | null) => void;
  className?: string;
}

export function StandardSelector({
  selectedStandardId,
  onSelectStandard,
  className,
}: StandardSelectorProps) {
  const availableStandards = getAvailableStandardIds();
  const standards = STANDARDS.filter((s) => availableStandards.includes(s.id));

  return (
    <div className={cn("neon-card rounded-xl p-4 neon-border-cyan", className)}>
      <h3 className="font-semibold neon-text-cyan mb-3">
        Practice by Standard 🐱
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectStandard(null)}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium transition-all neon-button",
            selectedStandardId === null
              ? "bg-gradient-to-r from-fuchsia-600 to-cyan-600 text-white"
              : "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/50 hover:bg-fuchsia-500/30",
          )}
          style={
            selectedStandardId === null
              ? { boxShadow: "0 0 10px rgba(255, 0, 255, 0.5)" }
              : {}
          }
        >
          All Topics
        </button>
        {standards.map((standard) => {
          const isSelected = selectedStandardId === standard.id;
          const domainColor =
            NEON_DOMAIN_COLORS[standard.domainCode] || "bg-fuchsia-500";
          return (
            <button
              key={standard.id}
              onClick={() => onSelectStandard(standard.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all neon-button",
                isSelected
                  ? `${domainColor} text-white`
                  : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-500/30",
              )}
              style={isSelected ? { boxShadow: "0 0 10px currentColor" } : {}}
              title={standard.description}
            >
              {standard.code}
            </button>
          );
        })}
      </div>
    </div>
  );
}
