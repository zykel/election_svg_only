import { range } from 'd3-array';

export const delay = (visType, visTypePrev, visTypesArray) => {
	return !visTypesArray.includes(visTypePrev) && visTypesArray.includes(visType);
};

export const delayPercentageRects = (visType, visTypePrev) => {
	return visTypePrev !== 'percentages' && visType === 'percentages';
};

export const normalizeName = (name) => {
	let nameTransformed = name
		.toLowerCase()
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

	nameTransformed = nameTransformed
		.split("'")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join("'");

	nameTransformed = nameTransformed
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('-');

	nameTransformed = nameTransformed
		.split('Mc')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('Mc');

	nameTransformed = nameTransformed
		.split('Mac')
		.map((word, i) => (i > 0 ? ' ' : '') + word.charAt(0).toUpperCase() + word.slice(1))
		.join('Mac');

	return nameTransformed;
};

export const getPositions = (mapWidth, mapHeight) => {
	const nrSeatsPerRow = {
		0: 29,
		1: 33,
		2: 36,
		3: 37,
		4: 39
	};
	const nrSeatsStraightSide = 8;

	const rows = Object.keys(nrSeatsPerRow);
	const nrSeatsPerRowCurved = rows.map((row) => nrSeatsPerRow[row] - 2 * nrSeatsStraightSide);

	const rowDistance = 25;

	const getPositionsArray = (row) => {
		const r = 100 + rowDistance * row;
		const nrSeatsCurved = nrSeatsPerRowCurved[row];
		const positionsCurved = range(nrSeatsCurved).map((seatNr) => {
			const angle = (seatNr / (nrSeatsCurved - 1)) * Math.PI - Math.PI;
			const x = mapWidth / 2 + r * Math.cos(angle);
			const y = mapHeight * 0.42 + r * Math.sin(angle);
			return { seatNr, x, y, angle, row };
		});
		const yOffset = rowDistance;
		const positionsStraightLeft = range(nrSeatsStraightSide).map((seatNr) => {
			const x = positionsCurved[0].x;
			const y = positionsCurved[0].y + yOffset * (seatNr + 1);
			// Just for ordering purposes
			const angle = -Math.PI - (1 + seatNr + 0.1 * row);
			return { seatNr, x, y, angle, row };
		});
		const positionsStraightRight = range(nrSeatsStraightSide).map((seatNr) => {
			const x = positionsCurved[positionsCurved.length - 1].x;
			const y = positionsCurved[0].y + yOffset * (seatNr + 1);
			// Just for ordering purposes
			const angle = 1 + seatNr + 0.1 * row;
			return { seatNr, x, y, angle, row };
		});
		const positions = [...positionsStraightLeft, ...positionsCurved, ...positionsStraightRight];
		return positions;
	};

	let positions = rows.map((row) => getPositionsArray(row)).flat();

	// To ensure that the seats for different parties are in block-like order, sort them by angle
	positions.sort((a, b) => (a.angle < b.angle ? -1 : 1));

	return positions;
};
