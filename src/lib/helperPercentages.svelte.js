import { range } from 'd3-array';
import { parties, margin } from '$lib/p.svelte.js';
import { scaleBand, max, scaleLinear } from 'd3';

const getXScale = (mapWidth) => {
	const scale = scaleBand()
		.domain(parties)
		.range([margin, mapWidth - margin])
		.paddingInner(0.7);

	return scale;
};

const getYScale = (data, mapHeight) => {
	// Get maximum number of entries for a party inside data
	const maxPercentage = max(data, (d) => d.percentage);

	const scale = scaleLinear()
		.domain([0, maxPercentage])
		.range([mapHeight - margin, margin]);

	return scale;
};

export const getPercentagesHelper = (dataSeats, dataPercentages, mapWidth, mapHeight) => {
	const xScale = getXScale(mapWidth);
	const yScale = getYScale(dataPercentages, mapHeight);

	const pathData = dataSeats.features.map((feature, idx) => {
		const x = xScale(feature.properties.party);
		const y = mapHeight - margin;
		const width = xScale.bandwidth();
		// create an svg path to depict a rectangle at x, y with width and height
		const pathString = `M ${x} ${y} h ${width} h ${0} h ${-width + 1} Z`;
		return {
			idx,
			area_seat: feature.properties.area_seat,
			pathString,
			party: feature.properties.party
		};
	});

	const rectData = dataPercentages.map(({ year, party, percentage }, idx) => {
		const x =
			xScale(party) + (year == 2020 ? -xScale.bandwidth() * 0.35 : +xScale.bandwidth() * 0.35);
		const y = yScale(percentage);
		const width = xScale.bandwidth();
		const height = yScale(0) - y;
		const opacity = year == 2020 ? 0.7 : 1;
		// create the attribute information for a rect
		return {
			idx,
			year,
			party,
			percentage,
			x,
			y,
			width,
			height,
			opacity
		};
	});

	const rectDataFlat = dataPercentages.map(({ year, party, percentage }, idx) => {
		const x = xScale(party) + (year == 2020 ? 0 : xScale.bandwidth() / 2);
		const y = yScale(0);
		const width = xScale.bandwidth();
		const height = 0;
		const opacity = year == 2020 ? 0.7 : 1;
		// create the attribute information for a rect
		return {
			idx,
			year,
			party,
			percentage,
			x,
			y,
			width,
			height,
			opacity
		};
	});

	return {
		get pathData() {
			return pathData;
		},
		get rectData() {
			return rectData;
		},
		get rectDataFlat() {
			return rectDataFlat;
		}
	};
};
