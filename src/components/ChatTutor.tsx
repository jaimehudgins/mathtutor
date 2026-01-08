'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ChatMessage, getChatHistory, addChatMessage, clearChatHistory } from '@/lib/storage';
import { detectStandards, STANDARDS, getDomainColor } from '@/constants/standards';
import { generateProblem } from '@/lib/problems';
import { Send, Trash2, Bot, User } from 'lucide-react';

interface ChatTutorProps {
  className?: string;
  onSuggestPractice?: (standardId: string) => void;
}

// Simple tutor response logic
function generateTutorResponse(studentMessage: string): { response: string; relatedStandards: string[] } {
  const lowerMessage = studentMessage.toLowerCase();
  const detectedStandards = detectStandards(studentMessage);
  const relatedStandardIds = detectedStandards.slice(0, 2).map(s => s.id);

  // Check for greetings
  if (/^(hi|hello|hey|good morning|good afternoon)\b/i.test(lowerMessage)) {
    return {
      response: "Hi there! I'm your 7th grade math tutor. What would you like to work on today? You can ask me about any math topic, or I can give you a practice problem!",
      relatedStandards: []
    };
  }

  // Check for help requests
  if (/help|stuck|don't understand|confused|explain/i.test(lowerMessage)) {
    if (detectedStandards.length > 0) {
      const standard = detectedStandards[0];
      return {
        response: `I'd be happy to help with ${standard.title}! ${standard.description}\n\nHere's a tip: ${getConceptTip(standard.id)}\n\nWould you like me to give you a practice problem to work through?`,
        relatedStandards: relatedStandardIds
      };
    }
    return {
      response: "I'm here to help! What specific topic or problem are you struggling with? You can ask about:\n• Ratios and proportions\n• Integers and rational numbers\n• Equations and expressions\n• Geometry (circles, angles, area)\n• Probability",
      relatedStandards: []
    };
  }

  // Check for practice requests
  if (/practice|problem|quiz|test me|give me/i.test(lowerMessage)) {
    let standardId = detectedStandards.length > 0 ? detectedStandards[0].id : null;

    if (!standardId) {
      // Pick a random standard
      const availableStandards = ['7-rp-1', '7-ns-1', '7-ee-4', '7-g-4', '7-sp-5'];
      standardId = availableStandards[Math.floor(Math.random() * availableStandards.length)];
    }

    const problem = generateProblem(standardId);
    if (problem) {
      return {
        response: `Here's a problem for you:\n\n**${problem.question}**\n\nTake your time and let me know your answer! If you need a hint, just ask.`,
        relatedStandards: [standardId]
      };
    }
  }

  // Check for specific topics
  if (/percent|discount|tax|sale|tip/i.test(lowerMessage)) {
    return {
      response: "Percent problems are very useful in real life! Remember:\n\n• To find a percent of a number: multiply by the percent as a decimal\n• For discounts: Original - (Original × discount rate)\n• For tax/tip: Original + (Original × rate)\n\nWant me to give you a percent problem to practice?",
      relatedStandards: ['7-rp-3']
    };
  }

  if (/circle|radius|diameter|circumference|area.*circle/i.test(lowerMessage)) {
    return {
      response: "Circles are fun! Here are the key formulas:\n\n• **Circumference** = 2πr = πd\n• **Area** = πr²\n\nRemember: The radius is half the diameter, and π ≈ 3.14.\n\nWant to try a circle problem?",
      relatedStandards: ['7-g-4']
    };
  }

  if (/negative|integer|add.*subtract|positive.*negative/i.test(lowerMessage)) {
    return {
      response: "Working with negative numbers follows some simple rules:\n\n**Addition:**\n• Same signs: Add and keep the sign\n• Different signs: Subtract and keep the sign of the larger absolute value\n\n**Subtraction:** Change to addition of the opposite!\n\n**Multiplication/Division:**\n• Same signs → Positive\n• Different signs → Negative\n\nWould you like some practice problems?",
      relatedStandards: ['7-ns-1', '7-ns-2']
    };
  }

  if (/equation|solve for|variable/i.test(lowerMessage)) {
    return {
      response: "To solve equations, remember to do the same thing to both sides to keep it balanced!\n\n**Steps:**\n1. Simplify each side if needed\n2. Get variables on one side, constants on the other\n3. Use inverse operations to isolate the variable\n\nWant to practice solving some equations?",
      relatedStandards: ['7-ee-4']
    };
  }

  if (/probability|chance|likely|odds/i.test(lowerMessage)) {
    return {
      response: "Probability tells us how likely something is to happen!\n\n• Probability = Favorable outcomes ÷ Total possible outcomes\n• Always between 0 (impossible) and 1 (certain)\n• Can be written as fractions, decimals, or percents\n\nFor compound events (two things happening), multiply the individual probabilities!\n\nWant a probability problem?",
      relatedStandards: ['7-sp-5', '7-sp-8']
    };
  }

  // If we detected a standard, provide info about it
  if (detectedStandards.length > 0) {
    const standard = detectedStandards[0];
    return {
      response: `That relates to ${standard.code}: ${standard.title}!\n\n${standard.description}\n\nWould you like me to explain this more or give you a practice problem?`,
      relatedStandards: relatedStandardIds
    };
  }

  // Default response
  return {
    response: "I'm your math tutor! You can:\n\n• Ask me to explain any 7th grade math topic\n• Say \"give me a problem\" for practice\n• Ask for help with specific concepts\n• Type a math question and I'll do my best to help!\n\nWhat would you like to work on?",
    relatedStandards: []
  };
}

function getConceptTip(standardId: string): string {
  const tips: Record<string, string> = {
    '7-rp-1': 'For unit rates, divide to find \"per one\" - like miles per hour or cost per item.',
    '7-rp-2': 'In proportional relationships, y/x is always the same constant value (k).',
    '7-rp-3': 'Convert percentages to decimals by dividing by 100 before multiplying.',
    '7-ns-1': 'Think of the number line! Moving right is adding, moving left is subtracting.',
    '7-ns-2': 'For multiplication/division: same signs = positive, different signs = negative.',
    '7-ee-1': 'Combine terms with the same variable - 3x + 2x = 5x!',
    '7-ee-4': 'Whatever you do to one side of an equation, do to the other side too.',
    '7-g-4': 'Remember π ≈ 3.14. Area uses r², circumference uses 2r.',
    '7-g-5': 'Complementary = 90°, Supplementary = 180°.',
    '7-sp-5': 'Probability is always between 0 and 1.',
  };
  return tips[standardId] || 'Break the problem into smaller steps!';
}

export function ChatTutor({ className, onSuggestPractice }: ChatTutorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const history = getChatHistory();
    if (history.length === 0) {
      // Add welcome message
      const welcomeMsg = addChatMessage({
        role: 'tutor',
        content: "Hi! I'm your math tutor for 7th grade Mississippi standards. Ask me anything about math, or say \"give me a problem\" to practice!",
      });
      setMessages([welcomeMsg]);
    } else {
      setMessages(history);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add student message
    const studentMsg = addChatMessage({
      role: 'student',
      content: input.trim(),
    });
    setMessages(prev => [...prev, studentMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    // Generate tutor response
    const { response, relatedStandards } = generateTutorResponse(input);
    const tutorMsg = addChatMessage({
      role: 'tutor',
      content: response,
      relatedStandards,
    });
    setMessages(prev => [...prev, tutorMsg]);
    setIsTyping(false);

    // If response suggests a standard, notify parent
    if (relatedStandards.length > 0 && onSuggestPractice) {
      onSuggestPractice(relatedStandards[0]);
    }
  };

  const handleClearChat = () => {
    clearChatHistory();
    const welcomeMsg = addChatMessage({
      role: 'tutor',
      content: "Chat cleared! What would you like to work on?",
    });
    setMessages([welcomeMsg]);
  };

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Math Tutor</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">7th Grade Helper</p>
          </div>
        </div>
        <button
          onClick={handleClearChat}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="Clear chat"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm">Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about math..."
            className={cn(
              'flex-1 px-4 py-2 rounded-lg border',
              'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white',
              'border-gray-300 dark:border-gray-600',
              'focus:outline-none focus:ring-2 focus:ring-blue-500'
            )}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className={cn(
              'px-4 py-2 rounded-lg transition-colors',
              'bg-blue-600 text-white hover:bg-blue-700',
              'disabled:opacity-50 disabled:cursor-not-allowed'
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
  const isStudent = message.role === 'student';

  return (
    <div className={cn('flex gap-2', isStudent ? 'flex-row-reverse' : 'flex-row')}>
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
        isStudent ? 'bg-green-600' : 'bg-blue-600'
      )}>
        {isStudent ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
      </div>
      <div className={cn(
        'max-w-[80%] rounded-lg px-4 py-2',
        isStudent
          ? 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
      )}>
        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        {message.relatedStandards && message.relatedStandards.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {message.relatedStandards.map(stdId => {
              const standard = STANDARDS.find(s => s.id === stdId);
              if (!standard) return null;
              return (
                <span
                  key={stdId}
                  className={cn(
                    'inline-block px-2 py-0.5 rounded text-xs text-white',
                    getDomainColor(standard.domainCode)
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
