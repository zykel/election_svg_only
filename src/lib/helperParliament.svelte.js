import { range } from 'd3-array';
import { parties } from '$lib/p.svelte.js';
import { getPositions } from '$lib/fn.svelte.js';

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
