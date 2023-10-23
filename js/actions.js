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
	findMaxColumnNumber() {
		return boardPieces + 1;
	}
	findColumnIndexes() {
		const col_min = [];
		const col_max = [];
		const maxColNumber = this.findMaxColumnNumber();

		let j = 1;
		while (j < maxColNumber) {
			if (j < this.getColNumber()) {
				col_min.push(this.getColNumber() - j);
			} else if (j > this.getColNumber()) {
				col_max.push(this.getColNumber() + (j - this.getColNumber()));
			}

			j++;
		}
		return [col_min, col_max];
	}

	findIndexesOfStep() {
		const indexes = [];
		const row = this.findRowIndexes();
		const col_min = this.findColumnIndexes()[0];
		const col_max = this.findColumnIndexes()[1];

		for (let g = 0; g < this.findMaxRowNumber(); g++) {
			indexes[g] = [row[g], col_min[g], col_max[g]];
		}
		return indexes;
	}
	createNextStep() {
		const index = this.findIndexesOfStep();

		for (let j = 1; j <= 2; j++) {
			if (index[0][j] === undefined) {
				continue;
			}
			const oneStep = getBoardElement(index[0][0], index[0][j]);
			if (this.squareIsEmpty(oneStep)) {
				createHint(oneStep);
			} else if (this.squareIsNotEmpty(oneStep, this.getEnemyColor())) {
				for (let i = 1; i < index.length; i++) {
					if (index[i][j] === undefined) {
						break;
					}
					let steps = getBoardElement(index[i][0], index[i][j]);
					if (this.squareIsEmpty(steps)) {
						createHint(steps);
						break;
					}
				}
			}
		}
	}
}

class White extends Discs {
	constructor(HTMLelement) {
		super(HTMLelement);
	}
	getEnemyColor() {
		return 'black';
	}
	findMaxRowNumber() {
		return boardPieces - this.getRowNumber();
	}
	findRowIndexes() {
		let i = 1;
		const row = [];

		while (i <= this.findMaxRowNumber()) {
			row.push(this.getRowNumber() + i);
			i++;
		}
		return row;
	}
}
class Black extends Discs {
	constructor(HTMLelement) {
		super(HTMLelement);
	}
	getEnemyColor() {
		return 'white';
	}
	findMaxRowNumber() {
		return boardPieces - (boardPieces - this.getRowNumber() + 1);
	}
	findRowIndexes() {
		let i = 1;
		const row = [];

		while (i <= this.findMaxRowNumber()) {
			row.push(this.getRowNumber() - i);
			i++;
		}
		return row;
	}
}


function getBoardElement(row, col) {
	const allColumn = document.querySelectorAll('.board__square');
	const index = (row - 1) * boardPieces + (col - 1);

	if (allColumn[index].classList.contains('board__square--dark')) {
		return allColumn[index];
	}
	return allColumn[index];
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
		disc.createNextStep();
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