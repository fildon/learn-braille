/**
 * A card represents a single learning card
 */
type Card = {
	/**
	 * Unique ID
	 */
	id: string;
	/**
	 * The front face of the card
	 */
	front: string;
	/**
	 * The back face of the card
	 */
	back: string;
	/**
	 * 0: This card is not yet in rotation
	 * 1-7: This card is in the number leitner box
	 * 8: This card is retired
	 */
	learningState: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
};
