import { range } from 'd3-array';
import { parties, margin } from '$lib/p.svelte.js';
import { scaleBand } from 'd3';

const getXScale = (mapWidth) => {
	const scale = scaleBand()
		.domain(parties)
		.range([margin, mapWidth - margin])
		.paddingInner(0.1);

	return scale;
};

const getYScale = (data, mapHeight, partySubsets) => {
	// Get maximum number of entries for a party inside data
	const maxEntries = Math.max(
		...parties.map((party) => data.features.filter((d) => d.properties.party === party).length)
	);

	const scale = scaleBand()
		.domain(range(maxEntries))
		.range([mapHeight - margin, margin]);

	return scale;
};

export const getBarchartHelper = (data, mapWidth, mapHeight) => {
	const xScale = getXScale(mapWidth);
	const yScale = getYScale(data, mapHeight);

	const partySubsets = {};
	parties.forEach(
		(party) => (partySubsets[party] = data.features.filter((d) => d.properties.party === party))
	);

	const pathData = data.features.map((feature, idx) => {
		const x = xScale(feature.properties.party);
		// Find the index that the current data point has inside the partySubset
		const subsetIdx = partySubsets[feature.properties.party].findIndex(
			(d) => d.properties.idx === feature.properties.idx
		);
		const y = yScale(subsetIdx);
		const width = xScale.bandwidth();
		const height = yScale.bandwidth();
		// create an svg path to depict a rectangle at x, y with width and height
		const pathString = `M ${x} ${y} h ${width} v ${height} h ${-width} Z`;
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
