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
import { STANDARDS, getDomainColor } from "@/constants/standards";
import { recordProblemAttempt } from "@/lib/supabase-storage";
import {
  CheckCircle,
  XCircle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

interface PracticeAreaProps {
  userId: string;
  selectedStandardId?: string | null;
  onProblemComplete?: (correct: boolean) => void;
  className?: string;
}

type FeedbackState = "none" | "correct" | "incorrect" | "hint";

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
  }, [selectedStandardId]);

  useEffect(() => {
    loadNewProblem();
  }, [loadNewProblem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem || !userAnswer.trim() || submitting) return;

    setSubmitting(true);
    const isCorrect = checkAnswer(problem, userAnswer);

    // Record to Supabase
    await recordProblemAttempt(userId, problem, userAnswer.trim(), isCorrect);

    if (isCorrect) {
      setFeedback("correct");
      setStreak((prev) => prev + 1);
    } else {
      setFeedback("incorrect");
      setStreak(0);
    }

    setShowExplanation(true);
    setSubmitting(false);
    onProblemComplete?.(isCorrect);
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
        className={cn(
          "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6",
          className,
        )}
      >
        <p className="text-gray-500 dark:text-gray-400">Loading problem...</p>
      </div>
    );
  }

  const standard = STANDARDS.find((s) => s.id === problem.standardId);
  const domainColor = standard
    ? getDomainColor(standard.domainCode)
    : "bg-gray-500";

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6",
        className,
      )}
    >
      {/* Header with standard info and streak */}
      <div className="flex justify-between items-start mb-4">
        <div>
          {standard && (
            <span
              className={cn(
                "inline-block px-2 py-1 rounded text-xs font-medium text-white",
                domainColor,
              )}
            >
              {standard.code}: {standard.title}
            </span>
          )}
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1 text-orange-500">
            <span className="text-lg">🔥</span>
            <span className="font-bold">{streak}</span>
          </div>
        )}
      </div>

      {/* Problem */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Problem
        </h3>
        <p className="text-xl text-gray-800 dark:text-gray-200 leading-relaxed">
          {problem.question}
        </p>
      </div>

      {/* Answer Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Enter your answer..."
            className={cn(
              "flex-1 px-4 py-3 rounded-lg border-2 text-lg font-mono",
              "bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white",
              "focus:outline-none focus:ring-2 focus:ring-blue-500",
              feedback === "correct" &&
                "border-green-500 bg-green-50 dark:bg-green-900/20",
              feedback === "incorrect" &&
                "border-red-500 bg-red-50 dark:bg-red-900/20",
              feedback === "none" && "border-gray-300 dark:border-gray-600",
              feedback === "hint" &&
                "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
            )}
            disabled={feedback === "correct" || feedback === "incorrect"}
          />
          <button
            type="submit"
            disabled={
              !userAnswer.trim() ||
              feedback === "correct" ||
              feedback === "incorrect" ||
              submitting
            }
            className={cn(
              "px-6 py-3 rounded-lg font-semibold transition-colors",
              "bg-blue-600 text-white hover:bg-blue-700",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            {submitting ? "..." : "Check"}
          </button>
        </div>
      </form>

      {/* Hint Button */}
      {feedback === "none" && (
        <button
          onClick={handleShowHint}
          className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 hover:underline mb-4"
        >
          <Lightbulb size={18} />
          <span>Need a hint?</span>
        </button>
      )}

      {/* Hint Display */}
      {feedback === "hint" && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2">
            <Lightbulb className="text-yellow-600 mt-0.5" size={20} />
            <p className="text-yellow-800 dark:text-yellow-200">
              {problem.hint}
            </p>
          </div>
        </div>
      )}

      {/* Feedback */}
      {feedback === "correct" && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-300 font-semibold">
            <CheckCircle size={24} />
            <span>Correct! Great job!</span>
          </div>
        </div>
      )}

      {feedback === "incorrect" && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-semibold">
            <XCircle size={24} />
            <span>
              Not quite. The correct answer is: {problem.correctAnswer}
            </span>
          </div>
        </div>
      )}

      {/* Explanation */}
      {showExplanation && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Explanation
          </h4>
          <p className="text-blue-700 dark:text-blue-300">
            {problem.explanation}
          </p>
        </div>
      )}

      {/* Next Problem Button */}
      {(feedback === "correct" || feedback === "incorrect") && (
        <div className="flex gap-3">
          <button
            onClick={handleNextProblem}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors",
              "bg-green-600 text-white hover:bg-green-700",
            )}
          >
            <span>Next Problem</span>
            <ArrowRight size={20} />
          </button>
          <button
            onClick={loadNewProblem}
            className={cn(
              "flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors",
              "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600",
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
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4",
        className,
      )}
    >
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
        Practice by Standard
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectStandard(null)}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
            selectedStandardId === null
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600",
          )}
        >
          All Topics
        </button>
        {standards.map((standard) => {
          const domainColor = getDomainColor(standard.domainCode);
          return (
            <button
              key={standard.id}
              onClick={() => onSelectStandard(standard.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                selectedStandardId === standard.id
                  ? `${domainColor} text-white`
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600",
              )}
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
