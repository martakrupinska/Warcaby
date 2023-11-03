import { getBoardElement } from './script.js';
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

	getColumnToMoveIsPossible() {
		const col_left = [];
		const col_right = [];
		const colNumber = this.getColNumber();
		const rowNumber = this.getRowNumber();

		let j = 1;
		while (j < boardPieces + 1) {
			if (j < colNumber) {
				col_left.push(colNumber - j);
			} else if (j > colNumber) {
				col_right.push(colNumber + (j - colNumber));
			}

			j++;
		}

		col_left.unshift(undefined);
		col_right.unshift(undefined);

		for (let f = 0; f <= rowRow.length; f++) {
			if (rowRow[f] < rowNumber) {
				col_left.unshift(colNumber - rowRow[f]);
				col_right.unshift(colNumber + rowRow[f]);
			}
		}

		return [col_left, col_right];
	}

	getIndexesOfPossibleSteps() {
		let indexes = [];
		const col_left = this.getColumnToMoveIsPossible()[0];
		const col_right = this.getColumnToMoveIsPossible()[1];

		for (let g = 1; g <= boardPieces; g++) {
			indexes[g] = [rowRow[g - 1], col_left[g - 1], col_right[g - 1]];
		}
		return indexes;
	}

	getQuantityOfColumnFromIndexesTable() {
		const index = this.getIndexesOfPossibleSteps();
		if (index.length > 0) {
			return parseInt(index[1].length) - 1;
		}
	}

	getFirstSteps() {
		const index = this.getIndexesOfPossibleSteps();
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
		const indexes = this.getIndexesOfPossibleSteps();
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
}
class Black extends Discs {
	constructor(HTMLelement) {
		super(HTMLelement), (this.color = 'black');
		this.enemyColor = 'white';
	}
	getForwardSteps(step) {
		return [step[1], step[3]];
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
}

export { Discs, White, Black };
