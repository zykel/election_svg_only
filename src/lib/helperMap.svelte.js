import { geoPath, geoMercator, geoTransform } from 'd3-geo';
import { select, selectAll } from 'd3';
import { zoom, zoomIdentity } from 'd3-zoom';

const lng = -7.807195714694519;
const lat = 53.41035563891312;

let pathData = $state([]);

let translateX = $state(0);
let translateY = $state(0);
let scale = $state(1 << 12);

const projection = geoMercator().center([lng, lat]);

export const getMapHelper = (svgLayer, data, mapWidth, mapHeight) => {
	const zoomHelper = zoom()
		.scaleExtent([1 << 2, 1 << 20])
		.extent([
			[0, 0],
			[mapWidth, mapHeight]
		])
		.on('zoom', ({ transform }) => zoomed(transform));

	projection.scale(scale).translate([mapWidth / 2, mapHeight / 2]);
	// TODO: I thought the thing up here was causing the non-panning problem, but actually that is not the case
	console.log('recreating map helper');

	// pathData = getPathData(); // This would be necessary but is not possible
	// TODO: I think now it is solved but I am confused why I am rerunning the getMapHelper so often
	// TODO: could drop the pathData variable entirely I think

	function zoomed(transform) {
		scale = transform.k;
		// translateX = transform.x;
		// translateY = transform.y;

		projection.scale(scale).translate([transform.x, transform.y]);
		pathData = getPathData();
	}

	function getPathData() {
		const pathDataTmp = [];

		const pathGenerator = geoPath(projection);

		data.features.forEach((feature, i) => {
			const pathString = pathGenerator(feature);
			pathDataTmp.push({
				idx: i,
				area_seat: feature.properties.area_seat,
				pathString,
				party: feature.properties.party
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
			return getPathData();
		}
	};
};
