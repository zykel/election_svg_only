export const load = async ({ fetch }) => {
	// https://mapshaper.org/ to simplify geojson files
	const response = await fetch('electoral_map_seats_voronoi_10perc_geo.json');
	let geodataVoronoi = await response.json();

	return { geodataVoronoi };
};
