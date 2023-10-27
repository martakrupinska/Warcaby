import { createHint } from './script.js';
let boardPieces = 8;
let dragged;

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

	findNextStep() {
		const index = this.findIndexesOfStep();
		let placesToMove = [];

		for (let j = 1; j <= 2; j++) {
			if (index[0][j] === undefined) {
				continue;
			}
			const oneStep = getBoardElement(index[0][0], index[0][j]);
			if (isSquareEmpty(oneStep)) {
				placesToMove.push(oneStep);
			} else if (squareIsOccupiedByEnemy(oneStep, this.enemyColor)) {
				for (let i = 1; i < index.length; i++) {
					if (index[i][j] === undefined) {
						break;
					}
					let steps = getBoardElement(index[i][0], index[i][j]);
					if (isSquareEmpty(steps)) {
						placesToMove.push(steps);
						break;
					}
				}
			}
		}
		return placesToMove;
	}
	createNextStep() {
		const steps = this.findNextStep();

		steps.forEach((step) => {
			createHint(step);
		});
	}
}

class White extends Discs {
	constructor(HTMLelement) {
		super(HTMLelement), (this.color = 'white');
		this.enemyColor = 'black';
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
		super(HTMLelement), (this.color = 'black');
		this.enemyColor = 'white';
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
	const allColumn = document.querySelectorAll('tr .board__square');
	const index = (row - 1) * boardPieces + (col - 1);

	if (allColumn[index].classList.contains('board__square--dark')) {
		return allColumn[index];
	}
	return allColumn[index];
}

const isSquareEmpty = (square) => {
	if (!square) {
		return false;
	}
	return !square.children.length;
};

const squareIsOccupiedByEnemy = (square, enemyColor) => {
	if (!square) {
		return false;
	}
	return square.children.item(0).classList.contains('disc--' + enemyColor);
};

const discs = document.querySelectorAll('.disc');
const darkSquares = document.querySelectorAll('.board__square--dark');

function createObjectDisc(e) {
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

	return disc;
}

function showPossibleMoves(e) {
	const disc = createObjectDisc(e);
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

function chooseDiscToMove(e) {
	removePossibleMoves();
	dragged = createObjectDisc(e);
	showPossibleMoves(e);
}

function moveDisc(e) {
	
	if (e.target.classList.contains('disc')) {
		return false;
	}
	const target = e.target.closest('.board__square--dark');
	if (!target.children.length) {
		return false;
	}
	removePossibleMoves();

	const indexes = dragged.findNextStep();
	if (!indexes) {
		removePossibleMoves();
		return false;
	}

	if (indexes.includes(target)) {
		dragged.HTMLelement.parentNode.removeChild(dragged.HTMLelement);
		target.appendChild(dragged.HTMLelement);
	}
}

discs.forEach((disc) => {
	//disc.addEventListener('dragstart', chooseDiscToMove);
	disc.addEventListener('click', chooseDiscToMove);
});

darkSquares.forEach((square) => {
	square.addEventListener('click', moveDisc);
	//	square.addEventListener('dragover', changeStateOfDisc);
	//square.addEventListener('drop', moveDisc);
});
