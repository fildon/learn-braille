/**
 * Each time we clear a box, we take a 'step' and
 * visit the next box. Since some boxes must be
 * visited more often than others, the ordering is not intuitive
 */
export const getBoxKey = (step: number) => {
	/**
	 * Implementation notes:
	 * This simulates a rising binary pyramid of frequencies.
	 * i.e. it starts at 1, and only gradually adds new values.
	 * Each successive value appears a half as often as the previous.
	 */
	if (step % 2 === 1) return 1;
	if (step % 4 === 2) return 2;
	if (step % 8 === 4) return 3;
	if (step % 16 === 8) return 4;
	if (step % 32 === 16) return 5;
	if (step % 64 === 32) return 6;
	return 7;
};
