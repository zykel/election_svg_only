export const load = async ({ fetch }) => {
	// https://mapshaper.org/ to simplify geojson files
	// const response = await fetch('test_rewind.json');
	// const response = await fetch('electoral_map_seats_voronoi.json');
	// const response = await fetch('us-states-10m.json');
	// const response = await fetch('electoral_map_seats_voronoi_20perc_geo.json');
	// const response = await fetch('0.json');
	const response = await fetch('5.json');

	let geodataVoronoi = await response.json();

	geodataVoronoi;

	return {
		geodataVoronoi: {
			type: geodataVoronoi.type,
			features: geodataVoronoi.features.map((feature, i) => {
				const mue = structuredClone(feature);
				if (mue.geometry.type === 'MultiPolygon') {
					mue.geometry.coordinates = mue.geometry.coordinates.map((coords) => [
						coords[0].reverse()
					]);
				} else if (mue.geometry.type === 'Polygon') {
					mue.geometry.coordinates = mue.geometry.coordinates.map((coords) => coords.reverse());
				}

				return mue;
			})
		}
	};
};
