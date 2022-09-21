import { initialState } from "./persistence";
import { markCardCorrect, markCardIncorrect } from "./stateMachine";

test("markCardCorrect updates currentCard", () => {
	const updated = markCardCorrect(initialState);

	expect(updated.currentCard.id).not.toBe(initialState.currentCard.id);
	expect(updated.box2).toHaveLength(1);
});

test("markCardCorrect pulls in ready cards", () => {
	const mockCardInCurrent: Card = {
		id: "1",
		front: "f",
		back: "b",
		learningState: "box2",
	};
	const stateThatNeedsToPull: GameState = {
		version: "1",
		step: 1,
		currentCard: mockCardInCurrent,
		ready: [
			{ id: "2", front: "F", back: "B", learningState: "ready" },
			{ id: "3", front: "G", back: "C", learningState: "ready" },
		],
		box1: [],
		box2: [mockCardInCurrent],
		box3: [],
		box4: [],
		box5: [],
		box6: [],
		box7: [],
		retired: [],
	};

	const nextState = markCardCorrect(stateThatNeedsToPull);

	expect(nextState.ready).toHaveLength(0);
	expect(nextState.box2).toHaveLength(0);
	expect(nextState.box3).toHaveLength(1);
});

test("markCardCorrect returns a random retired card if there are no others", () => {
	const mockCardA: Card = {
		id: "1",
		front: "f",
		back: "b",
		learningState: "retired",
	};
	const mockCardB: Card = {
		id: "2",
		front: "F",
		back: "B",
		learningState: "retired",
	};
	const mockCardC: Card = {
		id: "3",
		front: "G",
		back: "H",
		learningState: "retired",
	};
	const mockInitialState: GameState = {
		version: "1",
		step: 1,
		currentCard: mockCardA,
		ready: [],
		box1: [],
		box2: [],
		box3: [],
		box4: [],
		box5: [],
		box6: [],
		box7: [],
		retired: [mockCardA, mockCardB, mockCardC],
	};

	const nextState = markCardCorrect(mockInitialState);

	expect(nextState.retired).toHaveLength(3);
});

test("markCardCorrect does not add ready cards if box2 has members", () => {
	const mockCardA: Card = {
		id: "1",
		front: "f",
		back: "b",
		learningState: "box3",
	};
	const mockCardB: Card = {
		id: "2",
		front: "F",
		back: "B",
		learningState: "ready",
	};
	const mockCardC: Card = {
		id: "3",
		front: "G",
		back: "H",
		learningState: "box2",
	};
	const mockInitialState: GameState = {
		version: "1",
		step: 1,
		currentCard: mockCardA,
		ready: [mockCardB],
		box1: [],
		box2: [mockCardC],
		box3: [mockCardA],
		box4: [],
		box5: [],
		box6: [],
		box7: [],
		retired: [mockCardA, mockCardB],
	};

	const nextState = markCardCorrect(mockInitialState);

	expect(nextState.ready).toHaveLength(1);
});

test("markCardCorrect will not pull in ready cards if there are none", () => {
	const mockCardA: Card = {
		id: "1",
		front: "f",
		back: "b",
		learningState: "box4",
	};
	const mockCardB: Card = {
		id: "2",
		front: "F",
		back: "B",
		learningState: "box5",
	};
	const mockInitialState: GameState = {
		version: "1",
		step: 1,
		currentCard: mockCardA,
		ready: [],
		box1: [],
		box2: [],
		box3: [],
		box4: [mockCardA],
		box5: [mockCardB],
		box6: [],
		box7: [],
		retired: [],
	};

	const nextState = markCardCorrect(mockInitialState);

	expect(nextState.box5).toHaveLength(2);
});

test("markCardIncorrect moves the card to box1", () => {
	const mockCardA: Card = {
		id: "1",
		front: "f",
		back: "b",
		learningState: "box4",
	};
	const mockCardB: Card = {
		id: "2",
		front: "F",
		back: "B",
		learningState: "box5",
	};
	const mockInitialState: GameState = {
		version: "1",
		step: 1,
		currentCard: mockCardA,
		ready: [],
		box1: [],
		box2: [],
		box3: [],
		box4: [mockCardA],
		box5: [mockCardB],
		box6: [],
		box7: [],
		retired: [],
	};

	const nextState = markCardIncorrect(mockInitialState);

	expect(nextState.box1).toHaveLength(1);
});
