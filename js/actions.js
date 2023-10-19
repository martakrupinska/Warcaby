function getBoardElement(row, col) {
	/* let table = [];
	const allRows = document.querySelectorAll('tr');
	const allColumn = document.querySelectorAll('.board__dscrpt--col'); */
	const allElements = Array.prototype.slice.call(
		document.querySelectorAll('.board__square')
	);

	// const index =
	const index = row * 8 + col;

	//console.log(row, (row - 1) * 8, col - 1);
	console.log(index, allElements[index]);

	/* for (let i = 0; i < allRows.length - 1; i++) {
		table[i] = [];
		for (let j = 0; j < allColumn.length; j++) {
			table[i][j] = j;
		}
	} */
	return allElements[index];
}
//getBoardElement(2, 5);
const discs = document.querySelectorAll('.disc');

function showPossibleMoves() {
	const activeDisc = document.querySelector('.disc:active');

	if (!activeDisc) {
		return;
	}

	const row = activeDisc.closest('tr');
	const col = Array.prototype.slice.call(row.querySelectorAll('td'));

	const rowNumber = row.childNodes[1].textContent;
	const colNumber = col.indexOf(activeDisc.parentElement);

	//board__square

	console.log(rowNumber, colNumber);

	const hintLeft = getBoardElement(
		parseInt(rowNumber),
		parseInt(colNumber) - 2
	);
	const hintRight = getBoardElement(parseInt(rowNumber), parseInt(colNumber));
	console.log('hint1 ' + hintLeft);
}

discs.forEach((disc) => {
	disc.addEventListener('click', showPossibleMoves);
});
