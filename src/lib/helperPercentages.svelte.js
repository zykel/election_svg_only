import { range } from 'd3-array';
import { parties, margin } from '$lib/p.svelte.js';
import { scaleBand, max, scaleLinear } from 'd3';

const getXScale = (data, mapWidth) => {
	// Get maximum number of entries for a party inside data
	const maxPercentage = max(data, (d) => d.percentage);

	const scale = scaleLinear()
		.domain([0, maxPercentage])
		.range([margin, mapWidth - margin]);

	return scale;
};

const getYScale = (mapHeight) => {
	const scale = scaleBand()
		.domain([...parties].reverse())
		.range([mapHeight - margin / 2, margin / 2])
		.paddingInner(0.55);

	return scale;
};

export const getPercentagesHelper = (dataSeats, dataPercentages, mapWidth, mapHeight) => {
	const xScale = getXScale(dataPercentages, mapWidth);
	const yScale = getYScale(mapHeight);

	const pathData = dataSeats.features.map((feature, idx) => {
		const x = yScale(feature.properties.party);
		const y = mapHeight - margin;
		const width = yScale.bandwidth();
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
		const x = xScale(0);
		const y =
			yScale(party) + (year == 2020 ? -yScale.bandwidth() * 0.35 : +yScale.bandwidth() * 0.35);
		const width = xScale(percentage) - xScale(0);
		const height = yScale.bandwidth();
		const opacity = year == 2020 ? 0.4 : 1;
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
		const x = xScale(0);
		const y =
			yScale(party) + (year == 2020 ? -yScale.bandwidth() * 0.35 : +yScale.bandwidth() * 0.35);
		const width = 0;
		const height = yScale.bandwidth();
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

	const rectLabelData = parties.map((party) => {
		const x = xScale(0);
		const y = yScale(party) + yScale.bandwidth() / 2;
		// create the attribute information for a rect
		return {
			party,
			x,
			y
		};
	});

	const rectValueLabelData = dataPercentages
		.filter((d) => d.year === 2024)
		.map(({ party, percentage }) => {
			const x = xScale(percentage);
			const y = yScale(party) + yScale.bandwidth() * 0.35 + yScale.bandwidth() / 2;
			// create the attribute information for a rect
			return {
				party,
				value: (percentage * 100).toFixed(1) + '%',
				x,
				y
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
		},
		get rectLabelData() {
			return rectLabelData;
		},
		get rectValueLabelData() {
			return rectValueLabelData;
		}
	};
};
