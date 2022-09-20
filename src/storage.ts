import { getBoxKey } from "./boxSequencer";

// TODO
const initialCards = [
	["⠁", "A"],
	["⠃", "B"],
	["⠉", "C"],
	["⠙", "D"],
	["⠑", "E"],
];

const isObj = (obj: unknown): obj is Record<PropertyKey, unknown> =>
	obj !== null && typeof obj === "object";

const isCard = (obj: unknown): obj is Card =>
	isObj(obj) &&
	typeof obj.id === "string" &&
	typeof obj.front === "string" &&
	typeof obj.back === "string" &&
	Array.from({ length: 7 })
		.map((_, i) => i + 1)
		.includes(obj.learningState as number);

const isBox = (obj: unknown): obj is Array<Card> =>
	isObj(obj) && Array.isArray(obj) && obj.every((member) => isCard(member));

const validateCurrentStorageKeys = ({
	getItem,
	setItem,
}: Pick<Storage, "getItem" | "setItem">) => {
	const storedStep = parseInt(getItem("step") ?? "");
	if (Number.isNaN(storedStep)) setItem("step", "1");
	Array.from({ length: 7 })
		.map((_, i) => `box${i + 1}`)
		.forEach((boxKey) => {
			const storedBox = getItem(boxKey);
			if (storedBox === null) {
				setItem(boxKey, "[]");
				return;
			}
			try {
				const parsedBox: unknown = JSON.parse(storedBox);
				if (!Array.isArray(parsedBox))
					throw new Error("Non-array in storage key");
				parsedBox.forEach((card) => {
					if (!isCard(card))
						throw new Error("Unrecognised contents of storage key");
				});
			} catch (_) {
				console.error(
					`Could not parse contents of localStorage key: ${boxKey}.`
				);
				console.info(
					`We will recover by resetting to empty array. You may have lost progress... sorry!`
				);
				setItem(boxKey, "[]");
			}
		});
};

export const buildStorage = ({
	getItem,
	setItem,
}: Pick<Storage, "getItem" | "setItem">) => {
	validateCurrentStorageKeys({ getItem, setItem });

	const getStep = () => {
		const storedStep = parseInt(getItem("step") ?? "");
		if (Number.isNaN(storedStep)) {
			setItem("step", "1");
			return 1;
		}
		return storedStep;
	};

	const getBox = (boxKey: 1 | 2 | 3 | 4 | 5 | 6 | 7) => {
		const storedValue = getItem(`box${boxKey}`);

		if (!storedValue) return [];

		try {
			const parsedBox: unknown = JSON.parse(storedValue);
			if (!isBox(parsedBox)) throw new Error("bad contents of localStorage");
			return parsedBox;
		} catch (error) {
			console.error(error);
			console.info(`recovering from bad data in key: box${boxKey}`);
			setItem(`box${boxKey}`, "[]");
			return [];
		}
	};

	const getCurrentBox = () => {
		const storedStep = getStep();
		let workingStep = storedStep;
		let box = getBox(getBoxKey(workingStep));

		// TODO if box 1 is empty pull in ready cards
		while (box.length === 0) {
			// TODO risk of infinite loop if all boxes are empty
			workingStep++;
			box = getBox(getBoxKey(workingStep));
		}

		// TODO modulo the step at some point
		if (storedStep !== workingStep) setItem("step", workingStep.toString());

		return box;
	};

	const getCurrentCard = () => getCurrentBox()[0];

	return {
		getStep,
		getCurrentCard,
	};
};
