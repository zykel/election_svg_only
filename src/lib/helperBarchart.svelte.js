import { range } from 'd3-array';
import { parties, margin } from '$lib/p.svelte.js';
import { scaleBand } from 'd3';

const getXScale = (data, mapWidth) => {
	// Get maximum number of entries for a party inside data
	const maxEntries = Math.max(
		...parties.map((party) => data.features.filter((d) => d.properties.party === party).length)
	);

	const scale = scaleBand()
		.domain(range(maxEntries))
		.range([margin, mapWidth - margin]);

	return scale;
};

const getYScale = (mapHeight) => {
	const scale = scaleBand()
		.domain([...parties].reverse())
		.range([mapHeight - margin, margin])
		.paddingInner(0.2);

	return scale;
};

export const getBarchartHelper = (data, mapWidth, mapHeight) => {
	const xScale = getXScale(data, mapWidth);
	const yScale = getYScale(mapHeight);

	const partySubsets = {};
	parties.forEach(
		(party) => (partySubsets[party] = data.features.filter((d) => d.properties.party === party))
	);

	const pathData = data.features.map((feature, idx) => {
		// Find the index that the current data point has inside the partySubset
		const subsetIdx = partySubsets[feature.properties.party].findIndex(
			(d) => d.properties.idx === feature.properties.idx
		);
		const x = xScale(subsetIdx);
		const y = yScale(feature.properties.party);
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

	const barchartLabelData = parties.map((party) => {
		const x = xScale(0);
		const y = yScale(party) + yScale.bandwidth() / 2;
		// create the attribute information for a rect
		return {
			party,
			x,
			y
		};
	});

	const barchartValueLabelData = parties.map((party) => {
		const value = data.features.filter((d) => d.properties.party === party).length;
		const x = xScale(value - 1) + xScale.bandwidth();
		const y = yScale(party) + yScale.bandwidth() / 2;
		// create the attribute information for a rect
		return {
			value,
			party,
			x,
			y
		};
	});

	return {
		get pathData() {
			return pathData;
		},
		get barchartLabelData() {
			return barchartLabelData;
		},
		get barchartValueLabelData() {
			return barchartValueLabelData;
		}
	};
};
