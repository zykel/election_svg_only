export const load = async ({ fetch }) => {
	// https://mapshaper.org/ to simplify geojson files
	const response = await fetch('test_rewind.json');
	// const response = await fetch('electoral_map_seats_voronoi.json');
	// const response = await fetch('us-states-10m.json');
	// const response = await fetch('electoral_map_seats_voronoi_20perc_geo.json');

	let geodataVoronoi = await response.json();

	geodataVoronoi;

	return { geodataVoronoi };
};
