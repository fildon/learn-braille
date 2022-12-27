import { stringToState, stateToString } from "./persistence";

test("stateToString and stringToState preserve state", () => {
	const mockState: GameState = {
		version: "3",
		step: 1,
		currentCard: {
			id: "1",
			front: "f",
			back: "b",
			learningState: "ready",
		},
		guesses: [
			{
				id: "1",
				front: "f",
				back: "b",
				learningState: "ready",
			},
			{
				id: "1",
				front: "f",
				back: "b",
				learningState: "ready",
			},
			{
				id: "1",
				front: "f",
				back: "b",
				learningState: "ready",
			},
		],
		ready: [
			{ id: "2", front: "F", back: "B", learningState: "ready" },
		],
		box1: [],
		box2: [],
		box3: [],
		box4: [],
		box5: [],
		box6: [],
		box7: [],
		retired: [],
	};

	const stringState = stateToString(mockState);
	const reconstructedState = stringToState(stringState);

	expect(reconstructedState).toMatchObject(mockState);
});

test("stringToState rejects non-state strings", () => {
	expect(() => stringToState('["I am not a valid state"]')).toThrow();
});
