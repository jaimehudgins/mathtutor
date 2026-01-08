// Cat GIFs and images for rewards and encouragement
// Using cataas.com (Cat as a Service) - reliable cat image API

// Base URL for cataas - generates random cat images with text overlay
const CATAAS_BASE = "https://cataas.com";

// Celebration cat GIFs for correct answers - using cataas gif endpoint
export const CELEBRATION_CATS = [
  `${CATAAS_BASE}/cat/gif?timestamp=1`,
  `${CATAAS_BASE}/cat/gif?timestamp=2`,
  `${CATAAS_BASE}/cat/gif?timestamp=3`,
  `${CATAAS_BASE}/cat/gif?timestamp=4`,
  `${CATAAS_BASE}/cat/gif?timestamp=5`,
  `${CATAAS_BASE}/cat/gif?timestamp=6`,
];

// Encouraging cat GIFs for wrong answers (keep trying!)
export const ENCOURAGEMENT_CATS = [
  `${CATAAS_BASE}/cat/gif?timestamp=7`,
  `${CATAAS_BASE}/cat/gif?timestamp=8`,
  `${CATAAS_BASE}/cat/gif?timestamp=9`,
  `${CATAAS_BASE}/cat/gif?timestamp=10`,
  `${CATAAS_BASE}/cat/gif?timestamp=11`,
];

// Streak cats - special celebration for streaks
export const STREAK_CATS = [
  `${CATAAS_BASE}/cat/gif?timestamp=12`,
  `${CATAAS_BASE}/cat/gif?timestamp=13`,
  `${CATAAS_BASE}/cat/gif?timestamp=14`,
];

// Welcome/hello cats
export const WELCOME_CATS = [
  `${CATAAS_BASE}/cat/gif?timestamp=15`,
  `${CATAAS_BASE}/cat/gif?timestamp=16`,
  `${CATAAS_BASE}/cat/gif?timestamp=17`,
];

// Thinking cats for when processing
export const THINKING_CATS = [
  `${CATAAS_BASE}/cat/gif?timestamp=18`,
  `${CATAAS_BASE}/cat/gif?timestamp=19`,
  `${CATAAS_BASE}/cat/gif?timestamp=20`,
];

// Cat messages for celebrations
export const CELEBRATION_MESSAGES = [
  "Purrfect! 🐱",
  "You're the cat's meow! 🐱",
  "Meow-velous work! 🐱",
  "Fur-tastic job! 🐱",
  "You're claw-some! 🐱",
  "Paws-itively brilliant! 🐱",
  "That's purr-fection! 🐱",
  "Feline fine! 🐱",
  "You nailed it, kitten! 🐱",
  "Cat-astrophically good! 🐱",
];

// Encouragement messages
export const ENCOURAGEMENT_MESSAGES = [
  "Don't worry, every cat lands on their feet! Try again! 🐱",
  "Even cats need 9 tries sometimes! 🐱",
  "Keep going, curious cat! 🐱",
  "Paws and think about it! 🐱",
  "You've got this, little lion! 🐱",
  "Cats never give up, and neither should you! 🐱",
  "Almost there, whisker by whisker! 🐱",
  "Take a catnap and try again! 🐱",
];

// Streak messages
export const STREAK_MESSAGES = [
  "🔥 You're on fire! Even cats are impressed! 🐱",
  "🔥 Unstoppable! Like a cat chasing a laser! 🐱",
  "🔥 MEGA MEOW! Keep that streak going! 🐱",
  "🔥 You're the top cat! 🐱",
  "🔥 Legendary feline status achieved! 🐱",
];

// Get a random item from an array
export function getRandomCat(cats: string[]): string {
  return cats[Math.floor(Math.random() * cats.length)];
}

export function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

// Get a fresh random cat GIF URL (adds timestamp to prevent caching)
export function getFreshCatGif(): string {
  return `${CATAAS_BASE}/cat/gif?${Date.now()}`;
}

// Get celebration based on streak
export function getCelebration(streak: number): {
  gif: string;
  message: string;
} {
  // Always get a fresh GIF to show variety
  const gif = getFreshCatGif();

  if (streak >= 5) {
    return {
      gif,
      message: getRandomMessage(STREAK_MESSAGES),
    };
  }
  return {
    gif,
    message: getRandomMessage(CELEBRATION_MESSAGES),
  };
}

// Get encouragement for wrong answers
export function getEncouragement(): { gif: string; message: string } {
  return {
    gif: getFreshCatGif(),
    message: getRandomMessage(ENCOURAGEMENT_MESSAGES),
  };
}

// Get a welcome cat for initial greetings
export function getWelcomeCat(): string {
  return getFreshCatGif();
}

// Get a thinking cat for processing states
export function getThinkingCat(): string {
  return getFreshCatGif();
}
