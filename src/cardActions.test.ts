import { markCardCorrect, markCardIncorrect } from "./cardActions";

test("markCardCorrect sends the card up a box", () => {
	const mockCard1: Card = {
		id: "1",
		front: "front",
		back: "back",
		learningState: "box2",
	};

	const mockCard2: Card = {
		id: "2",
		front: "front2",
		back: "back2",
		learningState: "box2",
	};

	const mockSetCardTo = jest.fn();
	const mockGetCurrentCard = jest.fn().mockReturnValue(mockCard2);

	const actual = markCardCorrect(mockCard1, mockSetCardTo, mockGetCurrentCard);

	expect(mockSetCardTo).toHaveBeenCalledWith(mockCard1, "box3");

	expect(actual).toMatchObject(mockCard2);
});

test("markCardIncorrect sends the card back to the beginning", () => {
	const mockCard1: Card = {
		id: "1",
		front: "front",
		back: "back",
		learningState: "box2",
	};

	const mockCard2: Card = {
		id: "2",
		front: "front2",
		back: "back2",
		learningState: "box2",
	};

	const mockSetCardTo = jest.fn();
	const mockGetCurrentCard = jest.fn().mockReturnValue(mockCard2);

	const actual = markCardIncorrect(
		mockCard1,
		mockSetCardTo,
		mockGetCurrentCard
	);

	expect(mockSetCardTo).toHaveBeenCalledWith(mockCard1, "box1");

	expect(actual).toMatchObject(mockCard2);
});
