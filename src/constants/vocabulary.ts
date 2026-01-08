// Vocabulary and Formulas for 7th Grade Mississippi Standards

export interface VocabTerm {
  id: string;
  term: string;
  definition: string;
  example?: string;
  domain: "RP" | "NS" | "EE" | "G" | "SP";
}

export interface Formula {
  id: string;
  name: string;
  formula: string;
  description: string;
  example?: string;
  domain: "RP" | "NS" | "EE" | "G" | "SP";
}

// =============================================================================
// VOCABULARY BY DOMAIN
// =============================================================================

export const VOCABULARY: VocabTerm[] = [
  // Ratios & Proportional Relationships (RP)
  {
    id: "rp-ratio",
    term: "Ratio",
    definition: "A comparison of two quantities using division",
    example: "3 cats to 5 dogs can be written as 3:5 or 3/5",
    domain: "RP",
  },
  {
    id: "rp-unit-rate",
    term: "Unit Rate",
    definition: "A rate with a denominator of 1",
    example: "60 miles per hour means 60 miles in 1 hour",
    domain: "RP",
  },
  {
    id: "rp-proportion",
    term: "Proportion",
    definition: "An equation stating that two ratios are equal",
    example: "2/3 = 4/6 is a proportion",
    domain: "RP",
  },
  {
    id: "rp-constant",
    term: "Constant of Proportionality",
    definition: "The constant value k in y = kx that relates two proportional quantities",
    example: "If y = 3x, then k = 3",
    domain: "RP",
  },
  {
    id: "rp-percent",
    term: "Percent",
    definition: "A ratio that compares a number to 100",
    example: "25% means 25 out of 100, or 0.25",
    domain: "RP",
  },
  {
    id: "rp-discount",
    term: "Discount",
    definition: "A reduction from the original price",
    example: "20% off a $50 item = $10 discount",
    domain: "RP",
  },
  {
    id: "rp-markup",
    term: "Markup",
    definition: "An increase added to the cost to get the selling price",
    example: "A store buys for $10 and marks up 50% to sell at $15",
    domain: "RP",
  },

  // The Number System (NS)
  {
    id: "ns-integer",
    term: "Integer",
    definition: "Whole numbers and their opposites (including zero)",
    example: "...-3, -2, -1, 0, 1, 2, 3...",
    domain: "NS",
  },
  {
    id: "ns-rational",
    term: "Rational Number",
    definition: "Any number that can be written as a fraction a/b where b is not zero",
    example: "0.5, -3, 2/3, and 0.333... are all rational",
    domain: "NS",
  },
  {
    id: "ns-absolute",
    term: "Absolute Value",
    definition: "The distance a number is from zero on the number line (always positive)",
    example: "|-5| = 5 and |5| = 5",
    domain: "NS",
  },
  {
    id: "ns-opposite",
    term: "Opposite",
    definition: "Two numbers that are the same distance from zero but on opposite sides",
    example: "The opposite of 7 is -7",
    domain: "NS",
  },
  {
    id: "ns-additive-inverse",
    term: "Additive Inverse",
    definition: "A number that when added to another gives zero",
    example: "5 + (-5) = 0, so -5 is the additive inverse of 5",
    domain: "NS",
  },

  // Expressions & Equations (EE)
  {
    id: "ee-variable",
    term: "Variable",
    definition: "A letter or symbol that represents an unknown value",
    example: "In 3x + 5 = 11, x is the variable",
    domain: "EE",
  },
  {
    id: "ee-coefficient",
    term: "Coefficient",
    definition: "The number multiplied by a variable",
    example: "In 7x, the coefficient is 7",
    domain: "EE",
  },
  {
    id: "ee-constant",
    term: "Constant",
    definition: "A term without a variable; a fixed value",
    example: "In 3x + 5, the constant is 5",
    domain: "EE",
  },
  {
    id: "ee-expression",
    term: "Expression",
    definition: "A mathematical phrase with numbers, variables, and operations (no equal sign)",
    example: "2x + 3y - 7 is an expression",
    domain: "EE",
  },
  {
    id: "ee-equation",
    term: "Equation",
    definition: "A mathematical sentence with an equal sign",
    example: "2x + 5 = 13 is an equation",
    domain: "EE",
  },
  {
    id: "ee-like-terms",
    term: "Like Terms",
    definition: "Terms with the same variable raised to the same power",
    example: "3x and 7x are like terms; 3x and 3y are not",
    domain: "EE",
  },
  {
    id: "ee-inequality",
    term: "Inequality",
    definition: "A mathematical sentence using <, >, ≤, or ≥",
    example: "x + 3 > 7 means x is greater than 4",
    domain: "EE",
  },

  // Geometry (G)
  {
    id: "g-radius",
    term: "Radius",
    definition: "The distance from the center of a circle to any point on the circle",
    example: "If the diameter is 10, the radius is 5",
    domain: "G",
  },
  {
    id: "g-diameter",
    term: "Diameter",
    definition: "The distance across a circle through its center (twice the radius)",
    example: "If the radius is 4, the diameter is 8",
    domain: "G",
  },
  {
    id: "g-circumference",
    term: "Circumference",
    definition: "The distance around a circle",
    example: "The circumference is the perimeter of a circle",
    domain: "G",
  },
  {
    id: "g-pi",
    term: "Pi (π)",
    definition: "The ratio of circumference to diameter; approximately 3.14",
    example: "π ≈ 3.14159...",
    domain: "G",
  },
  {
    id: "g-area",
    term: "Area",
    definition: "The amount of space inside a 2D shape, measured in square units",
    example: "A 3×4 rectangle has area = 12 square units",
    domain: "G",
  },
  {
    id: "g-volume",
    term: "Volume",
    definition: "The amount of space inside a 3D shape, measured in cubic units",
    example: "A 2×3×4 box has volume = 24 cubic units",
    domain: "G",
  },
  {
    id: "g-surface-area",
    term: "Surface Area",
    definition: "The total area of all faces of a 3D shape",
    example: "A cube with side 2 has surface area = 6 × 4 = 24 square units",
    domain: "G",
  },
  {
    id: "g-scale-factor",
    term: "Scale Factor",
    definition: "The ratio used to enlarge or reduce a figure",
    example: "A scale of 1 inch = 10 feet has scale factor 10",
    domain: "G",
  },

  // Statistics & Probability (SP)
  {
    id: "sp-probability",
    term: "Probability",
    definition: "A number from 0 to 1 showing how likely an event is to occur",
    example: "Flipping heads has probability 1/2 or 0.5",
    domain: "SP",
  },
  {
    id: "sp-sample",
    term: "Sample",
    definition: "A smaller group selected from a population to study",
    example: "Surveying 100 students to learn about all students",
    domain: "SP",
  },
  {
    id: "sp-population",
    term: "Population",
    definition: "The entire group you want to learn about",
    example: "All 7th graders in Mississippi",
    domain: "SP",
  },
  {
    id: "sp-random",
    term: "Random Sample",
    definition: "A sample where every member has an equal chance of being selected",
    example: "Drawing names from a hat",
    domain: "SP",
  },
  {
    id: "sp-outcome",
    term: "Outcome",
    definition: "A possible result of an experiment",
    example: "Rolling a 4 is one outcome of rolling a die",
    domain: "SP",
  },
  {
    id: "sp-event",
    term: "Event",
    definition: "One or more outcomes of an experiment",
    example: "Rolling an even number (2, 4, or 6) is an event",
    domain: "SP",
  },
];

// =============================================================================
// FORMULAS BY DOMAIN
// =============================================================================

export const FORMULAS: Formula[] = [
  // Ratios & Proportional Relationships (RP)
  {
    id: "f-unit-rate",
    name: "Unit Rate",
    formula: "Unit Rate = Total ÷ Number of Units",
    description: "Find how much per one unit",
    example: "150 miles in 3 hours → 150 ÷ 3 = 50 mph",
    domain: "RP",
  },
  {
    id: "f-proportion",
    name: "Proportion",
    formula: "a/b = c/d → a × d = b × c",
    description: "Cross multiply to solve proportions",
    example: "2/3 = x/12 → 2 × 12 = 3 × x → x = 8",
    domain: "RP",
  },
  {
    id: "f-percent",
    name: "Percent of a Number",
    formula: "Part = Percent × Whole",
    description: "Convert percent to decimal first",
    example: "25% of 80 = 0.25 × 80 = 20",
    domain: "RP",
  },
  {
    id: "f-percent-change",
    name: "Percent Change",
    formula: "% Change = (New - Original) / Original × 100",
    description: "Find percent increase or decrease",
    example: "Price went from $50 to $40: (40-50)/50 × 100 = -20%",
    domain: "RP",
  },
  {
    id: "f-discount",
    name: "Sale Price",
    formula: "Sale Price = Original - (Original × Discount%)",
    description: "Subtract the discount from original",
    example: "20% off $60: $60 - ($60 × 0.20) = $48",
    domain: "RP",
  },

  // The Number System (NS)
  {
    id: "f-add-integers",
    name: "Adding Integers",
    formula: "Same signs: Add, keep sign | Different signs: Subtract, keep larger's sign",
    description: "Rules for adding positive and negative numbers",
    example: "-5 + (-3) = -8 | -5 + 8 = 3",
    domain: "NS",
  },
  {
    id: "f-subtract-integers",
    name: "Subtracting Integers",
    formula: "a - b = a + (-b)",
    description: "Add the opposite",
    example: "5 - (-3) = 5 + 3 = 8",
    domain: "NS",
  },
  {
    id: "f-multiply-integers",
    name: "Multiplying Integers",
    formula: "Same signs → Positive | Different signs → Negative",
    description: "Rules for multiplying positive and negative",
    example: "(-4) × (-3) = 12 | (-4) × 3 = -12",
    domain: "NS",
  },
  {
    id: "f-divide-integers",
    name: "Dividing Integers",
    formula: "Same signs → Positive | Different signs → Negative",
    description: "Same rules as multiplication",
    example: "(-12) ÷ (-3) = 4 | (-12) ÷ 3 = -4",
    domain: "NS",
  },

  // Expressions & Equations (EE)
  {
    id: "f-distributive",
    name: "Distributive Property",
    formula: "a(b + c) = ab + ac",
    description: "Multiply the outside term by each inside term",
    example: "3(x + 4) = 3x + 12",
    domain: "EE",
  },
  {
    id: "f-combine-like",
    name: "Combining Like Terms",
    formula: "ax + bx = (a + b)x",
    description: "Add or subtract the coefficients",
    example: "5x + 3x = 8x",
    domain: "EE",
  },
  {
    id: "f-solve-equation",
    name: "Solving Equations",
    formula: "Do the same operation to both sides",
    description: "Isolate the variable step by step",
    example: "2x + 5 = 13 → 2x = 8 → x = 4",
    domain: "EE",
  },

  // Geometry (G)
  {
    id: "f-circle-area",
    name: "Area of a Circle",
    formula: "A = πr²",
    description: "Pi times radius squared",
    example: "r = 5: A = π × 5² = 25π ≈ 78.5",
    domain: "G",
  },
  {
    id: "f-circle-circumference",
    name: "Circumference of a Circle",
    formula: "C = 2πr or C = πd",
    description: "Two times pi times radius, or pi times diameter",
    example: "r = 5: C = 2 × π × 5 = 10π ≈ 31.4",
    domain: "G",
  },
  {
    id: "f-rectangle-area",
    name: "Area of a Rectangle",
    formula: "A = length × width",
    description: "Multiply length by width",
    example: "6 × 4 = 24 square units",
    domain: "G",
  },
  {
    id: "f-triangle-area",
    name: "Area of a Triangle",
    formula: "A = ½ × base × height",
    description: "Half of base times height",
    example: "base = 8, height = 6: A = ½ × 8 × 6 = 24",
    domain: "G",
  },
  {
    id: "f-prism-volume",
    name: "Volume of a Rectangular Prism",
    formula: "V = length × width × height",
    description: "Multiply all three dimensions",
    example: "3 × 4 × 5 = 60 cubic units",
    domain: "G",
  },
  {
    id: "f-scale-drawing",
    name: "Scale Drawing",
    formula: "Actual = Drawing × Scale Factor",
    description: "Multiply drawing measurement by scale",
    example: "2 inches at 1in = 5ft → 2 × 5 = 10 feet",
    domain: "G",
  },

  // Statistics & Probability (SP)
  {
    id: "f-probability",
    name: "Probability",
    formula: "P(event) = Favorable outcomes / Total outcomes",
    description: "Number of ways it can happen over total possibilities",
    example: "P(heads) = 1/2",
    domain: "SP",
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getVocabByDomain(domain: string): VocabTerm[] {
  return VOCABULARY.filter(v => v.domain === domain);
}

export function getFormulasByDomain(domain: string): Formula[] {
  return FORMULAS.filter(f => f.domain === domain);
}

export function getRandomVocab(count: number = 1): VocabTerm[] {
  const shuffled = [...VOCABULARY].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getRandomFormulas(count: number = 1): Formula[] {
  const shuffled = [...FORMULAS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export const DOMAIN_NAMES: Record<string, string> = {
  RP: "Ratios & Proportions",
  NS: "Number System",
  EE: "Expressions & Equations",
  G: "Geometry",
  SP: "Statistics & Probability",
};
