import {
	initialCards,
	buildStorage,
	createBoxValidator,
	isStorageStateValid,
} from "./storage";

test("getStep retrieves step from local storage", () => {
	// Simulate missing step key
	const mockGetItem = jest.fn((_key) => null) as jest.MockedFunction<
		Storage["getItem"]
	>;

	const storage = buildStorage({
		getItem: mockGetItem,
		setItem: jest.fn(),
	});

	const stepWhenMissingkey = storage.getStep();

	expect(mockGetItem).toHaveBeenCalledTimes(1);
	expect(mockGetItem).toHaveBeenCalledWith("step");
	expect(stepWhenMissingkey).toBe(1);

	// Now simulate the key being present
	mockGetItem.mockReturnValue("2");

	const stepWhenSet = storage.getStep();

	expect(mockGetItem).toHaveBeenCalledTimes(2);
	expect(stepWhenSet).toBe(2);
});

test("getCurrentCard returns first card in first box", () => {
	const mockBox = JSON.stringify([
		{ id: "1", front: "front", back: "back", learningState: 1 },
	]);
	const mockGetItem = jest.fn((key) => {
		// Simulate 'step' being missing
		if (key === "step") return null;
		return mockBox;
	}) as jest.MockedFunction<Storage["getItem"]>;
	const mockSetItem = jest.fn() as jest.MockedFunction<Storage["setItem"]>;

	const storage = buildStorage({
		getItem: mockGetItem,
		setItem: mockSetItem,
	});

	const actual = storage.getCurrentCard();

	expect(mockSetItem).toHaveBeenCalledWith("step", "1");
	expect(mockGetItem).toHaveBeenCalledWith("box1");
	expect(actual.front).toBe("front");
});

test("getCurrentCard checks later boxes if current is empty", () => {
	const mockState = JSON.stringify([
		{ id: "1", front: "front", back: "back", learningState: 1 },
	]);
	const mockGetItem = jest.fn((key) => {
		if (key === "step") return "1";
		if (key === "box1") return "[]";
		if (key === "box2") return "[]";
		return mockState;
	}) as jest.MockedFunction<Storage["getItem"]>;
	const mockSetItem = jest.fn() as jest.MockedFunction<Storage["setItem"]>;
	const storage = buildStorage({
		getItem: mockGetItem,
		setItem: mockSetItem,
	});

	storage.getCurrentCard();

	// expect(mockGetItem).toHaveBeenCalledTimes(4);
	expect(mockGetItem).toHaveBeenCalledWith("step");
	expect(mockGetItem).toHaveBeenCalledWith("box1");
	expect(mockGetItem).toHaveBeenCalledWith("box2");
	expect(mockGetItem).toHaveBeenCalledWith("box3");
	expect(mockSetItem).toHaveBeenCalledWith("step", "4");
});

test("isStoredBoxValid rejects null boxes", () => {
	const mockGetItem = jest.fn().mockReturnValue(null);
	const boxValidator = createBoxValidator(mockGetItem);
	expect(boxValidator("box1")).toBe(false);
});

test("isStoredBoxValid rejects unparseable boxes", () => {
	const mockGetItem = jest.fn().mockReturnValue("unparseable(]");
	const boxValidator = createBoxValidator(mockGetItem);
	expect(boxValidator("box1")).toBe(false);
});

test("isStorageStateValid rejects if one box is bad", () => {
	const mockGetItem = jest.fn((key) => {
		if (key === "step") return "1";
	}) as jest.MockedFunction<Storage["getItem"]>;

	expect(isStorageStateValid(mockGetItem)).toBe(false);
});

test("isStorageStateValid rejects if there are missing cards", () => {
	const mockBox = "[]";
	const mockGetItem = jest.fn((key) => {
		if (key === "step") return "1";
		return mockBox;
	}) as jest.MockedFunction<Storage["getItem"]>;

	expect(isStorageStateValid(mockGetItem)).toBe(false);
});

test("isStorageStateValid accepts healthy storage state", () => {
	const mockGetItem = jest.fn((key) => {
		if (key === "step") return "1";
		if (key === "ready") {
			return JSON.stringify(initialCards);
		}
		return "[]";
	}) as jest.MockedFunction<Storage["getItem"]>;

	expect(isStorageStateValid(mockGetItem)).toBe(true);
});
