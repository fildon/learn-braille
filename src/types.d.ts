type NumberedBoxKey =
	| "box1"
	| "box2"
	| "box3"
	| "box4"
	| "box5"
	| "box6"
	| "box7";

type BoxKey = "ready" | NumberedBoxKey | "retired";

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
	learningState: BoxKey;
};
