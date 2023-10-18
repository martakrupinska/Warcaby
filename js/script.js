function createDisc(classColor) {
	const disc = document.createElement('div');
	disc.classList.add('disc', 'disc--' + classColor);
	return disc;
}
const setPiecesOnBoard = () => {
	const boardPlaces = document.querySelectorAll('.board__square--dark');
	const places = Array.prototype.slice.call(boardPlaces);

	for (let i = 0; i <= places.length - 1; i++) {
		if (i < 12) {
			boardPlaces[i].appendChild(createDisc('white'));
		} else if (i >= places.length - 12) {
			boardPlaces[i].appendChild(createDisc('black'));
		}
	}
};

setPiecesOnBoard();
