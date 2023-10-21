let numberOfDiscs = 12;
function createDisc(classColor) {
	const disc = document.createElement('div');
	disc.classList.add('disc', 'disc--' + classColor);
	return disc;
}

const setPiecesOnBoard = () => {
	const boardPlaces = document.querySelectorAll('.board__square--dark');
	const places = Array.prototype.slice.call(boardPlaces);

	for (let i = 0; i <= places.length - 1; i++) {
		if (i < numberOfDiscs) {
			boardPlaces[i].appendChild(createDisc('white'));
		} else if (i >= places.length - numberOfDiscs) {
			boardPlaces[i].appendChild(createDisc('black'));
		}
	}
};
function createHint(parents) {
//	let hints = [];

	parents.forEach((parent) => {
		const hint = document.createElement('div');
		hint.classList.add('hint');
		parent.appendChild(hint);

		//	hints.push(hint);
	});

	//	return hints;
}

setPiecesOnBoard();
export { createHint };
/* let numberOfDiscs = 12;
function createDisc(classColor) {
	const disc = document.createElement('div');
	disc.classList.add('disc', 'disc--' + classColor);
	return disc;
}
const setPiecesOnBoard = () => {
	const boardPlaces = document.querySelectorAll('.board__square--dark');
	const places = Array.prototype.slice.call(boardPlaces);

	for (let i = 0; i <= places.length - 1; i++) {
		if (i < numberOfDiscs) {
			boardPlaces[i].appendChild(createDisc('white'));
		} else if (i >= places.length - numberOfDiscs) {
			boardPlaces[i].appendChild(createDisc('black'));
		}
	}
};

function createHint(parent) {
	const hint = document.createElement('div');
	hint.classList.add('hint');
	parent.appendChild(hint);

	return hint;
}
setPiecesOnBoard();

export { createHint }; */
