import { getBoxKey } from "./boxSequencer";

const initialCards: Array<Card> = [
	{ id: "1", front: "⠁", back: "A", learningState: "ready" },
	{ id: "2", front: "⠃", back: "B", learningState: "ready" },
	{ id: "3", front: "⠉", back: "C", learningState: "ready" },
	{ id: "4", front: "⠙", back: "D", learningState: "ready" },
	{ id: "5", front: "⠑", back: "E", learningState: "ready" },
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
		...Array.from({ length: 7 }).map((_, i) => i + 1),
		"retired",
	].includes(obj.learningState as string | number);

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

	const getBox = (boxKey: 1 | 2 | 3 | 4 | 5 | 6 | 7) =>
		// Suppressed warning here, because we are in trusted territory
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		JSON.parse(getItem(`box${boxKey}`)!) as Array<Card>;

	const getCurrentBox = () => {
		const storedStep = getStep();
		let workingStep = storedStep;
		let box = getBox(getBoxKey(workingStep));

		// TODO if we wanted box 1 but it is empty, then we should first try to pull in some 'ready' cards
		while (box.length === 0) {
			// TODO risk of infinite loop if all numbered boxes are empty
			// TODO what if there are only cards in retired?
			workingStep++;
			box = getBox(getBoxKey(workingStep));
		}

		// TODO modulo the step count at some point
		if (storedStep !== workingStep) setItem("step", workingStep.toString());

		return box;
	};

	const getCurrentCard = () => {
		if (!isStorageStateValid(getItem)) {
			resetAllStorage(setItem);
		}

		return getCurrentBox()[0];
	};

	return {
		getStep,
		getCurrentCard,
	};
};
