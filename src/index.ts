// As noted in `jest.config.ts` this file is the 'imperative shell'
// As such it will not be tested. Therefore it should have
// only the bare minimum of code in it.

const test = document.querySelector("button#test");
const wrong = document.querySelector("button#wrong");
const right = document.querySelector("button#right");

if (!test) throw new Error("Could not find main element");
if (!wrong) throw new Error("Could not find wrong element");
if (!right) throw new Error("Could not find right element");

const getFromLocalStorage = (key: string) => window.localStorage.getItem(key);
const setToLocalStorage = (key: string, value: string) =>
	window.localStorage.setItem(key, value);

type Card = {
	faces: [string, string];
	learningProgress: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
};

let cards: Array<Card> = [
	{ faces: ["⠁", "A"], learningProgress: 0 },
	{ faces: ["⠃", "B"], learningProgress: 0 },
	{ faces: ["⠉", "C"], learningProgress: 0 },
	{ faces: ["⠙", "D"], learningProgress: 0 },
	{ faces: ["⠑", "E"], learningProgress: 0 },
];

test.textContent = cards[0].faces[0];
test.addEventListener("click", () => {
	// Flip the card
	cards[0].faces.reverse()
	// Update the UI
	test.textContent = cards[0].faces[0];
});
wrong.addEventListener("click", () => {
	// Rotate cards
	const [head, ...tail] = cards;
	cards = [...tail, head];
	// Update the UI
	test.textContent = cards[0].faces[0];
});
right.addEventListener("click", () => {
	// Rotate cards
	const [head, ...tail] = cards;
	cards = [...tail, head];
	// Update the UI
	test.textContent = cards[0].faces[0];
});
