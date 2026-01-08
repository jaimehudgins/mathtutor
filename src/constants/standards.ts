// Mississippi College and Career Readiness Standards (MCCRS) for 7th Grade Math

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
  { code: "RP", name: "Ratios & Proportional Relationships", color: "bg-blue-500" },
  { code: "NS", name: "The Number System", color: "bg-green-500" },
  { code: "EE", name: "Expressions & Equations", color: "bg-purple-500" },
  { code: "G", name: "Geometry", color: "bg-orange-500" },
  { code: "SP", name: "Statistics & Probability", color: "bg-pink-500" },
];

export const STANDARDS: Standard[] = [
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
    title: "Recognize Proportional Relationships",
    description: "Recognize and represent proportional relationships between quantities.",
    keywords: ["proportional", "proportion", "constant", "equivalent ratios"],
  },
  {
    id: "7-rp-3",
    code: "7.RP.3",
    domain: "Ratios & Proportional Relationships",
    domainCode: "RP",
    title: "Solve Multistep Ratio Problems",
    description: "Use proportional relationships to solve multistep ratio and percent problems.",
    keywords: ["percent", "discount", "tax", "tip", "markup", "interest"],
  },
  {
    id: "7-ns-1",
    code: "7.NS.1",
    domain: "The Number System",
    domainCode: "NS",
    title: "Add and Subtract Rational Numbers",
    description: "Apply and extend previous understandings of addition and subtraction to add and subtract rational numbers.",
    keywords: ["add", "subtract", "negative", "positive", "integer", "rational", "number line"],
  },
  {
    id: "7-ns-2",
    code: "7.NS.2",
    domain: "The Number System",
    domainCode: "NS",
    title: "Multiply and Divide Rational Numbers",
    description: "Apply and extend previous understandings of multiplication and division to multiply and divide rational numbers.",
    keywords: ["multiply", "divide", "negative", "positive", "rational", "product", "quotient"],
  },
  {
    id: "7-ns-3",
    code: "7.NS.3",
    domain: "The Number System",
    domainCode: "NS",
    title: "Solve Real-World Problems",
    description: "Solve real-world and mathematical problems involving the four operations with rational numbers.",
    keywords: ["real-world", "word problem", "rational numbers", "operations"],
  },
  {
    id: "7-ee-1",
    code: "7.EE.1",
    domain: "Expressions & Equations",
    domainCode: "EE",
    title: "Apply Properties to Expressions",
    description: "Apply properties of operations to add, subtract, factor, and expand linear expressions.",
    keywords: ["combine like terms", "factor", "expand", "distribute", "coefficient", "expression"],
  },
  {
    id: "7-ee-2",
    code: "7.EE.2",
    domain: "Expressions & Equations",
    domainCode: "EE",
    title: "Rewrite Expressions",
    description: "Understand that rewriting an expression in different forms can shed light on the problem.",
    keywords: ["rewrite", "equivalent", "expression", "form"],
  },
  {
    id: "7-ee-3",
    code: "7.EE.3",
    domain: "Expressions & Equations",
    domainCode: "EE",
    title: "Solve Multi-Step Problems",
    description: "Solve multi-step real-life and mathematical problems posed with rational numbers.",
    keywords: ["multi-step", "estimate", "reasonable", "rational numbers"],
  },
  {
    id: "7-ee-4",
    code: "7.EE.4",
    domain: "Expressions & Equations",
    domainCode: "EE",
    title: "Solve Equations and Inequalities",
    description: "Use variables to represent quantities and construct simple equations and inequalities to solve problems.",
    keywords: ["variable", "equation", "inequality", "solve", "x", "solve for"],
  },
  {
    id: "7-g-1",
    code: "7.G.1",
    domain: "Geometry",
    domainCode: "G",
    title: "Scale Drawings",
    description: "Solve problems involving scale drawings of geometric figures.",
    keywords: ["scale", "drawing", "ratio", "length", "area", "similar"],
  },
  {
    id: "7-g-2",
    code: "7.G.2",
    domain: "Geometry",
    domainCode: "G",
    title: "Construct Geometric Shapes",
    description: "Draw geometric shapes with given conditions.",
    keywords: ["triangle", "construct", "angle", "side", "conditions"],
  },
  {
    id: "7-g-3",
    code: "7.G.3",
    domain: "Geometry",
    domainCode: "G",
    title: "Cross Sections",
    description: "Describe the two-dimensional figures that result from slicing three-dimensional figures.",
    keywords: ["cross section", "slice", "3D", "2D", "prism", "pyramid"],
  },
  {
    id: "7-g-4",
    code: "7.G.4",
    domain: "Geometry",
    domainCode: "G",
    title: "Circles",
    description: "Know the formulas for the area and circumference of a circle and use them to solve problems.",
    keywords: ["circle", "area", "circumference", "radius", "diameter", "pi"],
  },
  {
    id: "7-g-5",
    code: "7.G.5",
    domain: "Geometry",
    domainCode: "G",
    title: "Angle Relationships",
    description: "Use facts about supplementary, complementary, vertical, and adjacent angles.",
    keywords: ["supplementary", "complementary", "vertical", "adjacent", "angle"],
  },
  {
    id: "7-g-6",
    code: "7.G.6",
    domain: "Geometry",
    domainCode: "G",
    title: "Area, Volume, Surface Area",
    description: "Solve problems involving area, volume and surface area of objects.",
    keywords: ["area", "volume", "surface area", "prism", "pyramid", "polygon"],
  },
  {
    id: "7-sp-1",
    code: "7.SP.1",
    domain: "Statistics & Probability",
    domainCode: "SP",
    title: "Sampling and Populations",
    description: "Understand that statistics can be used to gain information about a population.",
    keywords: ["sample", "population", "representative", "random", "inference"],
  },
  {
    id: "7-sp-5",
    code: "7.SP.5",
    domain: "Statistics & Probability",
    domainCode: "SP",
    title: "Understand Probability",
    description: "Understand that the probability of a chance event is a number between 0 and 1.",
    keywords: ["probability", "chance", "likelihood", "certain", "impossible"],
  },
  {
    id: "7-sp-7",
    code: "7.SP.7",
    domain: "Statistics & Probability",
    domainCode: "SP",
    title: "Develop Probability Models",
    description: "Develop a probability model and use it to find probabilities of events.",
    keywords: ["probability model", "uniform", "theoretical"],
  },
  {
    id: "7-sp-8",
    code: "7.SP.8",
    domain: "Statistics & Probability",
    domainCode: "SP",
    title: "Compound Events",
    description: "Find probabilities of compound events using organized lists, tables, tree diagrams.",
    keywords: ["compound", "tree diagram", "table", "sample space", "simulation"],
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
    const aScore = a.keywords.filter(k => lowerText.includes(k.toLowerCase())).length;
    const bScore = b.keywords.filter(k => lowerText.includes(k.toLowerCase())).length;
    return bScore - aScore;
  });
}

export function getDomainColor(domainCode: string): string {
  const domain = DOMAINS.find(d => d.code === domainCode);
  return domain?.color || "bg-gray-500";
}
