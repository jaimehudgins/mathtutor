"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  VOCABULARY,
  FORMULAS,
  DOMAIN_NAMES,
  VocabTerm,
  Formula,
} from "@/constants/vocabulary";
import { ChevronDown, ChevronUp, BookOpen, Calculator } from "lucide-react";

interface ReferenceCardProps {
  className?: string;
}

const DOMAINS = ["RP", "NS", "EE", "G", "SP"] as const;

const DOMAIN_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  RP: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400" },
  NS: { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400" },
  EE: { bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/30", text: "text-fuchsia-400" },
  G: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400" },
  SP: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400" },
};

export function ReferenceCard({ className }: ReferenceCardProps) {
  const [activeTab, setActiveTab] = useState<"vocab" | "formulas">("vocab");
  const [expandedDomain, setExpandedDomain] = useState<string | null>("RP");

  const toggleDomain = (domain: string) => {
    setExpandedDomain(expandedDomain === domain ? null : domain);
  };

  return (
    <div className={cn("neon-card rounded-xl p-4 neon-border-cyan", className)}>
      {/* Tab Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("vocab")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-all",
            activeTab === "vocab"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
              : "bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-800"
          )}
        >
          <BookOpen size={18} />
          Vocabulary
        </button>
        <button
          onClick={() => setActiveTab("formulas")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-all",
            activeTab === "formulas"
              ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/50"
              : "bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-800"
          )}
        >
          <Calculator size={18} />
          Formulas
        </button>
      </div>

      {/* Content */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {DOMAINS.map((domain) => {
          const colors = DOMAIN_COLORS[domain];
          const items = activeTab === "vocab"
            ? VOCABULARY.filter((v) => v.domain === domain)
            : FORMULAS.filter((f) => f.domain === domain);
          const isExpanded = expandedDomain === domain;

          return (
            <div key={domain} className={cn("rounded-lg border", colors.border)}>
              {/* Domain Header */}
              <button
                onClick={() => toggleDomain(domain)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-lg transition-colors",
                  colors.bg,
                  "hover:brightness-110"
                )}
              >
                <span className={cn("font-semibold", colors.text)}>
                  {DOMAIN_NAMES[domain]} ({items.length})
                </span>
                {isExpanded ? (
                  <ChevronUp className={colors.text} size={20} />
                ) : (
                  <ChevronDown className={colors.text} size={20} />
                )}
              </button>

              {/* Items */}
              {isExpanded && (
                <div className="p-3 pt-0 space-y-3">
                  {activeTab === "vocab"
                    ? (items as VocabTerm[]).map((item) => (
                        <VocabItem key={item.id} item={item} colors={colors} />
                      ))
                    : (items as Formula[]).map((item) => (
                        <FormulaItem key={item.id} item={item} colors={colors} />
                      ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VocabItem({
  item,
  colors,
}: {
  item: VocabTerm;
  colors: { bg: string; border: string; text: string };
}) {
  return (
    <div className="bg-black/20 rounded-lg p-3">
      <h4 className={cn("font-bold", colors.text)}>{item.term}</h4>
      <p className="text-gray-300 text-sm mt-1">{item.definition}</p>
      {item.example && (
        <p className="text-gray-500 text-xs mt-2 italic">
          Example: {item.example}
        </p>
      )}
    </div>
  );
}

function FormulaItem({
  item,
  colors,
}: {
  item: Formula;
  colors: { bg: string; border: string; text: string };
}) {
  return (
    <div className="bg-black/20 rounded-lg p-3">
      <h4 className={cn("font-bold", colors.text)}>{item.name}</h4>
      <p className="text-white font-mono text-lg mt-1 bg-black/30 px-2 py-1 rounded inline-block">
        {item.formula}
      </p>
      <p className="text-gray-300 text-sm mt-2">{item.description}</p>
      {item.example && (
        <p className="text-gray-500 text-xs mt-2 italic">
          Example: {item.example}
        </p>
      )}
    </div>
  );
}
