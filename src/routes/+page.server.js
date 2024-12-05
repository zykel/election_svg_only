import { get } from 'svelte/store';
import { parties } from '$lib/p.svelte.js';

export const load = async ({ fetch }) => {
	// https://mapshaper.org/ to simplify geojson files
	// const response = await fetch('test_rewind.json');
	// const response = await fetch('electoral_map_seats_voronoi.json');
	// const response = await fetch('us-states-10m.json');
	// const response = await fetch('electoral_map_seats_voronoi_20perc_geo.json');
	// const response = await fetch('0.json');
	const responseVoronoi = await fetch('electoral_map_seats_voronoi_5.json');
	const responseRegionBoundaries = await fetch('electoral_map_5.json');
	const responsePercentages = await fetch('percentages.json');

	let geodataVoronoi = await responseVoronoi.json();
	let geodataRegionBoundaries = await responseRegionBoundaries.json();
	let dataPercentages = await responsePercentages.json();

	const indexablePartyList = getRandomIndexablePartyList(geodataVoronoi);

	return {
		geodataVoronoi: {
			type: geodataVoronoi.type,
			features: geodataVoronoi.features.map((feature, i) => {
				const featureCloned = structuredClone(feature);
				// if (featureCloned.geometry.type === 'MultiPolygon') {
				// 	featureCloned.geometry.coordinates = featureCloned.geometry.coordinates.map((coords) => [
				// 		coords[0].reverse()
				// 	]);
				// } else if (featureCloned.geometry.type === 'Polygon') {
				// 	featureCloned.geometry.coordinates = featureCloned.geometry.coordinates.map((coords) =>
				// 		coords.reverse()
				// 	);
				// }

				featureCloned.properties.party = indexablePartyList[i];
				featureCloned.properties.idx = i;

				return featureCloned;
			})
		},
		geodataRegionBoundaries: {
			type: geodataRegionBoundaries.type,
			features: geodataRegionBoundaries.features.map((feature, i) => {
				const featureCloned = structuredClone(feature);
				if (featureCloned.geometry.type === 'MultiPolygon') {
					featureCloned.geometry.coordinates = featureCloned.geometry.coordinates.map((coords) => [
						coords[0].reverse()
					]);
				} else if (featureCloned.geometry.type === 'Polygon') {
					featureCloned.geometry.coordinates = featureCloned.geometry.coordinates.map((coords) =>
						coords.reverse()
					);
				}

				return featureCloned;
			})
		},
		dataPercentages
	};
};

const getRandomIndexablePartyList = (data) => {
	const nrSeats = data.features.length;
	let percentages = parties.map((d, i) => Math.random() + 0.1);
	const percentagesSum = percentages.reduce((a, b) => a + b);
	percentages = percentages.map((percentage) => percentage / percentagesSum);
	const partiesWithSeats = parties.map((party, i) => ({
		party,
		nrSeatsParty: Math.round(nrSeats * percentages[i])
	}));
	const correctedLastSeatNumberDueToRoundingDistortions =
		nrSeats -
		partiesWithSeats.slice(0, partiesWithSeats.length - 1).reduce((a, b) => a + b.nrSeatsParty, 0);
	partiesWithSeats.at(-1).nrSeatsParty = correctedLastSeatNumberDueToRoundingDistortions;
	const indexablePartyList = partiesWithSeats
		.map(({ party, nrSeatsParty }) => [...Array(nrSeatsParty)].map((d) => party))
		.flat();

	return indexablePartyList;
};
