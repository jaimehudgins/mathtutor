"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { getRandomCat, WELCOME_CATS, THINKING_CATS } from "@/lib/cats";
import {
  Camera,
  Upload,
  Send,
  X,
  Image as ImageIcon,
  RefreshCw,
  Sparkles,
} from "lucide-react";

interface Message {
  id: string;
  role: "student" | "tutor";
  content: string;
  image?: string;
  catGif?: string;
  timestamp: Date;
}

interface HomeworkHelperProps {
  className?: string;
}

export function HomeworkHelper({ className }: HomeworkHelperProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "tutor",
      content:
        "Hi there! 🐱 I'm your homework helper cat! You can:\n\n• Take a photo of your homework problem\n• Upload an image from your device\n• Type out the problem\n\nI'll help you understand and solve it step by step! Meow!",
      catGif: getRandomCat(WELCOME_CATS),
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingCat, setThinkingCat] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image is too large. Please use an image under 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim() && !selectedImage) return;
    if (isLoading) return;

    // Add student message
    const studentMessage: Message = {
      id: Date.now().toString(),
      role: "student",
      content: inputText.trim() || "Can you help me with this problem?",
      image: selectedImage || undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, studentMessage]);
    setInputText("");
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    setIsLoading(true);
    setThinkingCat(getRandomCat(THINKING_CATS));

    setTimeout(scrollToBottom, 100);

    try {
      // Strip images from message history to avoid sending large base64 data
      const historyWithoutImages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch("/api/analyze-homework", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: studentMessage.image,
          text: studentMessage.content,
          messageHistory: historyWithoutImages,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const tutorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "tutor",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, tutorMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorText =
        error instanceof Error ? error.message : "Unknown error";
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "tutor",
        content: `Meow! 😿 I had trouble with that: ${errorText}. Could you try again or describe the problem differently?`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setThinkingCat(null);
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleNewConversation = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: "tutor",
        content:
          "Purr-fect! 🐱 Ready for a new problem! Share your homework and I'll help you work through it step by step!",
        catGif: getRandomCat(WELCOME_CATS),
        timestamp: new Date(),
      },
    ]);
    setInputText("");
    setSelectedImage(null);
  };

  return (
    <div
      className={cn(
        "neon-card rounded-xl flex flex-col neon-border-purple",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-fuchsia-500/30">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center text-xl neon-glow-purple">
            🐱
          </div>
          <div>
            <h3 className="font-semibold neon-text-pink flex items-center gap-1">
              Homework Helper Cat
              <Sparkles size={14} className="text-yellow-400" />
            </h3>
            <p className="text-xs text-fuchsia-400/60">
              Photo or type your problem
            </p>
          </div>
        </div>
        <button
          onClick={handleNewConversation}
          className="p-2 text-fuchsia-400 hover:text-fuchsia-300 transition-colors neon-button"
          title="New conversation"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[450px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-2",
              msg.role === "student" ? "flex-row-reverse" : "flex-row",
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-lg px-4 py-2",
                msg.role === "student"
                  ? "bg-fuchsia-500/20 border border-fuchsia-500/50 text-fuchsia-100"
                  : "bg-cyan-500/20 border border-cyan-500/50 text-cyan-100",
              )}
            >
              {msg.catGif && (
                <img
                  src={msg.catGif}
                  alt="Cat helper"
                  className="max-w-full rounded-lg mb-2 max-h-32 object-contain"
                  style={{ boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)" }}
                />
              )}
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Homework"
                  className="max-w-full rounded-lg mb-2 max-h-48 object-contain"
                  style={{ boxShadow: "0 0 10px rgba(255, 0, 255, 0.3)" }}
                />
              )}
              <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col items-start gap-2">
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3">
              {thinkingCat && (
                <img
                  src={thinkingCat}
                  alt="Thinking cat"
                  className="max-h-24 rounded-lg mb-2"
                  style={{ boxShadow: "0 0 15px rgba(255, 255, 0, 0.3)" }}
                />
              )}
              <p className="text-sm neon-text-yellow">
                🐱 *thinking paws* Analyzing your problem...
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      {selectedImage && (
        <div className="px-4 py-2 border-t border-fuchsia-500/30">
          <div className="relative inline-block">
            <img
              src={selectedImage}
              alt="Selected"
              className="max-h-24 rounded-lg"
              style={{ boxShadow: "0 0 10px rgba(0, 255, 255, 0.5)" }}
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 neon-button"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-fuchsia-500/30"
      >
        <div className="flex gap-2 mb-3">
          {/* Camera button (mobile) */}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageSelect}
            ref={cameraInputRef}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className={cn(
              "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all",
              "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/50",
              "hover:bg-fuchsia-500/30 neon-button",
            )}
          >
            <Camera size={18} />
            <span className="hidden sm:inline">Camera 📸</span>
          </button>

          {/* Upload button */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all",
              "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50",
              "hover:bg-cyan-500/30 neon-button",
            )}
          >
            <Upload size={18} />
            <span className="hidden sm:inline">Upload 🐱</span>
          </button>

          {selectedImage && (
            <div className="flex items-center gap-1 neon-text-green text-sm">
              <ImageIcon size={16} />
              <span>Image ready! 🐱</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your problem or question... 🐱"
            className={cn(
              "flex-1 px-4 py-2 rounded-lg border",
              "bg-black/30 text-white placeholder-gray-500",
              "border-fuchsia-500/50",
              "focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400",
            )}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={(!inputText.trim() && !selectedImage) || isLoading}
            className={cn(
              "px-4 py-2 rounded-lg transition-all",
              "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white",
              "hover:from-fuchsia-500 hover:to-purple-500",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "neon-button",
            )}
            style={{ boxShadow: "0 0 15px rgba(191, 0, 255, 0.5)" }}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
