export const shuffle = <T>(items: T[]) =>
	items
		.map((item) => ({ item, rank: Math.random() }))
		.sort((a, b) => a.rank - b.rank)
		.map(({ item }) => item);

export const pickRandom = <T>(items: T[]): T =>
	items[Math.floor(Math.random() * items.length)];
