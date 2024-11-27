import { range } from 'd3-array';

export const getParliamentHelper = (data, mapWidth, mapHeight) => {
	const nrSeatsPerRow = {
		0: 22,
		1: 27,
		2: 29,
		3: 30,
		4: 32,
		5: 34
	};
	const rows = Object.keys(nrSeatsPerRow);

	const getPositionsArray = (row) => {
		const r = 150 + 25 * row;
		const nrSeats = nrSeatsPerRow[row];
		const positions = range(nrSeats).map((seatNr) => {
			const angle = (seatNr / (nrSeats - 1)) * Math.PI - Math.PI;
			const x = mapWidth / 2 + r * Math.cos(angle);
			const y = mapHeight * 0.75 + r * Math.sin(angle);
			return { seatNr, x, y, angle, row };
		});
		return positions;
	};

	let positions = [
		...getPositionsArray(0),
		...getPositionsArray(1),
		...getPositionsArray(2),
		...getPositionsArray(3),
		...getPositionsArray(4),
		...getPositionsArray(5)
	];

	// To ensure that the seats for different parties are in block-like order, sort them by angle
	positions.sort((a, b) => (a.angle < b.angle ? -1 : 1));

	const pathData = data.features.map((feature, idx) => {
		const position = positions[idx];
		const x = position.x;
		const y = position.y;
		const r = 10;
		// create an svg path to depict a circle at cx, cy with radius r
		const pathString = `M ${x} ${y} A ${r} ${r} 0 1 1 ${x + 0.1} ${y}`;

		// pathString = `M ${x} ${y} A ${r} ${r} 0 1 1 ${x + 0.1} ${y}`;
		return {
			idx,
			area_seat: feature.properties.area_seat,
			pathString,
			party: feature.properties.party
		};
	});

	return {
		get pathData() {
			return pathData;
		}
	};
};
