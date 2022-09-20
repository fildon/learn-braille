import { getBoxKey } from "./boxSequencer";

test("Sequences with binary frequencies", () => {
	expect(getBoxKey(1)).toBe(1);
	expect(getBoxKey(2)).toBe(2);
	expect(getBoxKey(3)).toBe(1);
	expect(getBoxKey(4)).toBe(3);
	expect(getBoxKey(5)).toBe(1);
	expect(getBoxKey(6)).toBe(2);
	expect(getBoxKey(7)).toBe(1);
	expect(getBoxKey(8)).toBe(4);
	expect(getBoxKey(9)).toBe(1);
	expect(getBoxKey(10)).toBe(2);
	expect(getBoxKey(11)).toBe(1);
	expect(getBoxKey(12)).toBe(3);
	expect(getBoxKey(13)).toBe(1);
	expect(getBoxKey(14)).toBe(2);
	expect(getBoxKey(15)).toBe(1);
	expect(getBoxKey(16)).toBe(5);
	expect(getBoxKey(17)).toBe(1);
	expect(getBoxKey(18)).toBe(2);
	expect(getBoxKey(19)).toBe(1);
	expect(getBoxKey(20)).toBe(3);
	//...
	expect(getBoxKey(32)).toBe(6);
	//...
	expect(getBoxKey(64)).toBe(7);
});
