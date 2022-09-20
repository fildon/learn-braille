import { buildStorage } from "./storage";

describe("getState", () => {
	it("retrieves current state", () => {
		const mockState: LearningState = {
			ready: [["a", "b"]],
			boxes: [[["c", "d"]], [], [], [], [], [], []],
			retired: [["e", "f"]],
		};
		const mockGetItem = jest.fn((_key) =>
			JSON.stringify(mockState)
		) as jest.MockedFunction<Storage["getItem"]>;
		const mockSetItem = jest.fn() as jest.MockedFunction<Storage["setItem"]>;

		const storage = buildStorage({
			getItem: mockGetItem,
			setItem: mockSetItem,
		});

		const {
			ready,
			boxes: [firstBox],
			retired,
		} = storage.getState();

		expect(mockSetItem).not.toHaveBeenCalled();
		expect(ready).toEqual(expect.arrayContaining([["a", "b"]]));
		expect(firstBox).toEqual(expect.arrayContaining([["c", "d"]]));
		expect(retired).toEqual(expect.arrayContaining([["e", "f"]]));
	});

	it("creates new state if none already", () => {
		const mockGetItem = jest.fn((_key) => null) as jest.MockedFunction<
			Storage["getItem"]
		>;
		const mockSetItem = jest.fn() as jest.MockedFunction<Storage["setItem"]>;

		const storage = buildStorage({
			getItem: mockGetItem,
			setItem: mockSetItem,
		});

		storage.getState();

		expect(mockGetItem).toHaveBeenCalledWith("learning");
		expect(mockSetItem).toHaveBeenCalled();
	});
});

describe("setState", () => {
	it("persists state to storage", () => {
		let mockStoredState: string | null = null;
		const mockSetItem = jest.fn((_key: string, value: string) => {
			mockStoredState = value;
		}) as jest.MockedFunction<Storage["setItem"]>;
		const storage = buildStorage({
			getItem: (_key) => mockStoredState,
			setItem: mockSetItem,
		});

		storage.setState({
			ready: [],
			boxes: [[], [], [], [], [], [], []],
			retired: [],
		});

		expect(mockSetItem).toHaveBeenCalled();

		const retrievedState = storage.getState();

		expect(retrievedState.ready).toHaveLength(0);
		expect(retrievedState.retired).toHaveLength(0);
	});
});
