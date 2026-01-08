"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  VOCABULARY,
  FORMULAS,
  VocabTerm,
  Formula,
  DOMAIN_NAMES,
} from "@/constants/vocabulary";
import { createClient } from "@/lib/supabase";
import { getLevelFromXP } from "@/lib/gamification";
import {
  Sparkles,
  Check,
  X,
  ArrowRight,
  Trophy,
  Zap,
  RotateCcw,
} from "lucide-react";

interface FlashCardGameProps {
  userId: string;
  className?: string;
  onXPEarned?: () => void;
}

type QuizMode = "vocab" | "formula" | "mixed";
type QuizState = "question" | "revealed" | "finished";

interface QuizQuestion {
  type: "vocab" | "formula";
  item: VocabTerm | Formula;
  question: string;
  answer: string;
}

const XP_PER_CORRECT = 5;
const QUESTIONS_PER_ROUND = 10;

export function FlashCardGame({
  userId,
  className,
  onXPEarned,
}: FlashCardGameProps) {
  const [mode, setMode] = useState<QuizMode>("mixed");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizState, setQuizState] = useState<QuizState>("question");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const generateQuestions = useCallback(
    (quizMode: QuizMode): QuizQuestion[] => {
      const allQuestions: QuizQuestion[] = [];

      // Add vocab questions
      if (quizMode === "vocab" || quizMode === "mixed") {
        VOCABULARY.forEach((v) => {
          allQuestions.push({
            type: "vocab",
            item: v,
            question: `What does "${v.term}" mean?`,
            answer: v.definition,
          });
        });
      }

      // Add formula questions
      if (quizMode === "formula" || quizMode === "mixed") {
        FORMULAS.forEach((f) => {
          allQuestions.push({
            type: "formula",
            item: f,
            question: `What is the formula for ${f.name}?`,
            answer: f.formula,
          });
        });
      }

      // Shuffle and take QUESTIONS_PER_ROUND
      return allQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, QUESTIONS_PER_ROUND);
    },
    [],
  );

  const startGame = (selectedMode: QuizMode) => {
    setMode(selectedMode);
    setQuestions(generateQuestions(selectedMode));
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setXpEarned(0);
    setQuizState("question");
    setShowAnswer(false);
    setGameStarted(true);
  };

  const handleReveal = () => {
    setShowAnswer(true);
  };

  const handleAnswer = async (correct: boolean) => {
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      setXpEarned((x) => x + XP_PER_CORRECT);

      // Award XP in database
      const supabase = createClient();
      const { data: stats } = await supabase
        .from("user_stats")
        .select("xp")
        .eq("user_id", userId)
        .single();

      if (stats) {
        await supabase
          .from("user_stats")
          .update({ xp: stats.xp + XP_PER_CORRECT })
          .eq("user_id", userId);

        // Notify parent to refresh UI
        onXPEarned?.();
      }
    } else {
      setStreak(0);
    }

    // Move to next question or finish
    if (currentIndex + 1 >= questions.length) {
      setQuizState("finished");
    } else {
      setCurrentIndex((i) => i + 1);
      setShowAnswer(false);
      setQuizState("question");
    }
  };

  const currentQuestion = questions[currentIndex];

  // Start screen
  if (!gameStarted) {
    return (
      <div
        className={cn("neon-card rounded-xl p-6 neon-border-yellow", className)}
      >
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎮</div>
          <h2 className="text-2xl font-bold neon-text-yellow">
            Flash Card Quiz
          </h2>
          <p className="text-gray-400 mt-2">
            Test your knowledge and earn Catnip! 🐱
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-center text-gray-300 mb-4">Choose a mode:</p>

          <button
            onClick={() => startGame("vocab")}
            className="w-full py-4 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-semibold hover:bg-cyan-500/30 transition-colors"
          >
            📚 Vocabulary Only
            <span className="block text-sm font-normal text-cyan-400/70">
              {VOCABULARY.length} terms
            </span>
          </button>

          <button
            onClick={() => startGame("formula")}
            className="w-full py-4 rounded-lg bg-fuchsia-500/20 border border-fuchsia-500/50 text-fuchsia-300 font-semibold hover:bg-fuchsia-500/30 transition-colors"
          >
            🧮 Formulas Only
            <span className="block text-sm font-normal text-fuchsia-400/70">
              {FORMULAS.length} formulas
            </span>
          </button>

          <button
            onClick={() => startGame("mixed")}
            className="w-full py-4 rounded-lg bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 border border-yellow-500/50 text-yellow-300 font-semibold hover:brightness-110 transition-all"
          >
            ⚡ Mixed Challenge
            <span className="block text-sm font-normal text-yellow-400/70">
              Vocab + Formulas
            </span>
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          +{XP_PER_CORRECT} Catnip for each correct answer!
        </p>
      </div>
    );
  }

  // Finished screen
  if (quizState === "finished") {
    const percentage = Math.round((score / questions.length) * 100);
    const message =
      percentage >= 90
        ? "Purr-fect! You're a math genius! 🐱👑"
        : percentage >= 70
          ? "Meow-velous work! Keep it up! 🐱🔥"
          : percentage >= 50
            ? "Good effort! Practice makes purr-fect! 🐱💪"
            : "Don't give up! Every cat learns at their own pace! 🐱❤️";

    return (
      <div
        className={cn("neon-card rounded-xl p-6 neon-border-yellow", className)}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">{percentage >= 70 ? "🏆" : "📚"}</div>
          <h2 className="text-2xl font-bold neon-text-yellow mb-2">
            Quiz Complete!
          </h2>
          <p className="text-gray-300 mb-6">{message}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-cyan-500/20 rounded-lg p-4 border border-cyan-500/30">
              <div className="text-3xl font-bold text-cyan-300">
                {score}/{questions.length}
              </div>
              <div className="text-sm text-cyan-400">Correct</div>
            </div>
            <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
              <div className="text-3xl font-bold text-green-300 flex items-center justify-center gap-1">
                +{xpEarned}
                <Sparkles size={20} />
              </div>
              <div className="text-sm text-green-400">Catnip Earned</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => startGame(mode)}
              className="flex-1 py-3 rounded-lg bg-gradient-to-r from-fuchsia-600 to-cyan-600 text-white font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Play Again
            </button>
            <button
              onClick={() => setGameStarted(false)}
              className="px-4 py-3 rounded-lg bg-gray-700/50 text-gray-300 font-semibold hover:bg-gray-700 transition-colors"
            >
              Change Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Question screen
  const item = currentQuestion.item;
  const domain = item.domain;
  const domainColors: Record<string, string> = {
    RP: "text-cyan-400",
    NS: "text-green-400",
    EE: "text-fuchsia-400",
    G: "text-orange-400",
    SP: "text-pink-400",
  };

  return (
    <div
      className={cn("neon-card rounded-xl p-6 neon-border-yellow", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={cn("text-sm font-medium", domainColors[domain])}>
            {DOMAIN_NAMES[domain]}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {streak >= 3 && (
            <div className="flex items-center gap-1 text-orange-400">
              <Zap size={16} />
              <span className="font-bold">{streak}🔥</span>
            </div>
          )}
          <div className="text-gray-400 text-sm">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-800 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="text-center mb-6">
        <p className="text-lg text-gray-300 mb-2">
          {currentQuestion.type === "vocab" ? "📚 Vocabulary" : "🧮 Formula"}
        </p>
        <h3 className="text-xl font-bold text-white">
          {currentQuestion.question}
        </h3>
      </div>

      {/* Answer area */}
      <div className="min-h-[120px] flex items-center justify-center mb-6">
        {!showAnswer ? (
          <button
            onClick={handleReveal}
            className="px-8 py-4 rounded-lg bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 font-semibold hover:bg-yellow-500/30 transition-colors"
          >
            Tap to reveal answer 🐱
          </button>
        ) : (
          <div className="w-full bg-black/30 rounded-lg p-4 border border-gray-700">
            <p className="text-center text-xl font-medium text-white">
              {currentQuestion.answer}
            </p>
            {"example" in item && item.example && (
              <p className="text-center text-sm text-gray-400 mt-2">
                Example: {item.example}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Answer buttons */}
      {showAnswer && (
        <div className="flex gap-3">
          <button
            onClick={() => handleAnswer(false)}
            className="flex-1 py-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 font-semibold hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
          >
            <X size={18} />I didn't know
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="flex-1 py-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-300 font-semibold hover:bg-green-500/30 transition-colors flex items-center justify-center gap-2"
          >
            <Check size={18} />I knew it!
          </button>
        </div>
      )}

      {/* Score */}
      <div className="mt-4 text-center text-sm text-gray-500">
        Score: {score} correct • +{xpEarned} Catnip earned 🌿
      </div>
    </div>
  );
}
