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
