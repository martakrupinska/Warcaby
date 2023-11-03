import { getBoardElement } from './script.js';
import { isSquareEmpty, squareIsOccupiedByEnemy } from './actions.js';
const boardPieces = 8;
const rowRow = [1, 2, 3, 4, 5, 6, 7, 8];
const colCol = [1, 2, 3, 4, 5, 6, 7, 8];

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

	getSteps() {
		const col_min = [];
		const col_max = [];
		const colNumber = this.getColNumber();
		const rowNumber = this.getRowNumber();

		let j = 1;
		while (j < this.getMaxColumnNumber()) {
			if (j < colNumber) {
				col_min.push(colNumber - j);
			} else if (j > colNumber) {
				col_max.push(colNumber + (j - colNumber));
			}

			j++;
		}

		col_min.unshift(undefined);
		col_max.unshift(undefined);

		for (let f = 0; f <= rowRow.length; f++) {
			if (rowRow[f] < rowNumber) {
				col_min.unshift(colNumber - rowRow[f]);
				col_max.unshift(colNumber + rowRow[f]);
			}
		}
		return [col_min, col_max];
	}

	getMaxColumnNumber() {
		return boardPieces + 1;
	}

	getIndexesOfStep() {
		let indexes = [];
		const col_min = this.getSteps()[0];
		const col_max = this.getSteps()[1];

		for (let g = 1; g <= boardPieces; g++) {
			indexes[g] = [rowRow[g - 1], col_min[g - 1], col_max[g - 1]];
		}
		return indexes;
	}

	getQuantityOfColumnFromIndexesTable() {
		const index = this.getIndexesOfStep();
		if (index.length > 0) {
			return parseInt(index[1].length) - 1;
		}
	}

	getFirstStep() {
		const index = this.getIndexesOfStep();
		const columnNumber = this.getQuantityOfColumnFromIndexesTable();
		const rowNumber = this.getForwardAndStepBackRowNumberToStep();
		let firstStep = [];
		let indexOfFirsSteps = [];

		for (let j = 1; j <= columnNumber; j++) {
			if (index[rowNumber.stepBack][0] && index[rowNumber.stepBack][j]) {
				firstStep.push(
					getBoardElement(
						index[rowNumber.stepBack][0],
						index[rowNumber.stepBack][j]
					)
				);
				indexOfFirsSteps.push([
					index[rowNumber.stepBack][0],
					index[rowNumber.stepBack][j],
				]);
			}
			if (index[rowNumber.forward][0] && index[rowNumber.forward][j]) {
				firstStep.push(
					getBoardElement(
						index[rowNumber.forward][0],
						index[rowNumber.forward][j]
					)
				);
				indexOfFirsSteps.push([
					index[rowNumber.forward][0],
					index[rowNumber.forward][j],
				]);
			}
		}
		return [firstStep, indexOfFirsSteps];
	}

	getColId(row, col) {
		const indexes = this.getIndexesOfStep();
		let columnId;

		indexes.forEach((x) => {
			if (x[0] === row) {
				columnId = x.indexOf(col);
			}
		});
		return columnId;
	}
}

class White extends Discs {
	constructor(HTMLelement) {
		super(HTMLelement), (this.color = 'white');
		this.enemyColor = 'black';
	}

	getForwardSteps(step) {
		return [step[1], step[3]];
	}
	getForwardAndStepBackRowNumberToStep() {
		const rowNumber = this.getRowNumber();

		let forward = rowNumber + 1;
		let back = rowNumber - 1;

		if (rowNumber === rowRow[0]) {
			back = null;
		} else if (rowNumber === rowRow[rowRow.length - 1]) {
			forward = null;
		}
		console.log(forward, back);
		return { forward: forward, stepBack: back };
	}

	/* 	findMaxRowNumber() {
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
	} */
}
class Black extends Discs {
	constructor(HTMLelement) {
		super(HTMLelement), (this.color = 'black');
		this.enemyColor = 'white';
	}
	getForwardSteps(step) {
		return [step[0], step[2]];
	}

	getForwardAndStepBackRowNumberToStep() {
		const rowNumber = this.getRowNumber();

		let forward = rowNumber - 1;
		let back = rowNumber + 1;

		if (rowNumber === rowRow[0]) {
			forward = null;
		} else if (rowNumber === rowRow[rowRow.length - 1]) {
			back = null;
		}
		return { forward: forward, stepBack: back };
	}

	/* 	findMaxRowNumber() {
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
	} */
}

export { Discs, White, Black };
