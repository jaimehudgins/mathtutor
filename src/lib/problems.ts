// Problem generation system for 7th grade math standards

export interface Problem {
  id: string;
  standardId: string;
  question: string;
  correctAnswer: string;
  acceptableAnswers: string[]; // Alternative formats (e.g., "0.5", "1/2", ".5")
  hint: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

// Helper functions for random number generation
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function simplifyFraction(num: number, den: number): [number, number] {
  const g = gcd(num, den);
  return [num / g, den / g];
}

// Problem generators by standard
const problemGenerators: Record<string, () => Problem> = {
  "7-rp-1": () => {
    // Unit rates with fractions
    const miles = randInt(2, 10);
    const hours = randInt(2, 5);
    const rate = miles / hours;
    const rateStr = Number.isInteger(rate) ? rate.toString() : rate.toFixed(2);

    return {
      id: Date.now().toString(),
      standardId: "7-rp-1",
      question: `A car travels ${miles} miles in ${hours} hours. What is the unit rate in miles per hour?`,
      correctAnswer: rateStr,
      acceptableAnswers: [rateStr, rate.toString(), (miles / hours).toFixed(1)],
      hint: "Divide the total miles by the total hours to find miles per hour.",
      explanation: `To find the unit rate, divide ${miles} miles by ${hours} hours: ${miles} ÷ ${hours} = ${rateStr} miles per hour.`,
      difficulty: "easy",
    };
  },

  "7-rp-2": () => {
    // Proportional relationships
    const rate = randInt(2, 8);
    const x1 = randInt(2, 5);
    const y1 = x1 * rate;
    const x2 = randInt(6, 10);
    const y2 = x2 * rate;

    return {
      id: Date.now().toString(),
      standardId: "7-rp-2",
      question: `If y is proportional to x, and y = ${y1} when x = ${x1}, what is y when x = ${x2}?`,
      correctAnswer: y2.toString(),
      acceptableAnswers: [y2.toString()],
      hint: "First find the constant of proportionality (k = y/x), then use y = kx.",
      explanation: `The constant of proportionality k = ${y1}/${x1} = ${rate}. So when x = ${x2}, y = ${rate} × ${x2} = ${y2}.`,
      difficulty: "medium",
    };
  },

  "7-rp-3": () => {
    // Percent problems
    const original = randInt(20, 100) * 5;
    const percent = randChoice([10, 15, 20, 25, 30]);
    const discount = (original * percent) / 100;
    const final = original - discount;

    return {
      id: Date.now().toString(),
      standardId: "7-rp-3",
      question: `A shirt costs $${original}. It is on sale for ${percent}% off. What is the sale price?`,
      correctAnswer: final.toString(),
      acceptableAnswers: [
        final.toString(),
        `$${final}`,
        final.toFixed(2),
        `$${final.toFixed(2)}`,
      ],
      hint: "Calculate the discount amount first, then subtract from the original price.",
      explanation: `Discount = ${percent}% of $${original} = $${discount}. Sale price = $${original} - $${discount} = $${final}.`,
      difficulty: "medium",
    };
  },

  "7-ns-1": () => {
    // Adding/subtracting integers
    const a = randInt(-15, 15);
    const b = randInt(-15, 15);
    const operation = randChoice(["+", "-"]);
    const result = operation === "+" ? a + b : a - b;
    const aStr = a < 0 ? `(${a})` : a.toString();
    const bStr = b < 0 ? `(${b})` : b.toString();

    return {
      id: Date.now().toString(),
      standardId: "7-ns-1",
      question: `Calculate: ${aStr} ${operation} ${bStr}`,
      correctAnswer: result.toString(),
      acceptableAnswers: [result.toString()],
      hint:
        operation === "+"
          ? "When adding, same signs add and keep the sign. Different signs subtract and keep the sign of the larger absolute value."
          : "Subtracting a number is the same as adding its opposite.",
      explanation: `${aStr} ${operation} ${bStr} = ${result}`,
      difficulty: "easy",
    };
  },

  "7-ns-2": () => {
    // Multiplying/dividing integers
    const a = randInt(-12, 12);
    const b = randChoice(
      [-6, -5, -4, -3, -2, 2, 3, 4, 5, 6].filter((n) => n !== 0),
    );
    const operation = randChoice(["×", "÷"]);
    let result: number;
    let question: string;
    const aStr = a < 0 ? `(${a})` : a.toString();
    const bStr = b < 0 ? `(${b})` : b.toString();

    if (operation === "×") {
      result = a * b;
      question = `Calculate: ${aStr} × ${bStr}`;
    } else {
      result = a * b; // We'll ask what divided gives a
      question = `Calculate: ${result} ÷ ${bStr}`;
      result = a;
    }

    return {
      id: Date.now().toString(),
      standardId: "7-ns-2",
      question,
      correctAnswer: result.toString(),
      acceptableAnswers: [result.toString()],
      hint: "Same signs give positive. Different signs give negative.",
      explanation: `Remember: positive × positive = positive, negative × negative = positive, positive × negative = negative. The answer is ${result}.`,
      difficulty: "easy",
    };
  },

  "7-ns-3": () => {
    // Word problems with rational numbers
    const start = randInt(50, 200);
    const spent = randInt(10, 40);
    const earned = randInt(20, 60);
    const final = start - spent + earned;

    return {
      id: Date.now().toString(),
      standardId: "7-ns-3",
      question: `You have $${start}. You spend $${spent} on lunch and then earn $${earned} from a chore. How much money do you have now?`,
      correctAnswer: final.toString(),
      acceptableAnswers: [final.toString(), `$${final}`],
      hint: "Start with the initial amount, subtract what you spent, and add what you earned.",
      explanation: `$${start} - $${spent} + $${earned} = $${final}`,
      difficulty: "easy",
    };
  },

  "7-ee-1": () => {
    // Combining like terms
    const a = randInt(2, 9);
    const b = randInt(2, 9);
    const c = randInt(1, 6);
    const d = randInt(1, 6);
    const xCoef = a + b;
    const constant = c + d;

    return {
      id: Date.now().toString(),
      standardId: "7-ee-1",
      question: `Simplify: ${a}x + ${c} + ${b}x + ${d}`,
      correctAnswer: `${xCoef}x + ${constant}`,
      acceptableAnswers: [
        `${xCoef}x + ${constant}`,
        `${xCoef}x+${constant}`,
        `${constant} + ${xCoef}x`,
      ],
      hint: "Combine the x terms together and the constant terms together.",
      explanation: `${a}x + ${b}x = ${xCoef}x and ${c} + ${d} = ${constant}. So the answer is ${xCoef}x + ${constant}.`,
      difficulty: "easy",
    };
  },

  "7-ee-4": () => {
    // Solving one-step equations
    const a = randInt(2, 12);
    const x = randInt(2, 15);
    const b = a * x;

    return {
      id: Date.now().toString(),
      standardId: "7-ee-4",
      question: `Solve for x: ${a}x = ${b}`,
      correctAnswer: x.toString(),
      acceptableAnswers: [x.toString(), `x = ${x}`, `x=${x}`],
      hint: "Divide both sides by the coefficient of x.",
      explanation: `Divide both sides by ${a}: x = ${b} ÷ ${a} = ${x}`,
      difficulty: "easy",
    };
  },

  "7-g-4": () => {
    // Circle problems
    const radius = randInt(2, 10);
    const type = randChoice(["area", "circumference"]);
    let answer: number;
    let question: string;

    if (type === "area") {
      answer = Math.round(Math.PI * radius * radius * 100) / 100;
      question = `Find the area of a circle with radius ${radius}. Use π ≈ 3.14 and round to the nearest hundredth.`;
    } else {
      answer = Math.round(2 * Math.PI * radius * 100) / 100;
      question = `Find the circumference of a circle with radius ${radius}. Use π ≈ 3.14 and round to the nearest hundredth.`;
    }

    const approxAnswer =
      type === "area"
        ? Math.round(3.14 * radius * radius * 100) / 100
        : Math.round(2 * 3.14 * radius * 100) / 100;

    return {
      id: Date.now().toString(),
      standardId: "7-g-4",
      question,
      correctAnswer: approxAnswer.toString(),
      acceptableAnswers: [
        approxAnswer.toString(),
        answer.toString(),
        approxAnswer.toFixed(2),
        answer.toFixed(2),
      ],
      hint:
        type === "area"
          ? "Area = π × r². Multiply π by the radius squared."
          : "Circumference = 2 × π × r. Multiply 2, π, and the radius.",
      explanation:
        type === "area"
          ? `Area = π × ${radius}² = 3.14 × ${radius * radius} = ${approxAnswer}`
          : `Circumference = 2 × π × ${radius} = 2 × 3.14 × ${radius} = ${approxAnswer}`,
      difficulty: "medium",
    };
  },

  "7-g-6": () => {
    // Area and volume
    const length = randInt(3, 10);
    const width = randInt(3, 10);
    const height = randInt(2, 8);
    const volume = length * width * height;

    return {
      id: Date.now().toString(),
      standardId: "7-g-6",
      question: `Find the volume of a rectangular prism with length ${length} cm, width ${width} cm, and height ${height} cm.`,
      correctAnswer: volume.toString(),
      acceptableAnswers: [
        volume.toString(),
        `${volume} cm³`,
        `${volume} cubic cm`,
      ],
      hint: "Volume of a rectangular prism = length × width × height",
      explanation: `Volume = ${length} × ${width} × ${height} = ${volume} cubic cm`,
      difficulty: "easy",
    };
  },

  "7-sp-5": () => {
    // Basic probability
    const favorable = randInt(1, 6);
    const total = randInt(favorable + 2, 12);
    const [num, den] = simplifyFraction(favorable, total);
    const decimal = Math.round((favorable / total) * 100) / 100;

    return {
      id: Date.now().toString(),
      standardId: "7-sp-5",
      question: `A bag contains ${total} marbles. ${favorable} of them are red. What is the probability of randomly selecting a red marble? Express as a fraction.`,
      correctAnswer: `${num}/${den}`,
      acceptableAnswers: [
        `${num}/${den}`,
        `${favorable}/${total}`,
        decimal.toString(),
      ],
      hint: "Probability = favorable outcomes ÷ total outcomes",
      explanation: `P(red) = ${favorable}/${total} = ${num}/${den}`,
      difficulty: "easy",
    };
  },

  "7-g-1": () => {
    // Scale drawings
    const scale = randChoice([2, 4, 5, 10]);
    const actualLength = randInt(3, 12) * scale;
    const drawingLength = actualLength / scale;
    const type = randChoice(["find-actual", "find-drawing"]);

    if (type === "find-actual") {
      const drawingMeasure = randInt(2, 8);
      const actualMeasure = drawingMeasure * scale;
      return {
        id: Date.now().toString(),
        standardId: "7-g-1",
        question: `A scale drawing uses a scale of 1 inch = ${scale} feet. If a room is ${drawingMeasure} inches long on the drawing, what is the actual length in feet?`,
        correctAnswer: actualMeasure.toString(),
        acceptableAnswers: [
          actualMeasure.toString(),
          `${actualMeasure} feet`,
          `${actualMeasure} ft`,
        ],
        hint: "Multiply the drawing measurement by the scale factor.",
        explanation: `${drawingMeasure} inches × ${scale} feet per inch = ${actualMeasure} feet`,
        difficulty: "medium",
      };
    } else {
      return {
        id: Date.now().toString(),
        standardId: "7-g-1",
        question: `A scale drawing uses a scale of 1 inch = ${scale} feet. If a wall is actually ${actualLength} feet long, how many inches long should it be on the drawing?`,
        correctAnswer: drawingLength.toString(),
        acceptableAnswers: [
          drawingLength.toString(),
          `${drawingLength} inches`,
          `${drawingLength} in`,
        ],
        hint: "Divide the actual measurement by the scale factor.",
        explanation: `${actualLength} feet ÷ ${scale} feet per inch = ${drawingLength} inches`,
        difficulty: "medium",
      };
    }
  },

  "7-sp-1": () => {
    // Sampling and populations
    const scenarios = [
      {
        population: "students at a school",
        sample: "randomly selecting 50 students from all grades",
        goodSample: true,
        reason: "This is a random sample that represents all grades fairly.",
      },
      {
        population: "students at a school",
        sample: "asking only students in the cafeteria at lunch",
        goodSample: false,
        reason:
          "This only includes students who eat in the cafeteria and misses others.",
      },
      {
        population: "voters in a city",
        sample: "randomly calling phone numbers from the city directory",
        goodSample: true,
        reason:
          "Random selection from the population gives everyone a fair chance.",
      },
      {
        population: "voters in a city",
        sample: "asking people at a political rally",
        goodSample: false,
        reason:
          "Rally attendees likely share similar views and don't represent all voters.",
      },
    ];

    const scenario = randChoice(scenarios);

    return {
      id: Date.now().toString(),
      standardId: "7-sp-1",
      question: `To learn about ${scenario.population}, a researcher uses this method: ${scenario.sample}. Is this a good representative sample? Answer "yes" or "no".`,
      correctAnswer: scenario.goodSample ? "yes" : "no",
      acceptableAnswers: scenario.goodSample
        ? ["yes", "y", "true"]
        : ["no", "n", "false"],
      hint: "A good sample is random and gives everyone in the population an equal chance of being selected.",
      explanation: `${scenario.goodSample ? "Yes" : "No"}. ${scenario.reason}`,
      difficulty: "easy",
    };
  },
};

// Get a problem for a specific standard
export function generateProblem(standardId: string): Problem | null {
  const generator = problemGenerators[standardId];
  if (!generator) {
    // Fallback to a random available standard
    const availableIds = Object.keys(problemGenerators);
    if (availableIds.length === 0) return null;
    const randomId = randChoice(availableIds);
    return problemGenerators[randomId]();
  }
  return generator();
}

// Get a random problem from any standard
export function getRandomProblem(): Problem {
  const standardIds = Object.keys(problemGenerators);
  const randomId = randChoice(standardIds);
  return problemGenerators[randomId]();
}

// Get a problem based on student's weakest areas
export function getProblemForWeakArea(
  progress: { standardId: string; masteryLevel: number }[],
): Problem {
  if (progress.length === 0) {
    return getRandomProblem();
  }

  // Find standards with lowest mastery that we have generators for
  const availableStandards = Object.keys(problemGenerators);
  const weakStandards = progress
    .filter((p) => availableStandards.includes(p.standardId))
    .sort((a, b) => a.masteryLevel - b.masteryLevel);

  if (weakStandards.length > 0 && weakStandards[0].masteryLevel < 80) {
    return generateProblem(weakStandards[0].standardId)!;
  }

  // Try a new standard they haven't practiced
  const practicedIds = new Set(progress.map((p) => p.standardId));
  const newStandards = availableStandards.filter((id) => !practicedIds.has(id));

  if (newStandards.length > 0) {
    return generateProblem(randChoice(newStandards))!;
  }

  return getRandomProblem();
}

// Check if an answer is correct
export function checkAnswer(problem: Problem, userAnswer: string): boolean {
  const normalized = userAnswer
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace("$", "");
  const correctNormalized = problem.correctAnswer
    .toLowerCase()
    .replace(/\s+/g, "");

  if (normalized === correctNormalized) return true;

  // Check acceptable alternatives
  for (const alt of problem.acceptableAnswers) {
    if (normalized === alt.toLowerCase().replace(/\s+/g, "").replace("$", "")) {
      return true;
    }
  }

  // Try numeric comparison for close floating point values
  const userNum = parseFloat(normalized);
  const correctNum = parseFloat(correctNormalized);
  if (!isNaN(userNum) && !isNaN(correctNum)) {
    return Math.abs(userNum - correctNum) < 0.01;
  }

  return false;
}

// Get available standard IDs that have problem generators
export function getAvailableStandardIds(): string[] {
  return Object.keys(problemGenerators);
}
