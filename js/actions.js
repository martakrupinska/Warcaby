import { createHint } from './script.js';
let boardPieces = 8;
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
	squareIsEmpty(step) {
		if (step && step.children.length === 0) {
			return true;
		} else {
			return false;
		}
	}
	squareIsNotEmpty(step, className) {
		if (
			step &&
			step.children.item(0).classList.contains('disc--' + className)
		) {
			return true;
		} else {
			return false;
		}
	}
}

class White extends Discs {
	constructor(HTMLelement) {
		super(HTMLelement);
	}

	findRowIndexesOfStep() {
		let i = 1;
		const row = [];
		const maxRowNumber = boardPieces - this.getRowNumber();
		//const column = [];
		while (i <= maxRowNumber) {
			row.push(this.getRowNumber() + i);
			i++;
		}
		console.log(row);

		const col_min = [];
		const col_max = [];
		const maxColNumber = boardPieces + 1;

		let j = 1;
		while (j < maxColNumber) {
			if (j < this.getColNumber()) {
				col_min.push(this.getColNumber() - j);
			} else if (j > this.getColNumber()) {
				col_max.push(this.getColNumber() + (j - this.getColNumber()));
			}

			j++;
		}
		console.log(col_max, col_min);
		const indexes = [];

		let k = 1;
		for (let g = 0; g < maxRowNumber; g++) {
			indexes[g] = [row[g], col_min[g], col_max[g]];
		}

		/* for (let k = 0; k < maxRowNumber; k++) {
			indexes[k] = [col_min.length[k]];
			for (let g = 0; g < col_min.length; g++) {
				indexes[k][g] = [row[g], col_min[g], col_max[g]];
			}
		} */
		console.log(indexes[0]);
	}
	findNextStep() {
		this.findRowIndexesOfStep();
		//let hints;
		const firstStep = getBoardElement(
			this.getRowNumber(),
			this.getColNumber() - 2
		);
		if (this.squareIsEmpty(firstStep)) {
			createHint(firstStep);
		} else if (this.squareIsNotEmpty(firstStep, 'white')) {
			const firstStepNext = getBoardElement(
				this.getRowNumber() + 1,
				this.getColNumber() - 3
			);
			console.log(firstStepNext);
			if (this.squareIsEmpty(firstStepNext)) {
				createHint(firstStepNext);
			}
		}
	}
	findHintElements() {
		this.findNextStep();
		const hintLeft = getBoardElement(
			this.getRowNumber(),
			this.getColNumber() - 2
		);
		console.log(hintLeft);
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
	const index = row * boardPieces + col;

	if (allColumn[index].classList.contains('board__square--dark')) {
		return allColumn[index];
	}
}

const discs = document.querySelectorAll('.disc');

function showPossibleMoves(e) {
	let disc;

	const activeDisc = e.target;

	if (!activeDisc) {
		return false;
	}

	if (activeDisc.classList.contains('disc--white')) {
		disc = new White(activeDisc);
	} else if (activeDisc.classList.contains('disc--black')) {
		disc = new Black(activeDisc);
	}

	if (disc) {
		disc.findNextStep();
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
