import { geoPath, geoMercator, geoTransform } from 'd3-geo';
import { select, selectAll } from 'd3';
import { zoom, zoomIdentity } from 'd3-zoom';

const lng = -7.807195714694519;
const lat = 53.41035563891312;

let pathData = $state([]);
let regionBoundaryData = $state([]);

let translateX = $state(0);
let translateY = $state(0);
let scale = $state(1 << 12);

const projection = geoMercator().center([lng, lat]);

const zoomHelper = zoom().scaleExtent([1 << 2, 1 << 20]);

let mapWidthPrev = 0;
let mapHeightPrev = 0;

export const getMapHelper = (dataVoronoi, dataRegionBoundaries, mapWidth, mapHeight) => {
	zoomHelper.extent([
		[0, 0],
		[mapWidth, mapHeight]
	]);

	projection
		.scale(scale)
		.translate([
			translateX === 0 ? mapWidth / 2 : translateX,
			translateY === 0 ? mapHeight / 2 : translateY
		]);

	function zoomed(transform) {
		scale = transform.k;

		translateX = transform.x;
		translateY = transform.y;
		projection.scale(scale).translate([transform.x, transform.y]);
		pathData = getPathData();
		regionBoundaryData = getRegionBoundaryData();
	}

	function getPathData() {
		const pathDataTmp = [];

		const pathGenerator = geoPath(projection);

		dataVoronoi.features.forEach((feature, i) => {
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

	function getRegionBoundaryData() {
		const regionBoundaryData = [];

		const pathGenerator = geoPath(projection);

		dataRegionBoundaries.features.forEach((feature, i) => {
			const pathString = pathGenerator(feature);
			regionBoundaryData.push({
				idx: i,
				consituency: feature.properties.consituency,
				pathString
			});
		});

		return regionBoundaryData;
	}

	// Construct functions and variables to access from outside
	function setupZoom(svgLayer) {
		zoomHelper.on('zoom', ({ transform }) => zoomed(transform));

		zoomHelper(select(svgLayer));

		let reset = false;
		if (mapWidthPrev !== mapWidth) {
			mapWidthPrev = mapWidth;
			reset = true;
		}
		if (mapHeightPrev !== mapHeight) {
			mapHeightPrev = mapHeight;
			reset = true;
		}
		zoomHelper.transform(
			select(svgLayer),
			zoomIdentity
				.translate(
					translateX === 0 || reset ? mapWidth / 2 : translateX,
					translateY === 0 || reset ? mapHeight / 2 : translateY
				)
				.scale(scale)
		);
	}

	function removeZoom(svgLayer) {
		// To also reset zoom: https://stackoverflow.com/questions/18502904/d3-remove-zoom-completely
		zoomHelper.on('zoom', null);
	}

	return {
		setupZoom,
		removeZoom,
		get pathData() {
			return getPathData();
		},
		get regionBoundaryData() {
			return getRegionBoundaryData();
		}
	};
};
