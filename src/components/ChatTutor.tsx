"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  ChatMessage,
  getChatHistory,
  addChatMessage,
  clearChatHistory,
} from "@/lib/storage";
import {
  detectStandards,
  STANDARDS,
  getDomainColor,
} from "@/constants/standards";
import { generateProblem } from "@/lib/problems";
import { Send, Trash2, Bot, User, Sparkles } from "lucide-react";
import { getWelcomeCat, getThinkingCat } from "@/lib/cats";

interface ChatTutorProps {
  className?: string;
  onSuggestPractice?: (standardId: string) => void;
}

// Simple tutor response logic
function generateTutorResponse(studentMessage: string): {
  response: string;
  relatedStandards: string[];
} {
  const lowerMessage = studentMessage.toLowerCase();
  const detectedStandards = detectStandards(studentMessage);
  const relatedStandardIds = detectedStandards.slice(0, 2).map((s) => s.id);

  // Check for greetings
  if (/^(hi|hello|hey|good morning|good afternoon)\b/i.test(lowerMessage)) {
    return {
      response:
        "Hi there! I'm your 7th grade math tutor. What would you like to work on today? You can ask me about any math topic, or I can give you a practice problem!",
      relatedStandards: [],
    };
  }

  // Check for help requests
  if (/help|stuck|don't understand|confused|explain/i.test(lowerMessage)) {
    if (detectedStandards.length > 0) {
      const standard = detectedStandards[0];
      return {
        response: `I'd be happy to help with ${standard.title}! ${standard.description}\n\nHere's a tip: ${getConceptTip(standard.id)}\n\nWould you like me to give you a practice problem to work through?`,
        relatedStandards: relatedStandardIds,
      };
    }
    return {
      response:
        "I'm here to help! What specific topic or problem are you struggling with? You can ask about:\n• Ratios and proportions\n• Integers and rational numbers\n• Equations and expressions\n• Geometry (circles, angles, area)\n• Probability",
      relatedStandards: [],
    };
  }

  // Check for practice requests
  if (/practice|problem|quiz|test me|give me/i.test(lowerMessage)) {
    let standardId =
      detectedStandards.length > 0 ? detectedStandards[0].id : null;

    if (!standardId) {
      // Pick a random standard
      const availableStandards = [
        "7-rp-1",
        "7-ns-1",
        "7-ee-4",
        "7-g-4",
        "7-sp-5",
      ];
      standardId =
        availableStandards[
          Math.floor(Math.random() * availableStandards.length)
        ];
    }

    const problem = generateProblem(standardId);
    if (problem) {
      return {
        response: `Here's a problem for you:\n\n**${problem.question}**\n\nTake your time and let me know your answer! If you need a hint, just ask.`,
        relatedStandards: [standardId],
      };
    }
  }

  // Check for specific topics
  if (/percent|discount|tax|sale|tip/i.test(lowerMessage)) {
    return {
      response:
        "Percent problems are very useful in real life! Remember:\n\n• To find a percent of a number: multiply by the percent as a decimal\n• For discounts: Original - (Original × discount rate)\n• For tax/tip: Original + (Original × rate)\n\nWant me to give you a percent problem to practice?",
      relatedStandards: ["7-rp-3"],
    };
  }

  if (/circle|radius|diameter|circumference|area.*circle/i.test(lowerMessage)) {
    return {
      response:
        "Circles are fun! Here are the key formulas:\n\n• **Circumference** = 2πr = πd\n• **Area** = πr²\n\nRemember: The radius is half the diameter, and π ≈ 3.14.\n\nWant to try a circle problem?",
      relatedStandards: ["7-g-4"],
    };
  }

  if (/negative|integer|add.*subtract|positive.*negative/i.test(lowerMessage)) {
    return {
      response:
        "Working with negative numbers follows some simple rules:\n\n**Addition:**\n• Same signs: Add and keep the sign\n• Different signs: Subtract and keep the sign of the larger absolute value\n\n**Subtraction:** Change to addition of the opposite!\n\n**Multiplication/Division:**\n• Same signs → Positive\n• Different signs → Negative\n\nWould you like some practice problems?",
      relatedStandards: ["7-ns-1", "7-ns-2"],
    };
  }

  if (/equation|solve for|variable/i.test(lowerMessage)) {
    return {
      response:
        "To solve equations, remember to do the same thing to both sides to keep it balanced!\n\n**Steps:**\n1. Simplify each side if needed\n2. Get variables on one side, constants on the other\n3. Use inverse operations to isolate the variable\n\nWant to practice solving some equations?",
      relatedStandards: ["7-ee-4"],
    };
  }

  if (/probability|chance|likely|odds/i.test(lowerMessage)) {
    return {
      response:
        "Probability tells us how likely something is to happen!\n\n• Probability = Favorable outcomes ÷ Total possible outcomes\n• Always between 0 (impossible) and 1 (certain)\n• Can be written as fractions, decimals, or percents\n\nFor compound events (two things happening), multiply the individual probabilities!\n\nWant a probability problem?",
      relatedStandards: ["7-sp-5", "7-sp-8"],
    };
  }

  // If we detected a standard, provide info about it
  if (detectedStandards.length > 0) {
    const standard = detectedStandards[0];
    return {
      response: `That relates to ${standard.code}: ${standard.title}!\n\n${standard.description}\n\nWould you like me to explain this more or give you a practice problem?`,
      relatedStandards: relatedStandardIds,
    };
  }

  // Default response
  return {
    response:
      "I'm your math tutor! You can:\n\n• Ask me to explain any 7th grade math topic\n• Say \"give me a problem\" for practice\n• Ask for help with specific concepts\n• Type a math question and I'll do my best to help!\n\nWhat would you like to work on?",
    relatedStandards: [],
  };
}

function getConceptTip(standardId: string): string {
  const tips: Record<string, string> = {
    "7-rp-1":
      'For unit rates, divide to find "per one" - like miles per hour or cost per item.',
    "7-rp-2":
      "In proportional relationships, y/x is always the same constant value (k).",
    "7-rp-3":
      "Convert percentages to decimals by dividing by 100 before multiplying.",
    "7-ns-1":
      "Think of the number line! Moving right is adding, moving left is subtracting.",
    "7-ns-2":
      "For multiplication/division: same signs = positive, different signs = negative.",
    "7-ee-1": "Combine terms with the same variable - 3x + 2x = 5x!",
    "7-ee-4":
      "Whatever you do to one side of an equation, do to the other side too.",
    "7-g-4": "Remember π ≈ 3.14. Area uses r², circumference uses 2r.",
    "7-g-5": "Complementary = 90°, Supplementary = 180°.",
    "7-sp-5": "Probability is always between 0 and 1.",
  };
  return tips[standardId] || "Break the problem into smaller steps!";
}

// Neon domain colors for standards badges
function getNeonDomainColor(domainCode: string): string {
  const colors: Record<string, string> = {
    RP: "bg-fuchsia-600 neon-glow-pink",
    NS: "bg-cyan-500 neon-glow-cyan",
    EE: "bg-green-500 neon-glow-green",
    G: "bg-yellow-500 neon-glow-yellow",
    SP: "bg-orange-500 neon-glow-orange",
  };
  return colors[domainCode] || "bg-purple-500 neon-glow-purple";
}

export function ChatTutor({ className, onSuggestPractice }: ChatTutorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [welcomeCat] = useState(() => getWelcomeCat());
  const [thinkingCat] = useState(() => getThinkingCat());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const history = getChatHistory();
    if (history.length === 0) {
      // Add welcome message
      const welcomeMsg = addChatMessage({
        role: "tutor",
        content:
          'Hi! I\'m your math tutor for 7th grade Mississippi standards. Ask me anything about math, or say "give me a problem" to practice!',
      });
      setMessages([welcomeMsg]);
    } else {
      setMessages(history);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add student message
    const studentMsg = addChatMessage({
      role: "student",
      content: input.trim(),
    });
    setMessages((prev) => [...prev, studentMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate thinking delay
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 500),
    );

    // Generate tutor response
    const { response, relatedStandards } = generateTutorResponse(input);
    const tutorMsg = addChatMessage({
      role: "tutor",
      content: response,
      relatedStandards,
    });
    setMessages((prev) => [...prev, tutorMsg]);
    setIsTyping(false);

    // If response suggests a standard, notify parent
    if (relatedStandards.length > 0 && onSuggestPractice) {
      onSuggestPractice(relatedStandards[0]);
    }
  };

  const handleClearChat = () => {
    clearChatHistory();
    const welcomeMsg = addChatMessage({
      role: "tutor",
      content: "Chat cleared! What would you like to work on?",
    });
    setMessages([welcomeMsg]);
  };

  return (
    <div
      className={cn(
        "neon-card rounded-xl flex flex-col overflow-hidden",
        "border-2 border-blue-500/50",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-blue-500/30 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center neon-glow-cyan">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold neon-text-cyan flex items-center gap-2">
              Math Tutor
              <Sparkles size={14} className="text-yellow-400 animate-pulse" />
            </h3>
            <p className="text-xs text-blue-300">7th Grade Helper</p>
          </div>
        </div>
        <button
          onClick={handleClearChat}
          className="p-2 text-gray-400 hover:text-red-400 hover:neon-glow-pink transition-all rounded-lg hover:bg-red-500/10"
          title="Clear chat"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Welcome Cat */}
      {messages.length <= 1 && (
        <div className="flex justify-center py-4 bg-gradient-to-b from-blue-900/20 to-transparent">
          <img
            src={welcomeCat}
            alt="Welcome cat"
            className="h-24 rounded-lg neon-glow-cyan"
          />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px] bg-gradient-to-b from-transparent to-blue-900/10">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && (
          <div className="flex items-center gap-3 text-cyan-400">
            <img
              src={thinkingCat}
              alt="Thinking cat"
              className="h-10 rounded-lg"
            />
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce neon-glow-cyan"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce neon-glow-pink"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 bg-green-400 rounded-full animate-bounce neon-glow-green"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
              <span className="text-sm neon-text-cyan">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-blue-500/30 bg-gradient-to-r from-blue-900/30 to-purple-900/30"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about math..."
            className={cn(
              "flex-1 px-4 py-3 rounded-lg border-2",
              "bg-gray-900/80 text-white placeholder-gray-500",
              "border-blue-500/50",
              "focus:outline-none focus:border-cyan-400 focus:neon-glow-cyan",
              "transition-all",
            )}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className={cn(
              "px-5 py-3 rounded-lg transition-all font-bold",
              "bg-gradient-to-r from-blue-600 to-cyan-500 text-white",
              "hover:from-blue-500 hover:to-cyan-400 hover:neon-glow-cyan",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
            )}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isStudent = message.role === "student";

  return (
    <div
      className={cn("flex gap-3", isStudent ? "flex-row-reverse" : "flex-row")}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isStudent
            ? "bg-gradient-to-br from-green-500 to-emerald-400 neon-glow-green"
            : "bg-gradient-to-br from-blue-500 to-cyan-400 neon-glow-cyan",
        )}
      >
        {isStudent ? (
          <User size={16} className="text-white" />
        ) : (
          <Bot size={16} className="text-white" />
        )}
      </div>
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-3 border",
          isStudent
            ? "bg-green-900/40 border-green-500/50 text-green-100"
            : "bg-blue-900/40 border-blue-500/50 text-blue-100",
        )}
      >
        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        {message.relatedStandards && message.relatedStandards.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {message.relatedStandards.map((stdId) => {
              const standard = STANDARDS.find((s) => s.id === stdId);
              if (!standard) return null;
              return (
                <span
                  key={stdId}
                  className={cn(
                    "inline-block px-2 py-0.5 rounded text-xs text-white font-bold",
                    getNeonDomainColor(standard.domainCode),
                  )}
                >
                  {standard.code}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
