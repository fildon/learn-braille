/**
 * A card has two faces, each represented by a string
 */
type Card = [string, string];

/**
 * 7 sections of a Leitner box
 */
type Boxes = [
	Array<Card>,
	Array<Card>,
	Array<Card>,
	Array<Card>,
	Array<Card>,
	Array<Card>,
	Array<Card>
];

export type LearningState = {
	/**
	 * Cards which haven't been added into the flow yet
	 */
	ready: Array<Card>;
	/**
	 * Active leitner boxes
	 */
	boxes: Boxes;
	/**
	 * Cards that have been completely learned
	 */
	retired: Array<Card>;
};

/**
 * The state to be used the first time a user plays
 */
const initialState: LearningState = {
	ready: [],
	boxes: [
		[
			["⠁", "A"],
			["⠃", "B"],
			["⠉", "C"],
			["⠙", "D"],
			["⠑", "E"],
		],
		[],
		[],
		[],
		[],
		[],
		[],
	],
	retired: [],
};

/**
 * Builds a storage module
 *
 * This pattern allows us to write pure function code,
 * but inject dependencies on localStorage manually
 */
export const buildStorage = ({
	getItem,
	setItem,
}: Pick<Storage, "getItem" | "setItem">) => {
	/**
	 * Retrieves current state from storage, or creates a new state
	 * if storage is empty
	 */
	const getState = (): LearningState => {
		const storedState = getItem("learning");

		if (storedState === null) {
			setItem("learning", JSON.stringify(initialState));
			return initialState;
		}

		return JSON.parse(storedState) as LearningState;
	};

	return {
		getState,
	};
};
