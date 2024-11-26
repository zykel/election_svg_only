import { geoPath, geoMercator, geoTransform } from 'd3-geo';
import { select, selectAll } from 'd3';
import { zoom, zoomIdentity } from 'd3-zoom';

export const getMapHelper = (svgLayer, data, mapWidth, mapHeight) => {
	const lng = -7.807195714694519;
	const lat = 53.41035563891312;

	let pathData = $state([]);

	let translateX = $state(0);
	let translateY = $state(0);
	let scale = $state(1 << 12);

	const projection = geoMercator().center([lng, lat]);

	const zoomHelper = zoom()
		.scaleExtent([1 << 2, 1 << 20])
		.extent([
			[0, 0],
			[mapWidth, mapHeight]
		])
		.on('zoom', ({ transform }) => zoomed(transform));

	function zoomed(transform) {
		scale = transform.k;
		translateX = transform.x;
		translateY = transform.y;

		projection.scale(scale).translate([translateX, translateY]);
		pathData = getPathData();
	}

	function getPathData() {
		const pathDataTmp = [];

		const pathGenerator = geoPath(projection);

		data.features.forEach((feature, i) => {
			const pathString = pathGenerator(feature);
			pathDataTmp.push({
				id: feature.id,
				area_seat: feature.properties.area_seat,
				pathString
			});
		});

		return pathDataTmp;
	}

	// Construct functions and variables to access from outside

	function setupZoom() {
		zoomHelper(select(svgLayer));
		zoomHelper.transform(
			select(svgLayer),
			zoomIdentity.translate(mapWidth / 2, mapHeight / 2).scale(scale)
		);
	}

	return {
		setupZoom,
		get pathData() {
			return pathData;
		}
	};
};
