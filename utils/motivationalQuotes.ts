export interface MotivationalQuote {
  id: string;
  text: string;
  author?: string;
  category:
    | "focus"
    | "productivity"
    | "mindfulness"
    | "perseverance"
    | "success";
  emoji?: string;
}

export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  // Focus quotes
  {
    id: "focus_1",
    text: "Focus is your superpower.",
    category: "focus",
    emoji: "🎯",
  },
  {
    id: "focus_2",
    text: "Where attention goes, energy flows.",
    category: "focus",
    emoji: "⚡",
  },
  {
    id: "focus_3",
    text: "Deep work is the ability to focus without distraction.",
    author: "Cal Newport",
    category: "focus",
    emoji: "🧠",
  },
  {
    id: "focus_4",
    text: "Concentrate all your thoughts upon the work at hand.",
    author: "Alexander Graham Bell",
    category: "focus",
    emoji: "🔍",
  },
  {
    id: "focus_5",
    text: "The successful warrior is the average person with laser-like focus.",
    author: "Bruce Lee",
    category: "focus",
    emoji: "⚔️",
  },

  // Productivity quotes
  {
    id: "productivity_1",
    text: "You are unstoppable when you focus.",
    category: "productivity",
    emoji: "🚀",
  },
  {
    id: "productivity_2",
    text: "Progress, not perfection.",
    category: "productivity",
    emoji: "📈",
  },
  {
    id: "productivity_3",
    text: "Small steps lead to big changes.",
    category: "productivity",
    emoji: "👣",
  },
  {
    id: "productivity_4",
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "productivity",
    emoji: "💪",
  },
  {
    id: "productivity_5",
    text: "Productivity is never an accident.",
    author: "Paul J. Meyer",
    category: "productivity",
    emoji: "⚙️",
  },

  // Mindfulness quotes
  {
    id: "mindfulness_1",
    text: "Be present. Be focused. Be unstoppable.",
    category: "mindfulness",
    emoji: "🧘‍♀️",
  },
  {
    id: "mindfulness_2",
    text: "The present moment is the only time over which we have dominion.",
    author: "Thích Nhất Hạnh",
    category: "mindfulness",
    emoji: "🌸",
  },
  {
    id: "mindfulness_3",
    text: "Mindfulness is about being fully awake in our lives.",
    author: "Jon Kabat-Zinn",
    category: "mindfulness",
    emoji: "☀️",
  },
  {
    id: "mindfulness_4",
    text: "Focus on the journey, not the destination.",
    category: "mindfulness",
    emoji: "🛤️",
  },
  {
    id: "mindfulness_5",
    text: "Breathe deeply and let your mind settle.",
    category: "mindfulness",
    emoji: "💨",
  },

  // Perseverance quotes
  {
    id: "perseverance_1",
    text: "Stay focused and never give up.",
    category: "perseverance",
    emoji: "🔥",
  },
  {
    id: "perseverance_2",
    text: "Great things never come from comfort zones.",
    category: "perseverance",
    emoji: "💎",
  },
  {
    id: "perseverance_3",
    text: "The difference between ordinary and extraordinary is that little extra.",
    author: "Jimmy Johnson",
    category: "perseverance",
    emoji: "⭐",
  },
  {
    id: "perseverance_4",
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier",
    category: "perseverance",
    emoji: "🏔️",
  },
  {
    id: "perseverance_5",
    text: "Persistence is the hard work you do after you get tired.",
    author: "Newt Gingrich",
    category: "perseverance",
    emoji: "💪",
  },

  // Success quotes
  {
    id: "success_1",
    text: "Your focused mind is your greatest asset.",
    category: "success",
    emoji: "🧠",
  },
  {
    id: "success_2",
    text: "Success is where preparation and opportunity meet.",
    author: "Bobby Unser",
    category: "success",
    emoji: "🎯",
  },
  {
    id: "success_3",
    text: "The expert in anything was once a beginner.",
    category: "success",
    emoji: "🌱",
  },
  {
    id: "success_4",
    text: "Excellence is not a skill, it's an attitude.",
    author: "Ralph Marston",
    category: "success",
    emoji: "👑",
  },
  {
    id: "success_5",
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
    category: "success",
    emoji: "🚀",
  },
];

/**
 * Get a random motivational quote
 */
export const getRandomQuote = (): MotivationalQuote => {
  const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[randomIndex];
};

/**
 * Get a random quote from a specific category
 */
export const getRandomQuoteByCategory = (
  category: MotivationalQuote["category"]
): MotivationalQuote => {
  const categoryQuotes = MOTIVATIONAL_QUOTES.filter(
    (quote) => quote.category === category
  );
  const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
  return categoryQuotes[randomIndex];
};

/**
 * Get multiple random quotes (avoiding duplicates)
 */
export const getRandomQuotes = (count: number): MotivationalQuote[] => {
  const shuffled = [...MOTIVATIONAL_QUOTES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, MOTIVATIONAL_QUOTES.length));
};

/**
 * Get quote appropriate for session phase
 */
export const getPhaseAppropriateQuote = (
  phase: "start" | "middle" | "end",
  remainingMinutes: number
): MotivationalQuote => {
  let preferredCategories: MotivationalQuote["category"][];

  switch (phase) {
    case "start":
      preferredCategories = ["focus", "mindfulness"];
      break;
    case "middle":
      if (remainingMinutes > 10) {
        preferredCategories = ["perseverance", "productivity"];
      } else {
        preferredCategories = ["perseverance", "success"];
      }
      break;
    case "end":
      preferredCategories = ["success", "productivity"];
      break;
    default:
      preferredCategories = ["focus"];
  }

  const relevantQuotes = MOTIVATIONAL_QUOTES.filter((quote) =>
    preferredCategories.includes(quote.category)
  );

  const randomIndex = Math.floor(Math.random() * relevantQuotes.length);
  return relevantQuotes[randomIndex];
};

/**
 * Format quote for display
 */
export const formatQuote = (
  quote: MotivationalQuote,
  includeEmoji: boolean = true
): string => {
  const emoji = includeEmoji && quote.emoji ? `${quote.emoji} ` : "";
  const author = quote.author ? ` — ${quote.author}` : "";
  return `${emoji}"${quote.text}"${author}`;
};

/**
 * Get motivational message based on session progress
 */
export const getProgressMessage = (
  elapsedMinutes: number,
  totalMinutes: number,
  remainingMinutes: number
): string => {
  const progressPercentage = (elapsedMinutes / totalMinutes) * 100;

  if (progressPercentage < 25) {
    return "You're off to a great start! Stay focused.";
  } else if (progressPercentage < 50) {
    return "You're building momentum. Keep going!";
  } else if (progressPercentage < 75) {
    return "More than halfway there. You're doing amazing!";
  } else if (progressPercentage < 90) {
    return "Almost there! Push through to the finish.";
  } else {
    return "Final stretch! You've got this!";
  }
};

/**
 * Quote rotation manager for long sessions
 */
export class QuoteRotationManager {
  private usedQuotes: Set<string> = new Set();
  private rotationInterval: number;
  private onQuoteChange?: (quote: MotivationalQuote) => void;
  private timer?: NodeJS.Timeout;

  constructor(rotationInterval: number = 5 * 60 * 1000) {
    // 5 minutes default
    this.rotationInterval = rotationInterval;
  }

  /**
   * Start quote rotation
   */
  start(onQuoteChange: (quote: MotivationalQuote) => void): void {
    this.onQuoteChange = onQuoteChange;

    // Show initial quote
    const initialQuote = this.getNextQuote();
    onQuoteChange(initialQuote);

    // Set up rotation timer
    this.timer = setInterval(() => {
      const nextQuote = this.getNextQuote();
      onQuoteChange(nextQuote);
    }, this.rotationInterval);
  }

  /**
   * Stop quote rotation
   */
  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
    this.reset();
  }

  /**
   * Reset used quotes
   */
  reset(): void {
    this.usedQuotes.clear();
  }

  /**
   * Get next quote (avoiding recently used ones)
   */
  private getNextQuote(): MotivationalQuote {
    // If we've used all quotes, reset the used set
    if (this.usedQuotes.size >= MOTIVATIONAL_QUOTES.length) {
      this.usedQuotes.clear();
    }

    // Find unused quotes
    const unusedQuotes = MOTIVATIONAL_QUOTES.filter(
      (quote) => !this.usedQuotes.has(quote.id)
    );

    // Pick random unused quote
    const randomIndex = Math.floor(Math.random() * unusedQuotes.length);
    const selectedQuote = unusedQuotes[randomIndex];

    // Mark as used
    this.usedQuotes.add(selectedQuote.id);

    return selectedQuote;
  }

  /**
   * Update rotation interval
   */
  updateInterval(newInterval: number): void {
    this.rotationInterval = newInterval;

    // Restart timer with new interval if currently running
    if (this.timer && this.onQuoteChange) {
      this.stop();
      this.start(this.onQuoteChange);
    }
  }
}
