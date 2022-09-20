import { buildStorage } from "./storage";

jest.spyOn(console, "info").mockImplementation(() => {
	// deliberate no-op to silence during tests
});
jest.spyOn(console, "error").mockImplementation(() => {
	// deliberate no-op to silence during tests
});

test("initial build overwrites bad stored values", () => {
	const mockGetItem = jest.fn((key) => {
		// Missing value
		if (key === "box1") return null;
		// Unparseable
		if (key === "box2") return "This will not parse (]";
		// Valid parseable value... but not an array
		if (key === "box3") return "2";
		// Valid parseable array... but does not contain a card
		if (key === "box4") return "[{}]";
		return "";
	}) as jest.MockedFunction<Storage["getItem"]>;
	const mockSetItem = jest.fn();

	buildStorage({
		getItem: mockGetItem,
		setItem: mockSetItem,
	});

	expect(mockSetItem).toHaveBeenCalledWith("step", "1");
	expect(mockSetItem).toHaveBeenCalledWith("box1", "[]");
	expect(mockSetItem).toHaveBeenCalledWith("box2", "[]");
	expect(mockSetItem).toHaveBeenCalledWith("box3", "[]");
	expect(mockSetItem).toHaveBeenCalledWith("box4", "[]");
	expect(mockSetItem).toHaveBeenCalledWith("box5", "[]");
	expect(mockSetItem).toHaveBeenCalledWith("box6", "[]");
	expect(mockSetItem).toHaveBeenCalledWith("box7", "[]");
});

test("getStep retrieves step from local storage", () => {
	// Simulate missing step key
	const mockGetItem = jest.fn((_key) => null) as jest.MockedFunction<
		Storage["getItem"]
	>;

	const storage = buildStorage({
		getItem: mockGetItem,
		setItem: jest.fn(),
	});

	// These calls are made during validation as part of building
	expect(mockGetItem).toHaveBeenCalledTimes(8);

	const stepWhenMissingkey = storage.getStep();

	// Just one more is made during the call to `getStep`
	expect(mockGetItem).toHaveBeenCalledTimes(8 + 1);
	expect(mockGetItem).toHaveBeenCalledWith("step");
	expect(stepWhenMissingkey).toBe(1);

	// Now simulate the key being present
	mockGetItem.mockReturnValue("2");

	const stepWhenSet = storage.getStep();

	expect(mockGetItem).toHaveBeenCalledTimes(8 + 2);
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
		if (key === "box2") return null;
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

test("getCurrentCard recovers from broken boxes", () => {
	const mockGetItem = jest.fn() as jest.MockedFunction<Storage["getItem"]>;
	const mockSetItem = jest.fn();

	const storage = buildStorage({
		getItem: mockGetItem,
		setItem: mockSetItem,
	});

	const mockBox = JSON.stringify([
		{
			id: "1",
			front: "front",
			back: "back",
			learningState: 1,
		},
	]);
	mockGetItem.mockImplementation((key) => {
		if (key === "box1") return '["not a card in here"]';
		return mockBox;
	});

	storage.getCurrentCard();

	expect(mockSetItem).toHaveBeenCalledWith("box1", "[]");
});
