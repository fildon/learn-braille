import { shuffle } from "./utils";

/**
 * This is the type we read/write to/from storage
 *
 * It is deliberately simplified
 */
export type SerializeableState = {
	version: string;
	step: number;
	currentCard: Card;
	guesses: [Card, Card, Card];
	cards: Array<Card>;
};

const isObj = (
	unknown: unknown
): unknown is Record<PropertyKey, unknown> =>
	unknown !== null && typeof unknown === "object";

const isCard = (obj: unknown): obj is Card =>
	isObj(obj) &&
	typeof obj.id === "string" &&
	typeof obj.front === "string" &&
	typeof obj.back === "string" &&
	[
		"ready",
		...Array.from({ length: 7 }).map((_, i) => `box${i + 1}`),
		"retired",
	].includes(obj.learningState as string);

const isBox = (obj: unknown): obj is Array<Card> =>
	isObj(obj) &&
	Array.isArray(obj) &&
	obj.every((member) => isCard(member));

const isSerializedGameState = (
	unknown: unknown
): unknown is SerializeableState =>
	isObj(unknown) &&
	unknown["version"] === "3" &&
	typeof unknown["step"] === "number" &&
	!Number.isNaN(unknown["step"]) &&
	isBox(unknown["cards"]);

const isLearningState =
	(targetState: Card["learningState"]) =>
	({ learningState }: Card) =>
		learningState === targetState;

const serializedStateToStructuredState = ({
	version,
	step,
	cards,
	currentCard,
	guesses,
}: SerializeableState): GameState => ({
	version,
	step,
	currentCard,
	guesses,
	ready: cards.filter(isLearningState("ready")),
	box1: cards.filter(isLearningState("box1")),
	box2: cards.filter(isLearningState("box2")),
	box3: cards.filter(isLearningState("box3")),
	box4: cards.filter(isLearningState("box4")),
	box5: cards.filter(isLearningState("box5")),
	box6: cards.filter(isLearningState("box6")),
	box7: cards.filter(isLearningState("box7")),
	retired: cards.filter(isLearningState("retired")),
});

export const stringToState = (strState: string): GameState => {
	const parsedState: unknown = JSON.parse(strState);

	if (isSerializedGameState(parsedState)) {
		return serializedStateToStructuredState(parsedState);
	}

	throw new Error("Error parsing state");
};

export const stateToString = (state: GameState): string => {
	const allCards = [
		state.ready,
		state.box1,
		state.box2,
		state.box3,
		state.box4,
		state.box5,
		state.box6,
		state.box7,
		state.retired,
	].flat();

	const serializableState: SerializeableState = {
		version: state.version,
		step: state.step,
		currentCard: state.currentCard,
		guesses: state.guesses,
		cards: allCards,
	};

	return JSON.stringify(serializableState);
};

const initialCards: Array<Card> = [
	{ id: "01", front: "⠁", back: "A", learningState: "ready" },
	{ id: "02", front: "⠃", back: "B", learningState: "ready" },
	{ id: "03", front: "⠉", back: "C", learningState: "ready" },
	{ id: "04", front: "⠙", back: "D", learningState: "ready" },
	{ id: "05", front: "⠑", back: "E", learningState: "ready" },
	{ id: "06", front: "⠋", back: "F", learningState: "ready" },
	{ id: "07", front: "⠛", back: "G", learningState: "ready" },
	{ id: "08", front: "⠓", back: "H", learningState: "ready" },
	{ id: "09", front: "⠊", back: "I", learningState: "ready" },
	{ id: "10", front: "⠚", back: "J", learningState: "ready" },
	{ id: "11", front: "⠅", back: "K", learningState: "ready" },
	{ id: "12", front: "⠇", back: "L", learningState: "ready" },
	{ id: "13", front: "⠍", back: "M", learningState: "ready" },
	{ id: "14", front: "⠝", back: "N", learningState: "ready" },
	{ id: "15", front: "⠕", back: "O", learningState: "ready" },
	{ id: "16", front: "⠏", back: "P", learningState: "ready" },
	{ id: "17", front: "⠟", back: "Q", learningState: "ready" },
	{ id: "18", front: "⠗", back: "R", learningState: "ready" },
	{ id: "19", front: "⠎", back: "S", learningState: "ready" },
	{ id: "20", front: "⠞", back: "T", learningState: "ready" },
	{ id: "21", front: "⠥", back: "U", learningState: "ready" },
	{ id: "22", front: "⠧", back: "V", learningState: "ready" },
	{ id: "23", front: "⠺", back: "W", learningState: "ready" },
	{ id: "24", front: "⠭", back: "X", learningState: "ready" },
	{ id: "25", front: "⠽", back: "Y", learningState: "ready" },
	{ id: "26", front: "⠵", back: "Z", learningState: "ready" },
	{ id: "27", front: "⠂", back: ",", learningState: "ready" },
	{ id: "28", front: "⠆", back: ";", learningState: "ready" },
	{ id: "29", front: "⠒", back: ":", learningState: "ready" },
	{
		id: "30",
		front: "⠲",
		back: ". (period)",
		learningState: "ready",
	},
	{
		id: "31",
		front: "⠨",
		back: ". (decimal)",
		learningState: "ready",
	},
	{
		id: "32",
		front: "⠖",
		back: "!",
		learningState: "ready",
	},
	{
		id: "33",
		front: "⠯",
		back: "&",
		learningState: "ready",
	},
	{
		id: "34",
		front: "⠼",
		back: "# (number mode)",
		learningState: "ready",
	},
	{
		id: "35",
		front: "⠷",
		back: "(",
		learningState: "ready",
	},
	{
		id: "36",
		front: "⠾",
		back: ")",
		learningState: "ready",
	},
	{
		id: "37",
		front: "⠦",
		back: "?",
		learningState: "ready",
	},
];

export const createInitialState = (): GameState => {
	const shuffledCards = shuffle(initialCards);
	return {
		version: "3",
		step: 1,
		currentCard: { ...shuffledCards[0], learningState: "box1" },
		guesses: [shuffledCards[1], shuffledCards[2], shuffledCards[3]],
		ready: shuffledCards.slice(5),
		box1: shuffledCards
			.slice(0, 5)
			.map((card) => ({ ...card, learningState: "box1" })),
		box2: [],
		box3: [],
		box4: [],
		box5: [],
		box6: [],
		box7: [],
		retired: [],
	};
};
