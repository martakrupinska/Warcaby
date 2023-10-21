import { createHint } from './script.js';
class Discs {
	constructor(HTMLelement) {
		this.HTMLelement = HTMLelement;
	}

	getRowNumber() {
		const row = this.HTMLelement.closest('tr');
		const rowNumber = row.childNodes[1].textContent;
		return parseInt(rowNumber);
	}
	getColNumber() {
		const row = this.HTMLelement.closest('tr');
		const col = Array.prototype.slice.call(row.querySelectorAll('td'));

		return parseInt(col.indexOf(this.HTMLelement.parentElement));
	}
	getCountOfHints() {
		/* czy dwie czy jedna ?? */
	}
}

class White extends Discs {
	constructor(HTMLelement) {
		super(HTMLelement);
	}
	findHintElements() {
		const hintLeft = getBoardElement(
			this.getRowNumber(),
			this.getColNumber() - 2
		);
		const hintRight = getBoardElement(this.getRowNumber(), this.getColNumber());

		return [hintLeft, hintRight].filter(function (hint) {
			return hint !== undefined;
		});
	}
}
class Black extends Discs {
	constructor(HTMLelement) {
		super(HTMLelement);
	}
	findHintElements() {
		const hintLeft = getBoardElement(
			this.getRowNumber() - 2,
			this.getColNumber() - 2
		);
		const hintRight = getBoardElement(
			this.getRowNumber() - 2,
			this.getColNumber()
		);

		return [hintLeft, hintRight].filter(function (hint) {
			return hint !== undefined;
		});
	}
}

let hints;

function getBoardElement(row, col) {
	const allColumn = document.querySelectorAll('.board__square');
	const index = row * 8 + col;

	console.log(allColumn[index]);

	if (allColumn[index].classList.contains('board__square--dark')) {
		return allColumn[index];
	}
}

const discs = document.querySelectorAll('.disc');

function checkIfMoveIsPossible(disc) {}

function showPossibleMoves() {
	let disc;

	const activeDisc = document.querySelector('.disc:active');
	if (!activeDisc) {
		return false;
	}

	if (activeDisc.classList.contains('disc--white')) {
		disc = new White(activeDisc);
	} else if (activeDisc.classList.contains('disc--black')) {
		disc = new Black(activeDisc);
	}

	const hints = disc.findHintElements();
	if (hints) {
		createHint(hints);
	}
}

function removePossibleMoves() {
	const hints = document.querySelectorAll('.hint');
	hints.forEach((hint) => {
		hint.parentNode.removeChild(hint);
	});
}

discs.forEach((disc) => {
	disc.addEventListener('mouseenter', showPossibleMoves, false);
	disc.addEventListener('mouseleave', removePossibleMoves, false);
});
