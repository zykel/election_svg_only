import { range } from 'd3-array';
import { parties } from '$lib/p.svelte.js';

const getPositions = (mapWidth, mapHeight) => {
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

	let positions = rows.map((row) => getPositionsArray(row)).flat();

	// To ensure that the seats for different parties are in block-like order, sort them by angle
	positions.sort((a, b) => (a.angle < b.angle ? -1 : 1));

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
		console.log('groupedIdx', groupedIdx);
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
