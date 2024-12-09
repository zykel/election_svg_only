import { range } from 'd3-array';
import { parties } from '$lib/p.svelte.js';

const getPositions = (mapWidth, mapHeight) => {
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
			const y = mapHeight * 0.5 + r * Math.sin(angle);
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

	console.log('positions length', positions.length);
	return positions;
};

const getPartySubsetIdxCounter = (data) => {
	const nrSeatsPerParty = {};
	parties.forEach((party) => {
		nrSeatsPerParty[party] = 0;
	});
	data.features.forEach((feature) => {
		const party = feature.properties.party;
		nrSeatsPerParty[party]++;
	});

	const subsetOffsets = {};
	parties.forEach((party, i) => {
		//  Get sum of all preceding parties' seat counts
		let offset = 0;
		parties.forEach((otherParty, j) => {
			if (i > j) offset += nrSeatsPerParty[otherParty];
		});
		subsetOffsets[party] = offset;
	});

	const counter = {};
	const getGroupedIdx = (party) => {
		let idxInSubset = 0;
		if (!counter[party]) {
			counter[party] = 0;
		} else {
			idxInSubset = counter[party];
		}
		counter[party]++;

		return idxInSubset + subsetOffsets[party];
	};

	return getGroupedIdx;
};

export const getParliamentHelper = (data, mapWidth, mapHeight) => {
	const positions = getPositions(mapWidth, mapHeight);
	const getGroupedIdx = getPartySubsetIdxCounter(data);

	const pathData = data.features.map((feature, idx) => {
		const groupedIdx = getGroupedIdx(feature.properties.party);
		const position = positions[groupedIdx];
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
