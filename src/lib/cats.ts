// Cat GIFs and images for rewards and encouragement

// Celebration cat GIFs for correct answers
export const CELEBRATION_CATS = [
  'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif', // Cat party
  'https://media.giphy.com/media/3o7TKu8D1d12Eo9wSQ/giphy.gif', // Happy cat dance
  'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif', // Cat thumbs up
  'https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif', // Cat clapping
  'https://media.giphy.com/media/BQUITFiYVtNte/giphy.gif', // Cat victory
  'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif', // Dancing cat
  'https://media.giphy.com/media/10dU7AN7xsi1I4/giphy.gif', // Cool cat sunglasses
  'https://media.giphy.com/media/VxbvpfaTTo3le/giphy.gif', // Cat high five
];

// Encouraging cat GIFs for wrong answers (keep trying!)
export const ENCOURAGEMENT_CATS = [
  'https://media.giphy.com/media/BEob5qwFkSJ7G/giphy.gif', // Cat hug
  'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif', // Cat you can do it
  'https://media.giphy.com/media/VbKHQKH8fPJEk/giphy.gif', // Cat pat
  'https://media.giphy.com/media/tXL4FHPSnVJ0A/giphy.gif', // Cat thinking
  'https://media.giphy.com/media/H4DjXQXamtTiIuCcRU/giphy.gif', // Cat studying
  'https://media.giphy.com/media/3o7527pa7qs9kCG78A/giphy.gif', // Cat learning
];

// Streak cats - special celebration for streaks
export const STREAK_CATS = [
  'https://media.giphy.com/media/l3q2Z6S6n38zjPswo/giphy.gif', // Super cat
  'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif', // Cat on fire
  'https://media.giphy.com/media/fUYhyT9IjftxrxJXcE/giphy.gif', // Cat genius
  'https://media.giphy.com/media/PQKlfexeEpnTq/giphy.gif', // Cat amazing
];

// Welcome/hello cats
export const WELCOME_CATS = [
  'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif', // Cat wave
  'https://media.giphy.com/media/nR4L10XlJcSeQ/giphy.gif', // Cat hello
  'https://media.giphy.com/media/3oEjI4sFlp73fvEYgw/giphy.gif', // Cat waving
];

// Thinking cats for when processing
export const THINKING_CATS = [
  'https://media.giphy.com/media/tXL4FHPSnVJ0A/giphy.gif', // Cat thinking
  'https://media.giphy.com/media/3o7TKTDn976rzVgky4/giphy.gif', // Cat calculating
  'https://media.giphy.com/media/H4DjXQXamtTiIuCcRU/giphy.gif', // Cat studying
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

// Get celebration based on streak
export function getCelebration(streak: number): { gif: string; message: string } {
  if (streak >= 5) {
    return {
      gif: getRandomCat(STREAK_CATS),
      message: getRandomMessage(STREAK_MESSAGES),
    };
  }
  return {
    gif: getRandomCat(CELEBRATION_CATS),
    message: getRandomMessage(CELEBRATION_MESSAGES),
  };
}

// Get encouragement for wrong answers
export function getEncouragement(): { gif: string; message: string } {
  return {
    gif: getRandomCat(ENCOURAGEMENT_CATS),
    message: getRandomMessage(ENCOURAGEMENT_MESSAGES),
  };
}
