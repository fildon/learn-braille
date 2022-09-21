import { getBoxKey } from "./boxSequencer";

export const initialCards: Array<Card> = [
	{ id: "01", front: "⠁", back: "A", learningState: "ready" },
	{ id: "02", front: "⠃", back: "B", learningState: "ready" },
	{ id: "03", front: "⠉", back: "C", learningState: "ready" },
	{ id: "04", front: "⠙", back: "D", learningState: "ready" },
	{ id: "05", front: "⠑", back: "E", learningState: "ready" },
	{ id: "06", front: "⠋", back: "F", learningState: "ready" },
	{ id: "07", front: "⠛", back: "G", learningState: "ready" },
	{ id: "08", front: "⠓", back: "H", learningState: "ready" },
	{ id: "09", front: "⠊", back: "I", learningState: "ready" },
	{ id: "10", front: "⠚", back: "J", learningState: "ready" },
	{ id: "11", front: "⠅", back: "K", learningState: "ready" },
	{ id: "12", front: "⠇", back: "L", learningState: "ready" },
	{ id: "13", front: "⠍", back: "M", learningState: "ready" },
	{ id: "14", front: "⠝", back: "N", learningState: "ready" },
	{ id: "15", front: "⠕", back: "O", learningState: "ready" },
	{ id: "16", front: "⠏", back: "P", learningState: "ready" },
	{ id: "17", front: "⠟", back: "Q", learningState: "ready" },
	{ id: "18", front: "⠗", back: "R", learningState: "ready" },
	{ id: "19", front: "⠎", back: "S", learningState: "ready" },
	{ id: "20", front: "⠞", back: "T", learningState: "ready" },
	{ id: "21", front: "⠥", back: "U", learningState: "ready" },
	{ id: "22", front: "⠧", back: "V", learningState: "ready" },
	{ id: "23", front: "⠺", back: "W", learningState: "ready" },
	{ id: "24", front: "⠭", back: "X", learningState: "ready" },
	{ id: "25", front: "⠽", back: "Y", learningState: "ready" },
	{ id: "26", front: "⠵", back: "Z", learningState: "ready" },
];

const isObj = (obj: unknown): obj is Record<PropertyKey, unknown> =>
	obj !== null && typeof obj === "object";

const isCard = (obj: unknown): obj is Card =>
	isObj(obj) &&
	typeof obj.id === "string" &&
	typeof obj.front === "string" &&
	typeof obj.back === "string" &&
	[
		"ready",
		...Array.from({ length: 7 }).map((_, i) => `box${i + 1}`),
		"retired",
	].includes(obj.learningState as string);

const isBox = (obj: unknown): obj is Array<Card> =>
	isObj(obj) && Array.isArray(obj) && obj.every((member) => isCard(member));

export const createBoxValidator =
	(getItem: Storage["getItem"]) => (boxKey: string) => {
		const storedBox = getItem(boxKey);
		if (storedBox === null) return false;
		try {
			const parsedBox: unknown = JSON.parse(storedBox);
			return isBox(parsedBox);
		} catch (_) {
			return false;
		}
	};

export const isStorageStateValid = (getItem: Storage["getItem"]) => {
	const storedStep = parseInt(getItem("step") ?? "");
	if (Number.isNaN(storedStep)) return false;

	const allBoxKeys = [
		"ready",
		...Array.from({ length: 7 }).map((_, i) => `box${i + 1}`),
		"retired",
	];

	const allBoxesValid = allBoxKeys.every(createBoxValidator(getItem));
	if (!allBoxesValid) return false;

	// There is an 'as' and non-null assertion in here, but it is safe so long as we trust the 'allBoxesValid' check above
	const allCards = allBoxKeys.flatMap(
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		(boxKey): unknown => JSON.parse(getItem(boxKey)!) as Array<Card>
	);

	// Could some cards go missing?
	if (allCards.length < initialCards.length) return false;

	return true;
};

/**
 * This is a total reset to initial state
 */
const resetAllStorage = (setItem: Storage["setItem"]) => {
	setItem("step", "1");
	setItem("ready", JSON.stringify(initialCards));
	const allNumberedBoxKeys = Array.from({ length: 7 }).map(
		(_, i) => `box${i + 1}`
	);
	allNumberedBoxKeys.forEach((boxKey) => setItem(boxKey, "[]"));
	setItem("retired", "[]");
};

export const buildStorage = ({
	getItem,
	setItem,
}: Pick<Storage, "getItem" | "setItem">) => {
	const getStep = () => {
		const storedStep = parseInt(getItem("step") ?? "");
		if (Number.isNaN(storedStep)) {
			setItem("step", "1");
			return 1;
		}
		return storedStep;
	};

	const getBox = (boxKey: Card["learningState"]) =>
		// Suppressed warning here, because we are in trusted territory
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		JSON.parse(getItem(boxKey)!) as Array<Card>;

	const getCurrentBox = () => {
		const storedStep = getStep();
		let workingStep = storedStep;
		const targetBoxKey = getBoxKey(workingStep);

		// There's a special case, if we want box 1, but it is empty
		// Then we try to pull in new cards from 'ready'
		if (targetBoxKey === "box1") {
			// TODO BUG! This pulls in cards too constantly, and never gives a chance for the box target to increase
			const box1 = getBox("box1");
			const ready = getBox("ready");

			if (box1.length === 0 && ready.length > 0) {
				// Let's try to take up to 5 ready cards
				// TODO let's pull 5 RANDOM cards
				const cardsToAdd = ready.slice(0, 5);
				cardsToAdd.forEach((cardToAdd) => setCardTo(cardToAdd, "box1"));
			}
		}

		// Another special case, if every card is in 'retired'
		// Then we just have to hand a retired card, no matter what
		const retiredBox = getBox("retired");
		if (retiredBox.length === initialCards.length) {
			return retiredBox;
		}

		// Otherwise in this case we know we have some cards available in numbered boxes
		let box = getBox(getBoxKey(workingStep));

		while (box.length === 0) {
			workingStep++;
			console.log({ try: getBoxKey(workingStep) });
			console.log({ box: getBox(getBoxKey(workingStep)) });
			box = getBox(getBoxKey(workingStep));
		}

		// This keeps the step counter sensibly rotating, rather than growing
		// The -1/+1 is to keep it running from 1-64 (rather than 0-63)
		workingStep = ((workingStep - 1) % 64) + 1;
		if (storedStep !== workingStep) setItem("step", workingStep.toString());

		return box;
	};

	const getCurrentCard = () => {
		if (!isStorageStateValid(getItem)) {
			resetAllStorage(setItem);
		}

		// TODO pull a RANDOM card
		return getCurrentBox()[0];
	};

	const setCardTo = (card: Card, target: Card["learningState"]) => {
		const currentBox = getBox(card.learningState);
		setItem(
			card.learningState,
			JSON.stringify(currentBox.filter(({ id }) => id !== card.id))
		);

		const targetBox = getBox(target);
		const updatedCard: Card = { ...card, learningState: target };
		setItem(target, JSON.stringify([...targetBox, updatedCard]));
	};

	return {
		getStep,
		getCurrentCard,
		setCardTo,
	};
};
