export function pickOne<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function pickMany<T>(items: T[], count: number): T[] {
  return shuffle(items).slice(0, count);
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
