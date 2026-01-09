// Mississippi College and Career Readiness Standards (MCCRS) for 7th Grade Math
// Based on official MS standards JSON

export interface Standard {
  id: string;
  code: string;
  domain: string;
  domainCode: string;
  title: string;
  description: string;
  keywords: string[];
}

export interface Domain {
  code: string;
  name: string;
  color: string;
}

export const DOMAINS: Domain[] = [
  {
    code: "RP",
    name: "Ratios & Proportional Relationships",
    color: "bg-blue-500",
  },
  { code: "NS", name: "The Number System", color: "bg-green-500" },
  { code: "EE", name: "Expressions & Equations", color: "bg-purple-500" },
  { code: "G", name: "Geometry", color: "bg-orange-500" },
  { code: "SP", name: "Statistics & Probability", color: "bg-pink-500" },
];

export const STANDARDS: Standard[] = [
  // Ratios and Proportional Relationships (RP)
  {
    id: "7-rp-1",
    code: "7.RP.1",
    domain: "Ratios & Proportional Relationships",
    domainCode: "RP",
    title: "Compute Unit Rates",
    description: "Compute unit rates associated with ratios of fractions.",
    keywords: ["unit rate", "ratio", "fraction", "per", "each", "rate"],
  },
  {
    id: "7-rp-2",
    code: "7.RP.2",
    domain: "Ratios & Proportional Relationships",
    domainCode: "RP",
    title: "Proportional Relationships",
    description:
      "Recognize and represent proportional relationships between quantities.",
    keywords: [
      "proportional",
      "proportion",
      "constant",
      "equivalent ratios",
      "k",
    ],
  },
  {
    id: "7-rp-3",
    code: "7.RP.3",
    domain: "Ratios & Proportional Relationships",
    domainCode: "RP",
    title: "Multistep Ratio & Percent Problems",
    description:
      "Use proportional relationships to solve multistep ratio and percent problems.",
    keywords: [
      "percent",
      "discount",
      "tax",
      "tip",
      "markup",
      "interest",
      "sale",
    ],
  },

  // The Number System (NS)
  {
    id: "7-ns-1",
    code: "7.NS.1",
    domain: "The Number System",
    domainCode: "NS",
    title: "Add & Subtract Rational Numbers",
    description:
      "Apply and extend previous understandings of addition and subtraction to add and subtract rational numbers.",
    keywords: [
      "add",
      "subtract",
      "negative",
      "positive",
      "integer",
      "rational",
      "number line",
    ],
  },
  {
    id: "7-ns-2",
    code: "7.NS.2",
    domain: "The Number System",
    domainCode: "NS",
    title: "Multiply & Divide Rational Numbers",
    description:
      "Apply and extend previous understandings of multiplication and division and of fractions to multiply and divide rational numbers.",
    keywords: [
      "multiply",
      "divide",
      "negative",
      "positive",
      "rational",
      "product",
      "quotient",
      "fraction",
    ],
  },
  {
    id: "7-ns-3",
    code: "7.NS.3",
    domain: "The Number System",
    domainCode: "NS",
    title: "Solve Problems with Rational Numbers",
    description:
      "Solve real-world and mathematical problems involving the four operations with rational numbers.",
    keywords: [
      "real-world",
      "word problem",
      "rational numbers",
      "operations",
      "four operations",
    ],
  },

  // Expressions and Equations (EE)
  {
    id: "7-ee-1",
    code: "7.EE.1",
    domain: "Expressions & Equations",
    domainCode: "EE",
    title: "Linear Expressions",
    description:
      "Apply properties of operations as strategies to add, subtract, factor, and expand linear expressions with rational coefficients.",
    keywords: [
      "combine like terms",
      "factor",
      "expand",
      "distribute",
      "coefficient",
      "expression",
      "simplify",
    ],
  },
  {
    id: "7-ee-4",
    code: "7.EE.4",
    domain: "Expressions & Equations",
    domainCode: "EE",
    title: "Equations & Inequalities",
    description:
      "Use variables to represent quantities in a real-world or mathematical problem, and construct simple equations and inequalities to solve problems.",
    keywords: [
      "variable",
      "equation",
      "inequality",
      "solve",
      "x",
      "solve for",
      "unknown",
    ],
  },

  // Geometry (G)
  {
    id: "7-g-1",
    code: "7.G.1",
    domain: "Geometry",
    domainCode: "G",
    title: "Scale Drawings",
    description:
      "Solve problems involving scale drawings of geometric figures.",
    keywords: [
      "scale",
      "drawing",
      "ratio",
      "length",
      "area",
      "similar",
      "map",
      "blueprint",
    ],
  },
  {
    id: "7-g-4",
    code: "7.G.4",
    domain: "Geometry",
    domainCode: "G",
    title: "Circles",
    description:
      "Know the formulas for the area and circumference of a circle and use them to solve problems.",
    keywords: [
      "circle",
      "area",
      "circumference",
      "radius",
      "diameter",
      "pi",
      "π",
    ],
  },
  {
    id: "7-g-5",
    code: "7.G.5",
    domain: "Geometry",
    domainCode: "G",
    title: "Angle Relationships",
    description:
      "Use facts about supplementary, complementary, vertical, and adjacent angles in a multi-step problem to write and solve simple equations for an unknown angle in a figure.",
    keywords: [
      "angle",
      "supplementary",
      "complementary",
      "vertical",
      "adjacent",
      "degrees",
      "°",
    ],
  },
  {
    id: "7-g-6",
    code: "7.G.6",
    domain: "Geometry",
    domainCode: "G",
    title: "Area, Volume & Surface Area",
    description:
      "Solve real-world and mathematical problems involving area, volume and surface area.",
    keywords: [
      "area",
      "volume",
      "surface area",
      "prism",
      "pyramid",
      "polygon",
      "rectangular",
    ],
  },

  // Statistics and Probability (SP)
  {
    id: "7-sp-1",
    code: "7.SP.1",
    domain: "Statistics & Probability",
    domainCode: "SP",
    title: "Sampling & Populations",
    description:
      "Understand that statistics can be used to gain information about a population by examining a sample of the population.",
    keywords: [
      "sample",
      "population",
      "representative",
      "random",
      "inference",
      "survey",
    ],
  },
  {
    id: "7-sp-5",
    code: "7.SP.5",
    domain: "Statistics & Probability",
    domainCode: "SP",
    title: "Understand Probability",
    description:
      "Understand that the probability of a chance event is a number between 0 and 1 that expresses the likelihood of the event occurring.",
    keywords: [
      "probability",
      "chance",
      "likelihood",
      "certain",
      "impossible",
      "likely",
      "unlikely",
    ],
  },
];

export function detectStandards(problemText: string): Standard[] {
  const lowerText = problemText.toLowerCase();
  const matchedStandards: Standard[] = [];

  for (const standard of STANDARDS) {
    const matchScore = standard.keywords.reduce((score, keyword) => {
      if (lowerText.includes(keyword.toLowerCase())) {
        return score + 1;
      }
      return score;
    }, 0);

    if (matchScore > 0) {
      matchedStandards.push(standard);
    }
  }

  return matchedStandards.sort((a, b) => {
    const aScore = a.keywords.filter((k) =>
      lowerText.includes(k.toLowerCase()),
    ).length;
    const bScore = b.keywords.filter((k) =>
      lowerText.includes(k.toLowerCase()),
    ).length;
    return bScore - aScore;
  });
}

export function getDomainColor(domainCode: string): string {
  const domain = DOMAINS.find((d) => d.code === domainCode);
  return domain?.color || "bg-gray-500";
}
