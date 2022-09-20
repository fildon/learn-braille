import { getBoxKey } from "./boxSequencer";

test("Sequences with binary frequencies", () => {
	expect(getBoxKey(1)).toBe("box1");
	expect(getBoxKey(2)).toBe("box2");
	expect(getBoxKey(3)).toBe("box1");
	expect(getBoxKey(4)).toBe("box3");
	expect(getBoxKey(5)).toBe("box1");
	expect(getBoxKey(6)).toBe("box2");
	expect(getBoxKey(7)).toBe("box1");
	expect(getBoxKey(8)).toBe("box4");
	expect(getBoxKey(9)).toBe("box1");
	expect(getBoxKey(10)).toBe("box2");
	expect(getBoxKey(11)).toBe("box1");
	expect(getBoxKey(12)).toBe("box3");
	expect(getBoxKey(13)).toBe("box1");
	expect(getBoxKey(14)).toBe("box2");
	expect(getBoxKey(15)).toBe("box1");
	expect(getBoxKey(16)).toBe("box5");
	expect(getBoxKey(17)).toBe("box1");
	expect(getBoxKey(18)).toBe("box2");
	expect(getBoxKey(19)).toBe("box1");
	expect(getBoxKey(20)).toBe("box3");
	//...
	expect(getBoxKey(32)).toBe("box6");
	//...
	expect(getBoxKey(64)).toBe("box7");
});
