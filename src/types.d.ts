type ActiveBox =
	| "box1"
	| "box2"
	| "box3"
	| "box4"
	| "box5"
	| "box6"
	| "box7";

type LearningState = "ready" | ActiveBox | "retired";

/**
 * A card represents a single learning card
 */
type Card = {
	/**
	 * Unique ID
	 */
	id: string;
	/**
	 * The front face of the card
	 */
	front: string;
	/**
	 * The back face of the card
	 */
	back: string;
	learningState: LearningState;
};

/**
 * This is the state we expose throughout the system
 *
 * There is redundancy, but it is in the name of convenience
 */
type GameState = {
	version: string;
	step: number;
	/**
	 * The current card _also_ exists in ready or a box or retired.
	 * But it is also available here for convenience.
	 */
	currentCard: Card;
	/**
	 * Cards which are not the card under test, intended as false guesses
	 */
	guesses: [Card, Card, Card];
	ready: Array<Card>;
	box1: Array<Card>;
	box2: Array<Card>;
	box3: Array<Card>;
	box4: Array<Card>;
	box5: Array<Card>;
	box6: Array<Card>;
	box7: Array<Card>;
	retired: Array<Card>;
};
