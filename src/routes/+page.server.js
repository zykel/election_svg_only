export const load = async ({ fetch }) => {
	const response = await fetch('electoral_map_seats_voronoi_20perc_geo.json');
	let geodataVoronoi = await response.json();

	return { geodataVoronoi };
};
