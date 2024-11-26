import { geoPath, geoMercator, geoTransform } from 'd3-geo';
import { select, selectAll } from 'd3';
import { zoom, zoomIdentity } from 'd3-zoom';

const lng = -7.807195714694519;
const lat = 53.41035563891312;

// export class MapHelper {
// 	svgLayer = $state(null);
// 	data = $state(null);
// 	mapWidth = $state(0);
// 	mapHeight = $state(0);

// 	translateX = $state(0);
// 	translateY = $state(0);

// 	scale = $state(1 << 12);
// 	projection = geoMercator().center([lng, lat]);

// 	#pathData = $state([]);

// 	constructor(svgLayer, data, mapWidth, mapHeight) {
// 		this.svgLayer = svgLayer;
// 		this.data = data;
// 		this.mapWidth = mapWidth;
// 		this.mapHeight = mapHeight;

// 		this.translateX = mapWidth / 2;
// 		this.translateY = mapHeight / 2;

// 		this.zoomHelper = zoom()
// 			.scaleExtent([1 << 2, 1 << 20])
// 			.extent([
// 				[0, 0],
// 				[mapWidth, mapHeight]
// 			])
// 			.on('zoom', ({ transform }) => this.zoomed(transform));
// 	}

// 	setupZoom() {
// 		this.zoomHelper(select(this.svgLayer));
// 		this.zoomHelper.transform(
// 			select(this.svgLayer),
// 			zoomIdentity.translate(this.mapWidth / 2, this.mapHeight / 2).scale(this.scale)
// 		);
// 	}

// 	zoomed(transform) {
// 		this.scale = transform.k;
// 		this.translateX = transform.x;
// 		this.translateY = transform.y;

// 		this.projection.scale(this.scale).translate([this.translateX, this.translateY]);
// 		this.#pathData = this.getPathData();
// 		// console.log('updating path data');
// 	}

// 	getPathData() {
// 		const pathDataTmp = [];

// 		const pathGenerator = geoPath(this.projection);

// 		this.data.features.forEach((feature, i) => {
// 			const pathString = pathGenerator(feature);
// 			pathDataTmp.push({
// 				id: feature.id,
// 				area_seat: feature.properties.area_seat,
// 				pathString
// 			});
// 		});

// 		return pathDataTmp;
// 	}

// 	get pathData() {
// 		return this.#pathData;
// 	}
// }

// ----------------------------------------------------------------------------------

// export const pathDataMap = $state({ value: [] });
// const projection = geoMercator().center([lng, lat]);

// let translateX = $state(0);
// let translateY = $state(0);
// let scale = $state(1 << 12);

// export const getMapHelper = (svgLayer, data, mapWidth, mapHeight) => {
// 	const lng = -7.807195714694519;
// 	const lat = 53.41035563891312;

// 	const zoomHelper = zoom()
// 		.scaleExtent([1 << 2, 1 << 20])
// 		.extent([
// 			[0, 0],
// 			[mapWidth, mapHeight]
// 		])
// 		.on('zoom', ({ transform }) => zoomed(transform));

// 	function zoomed(transform) {
// 		scale = transform.k;
// 		translateX = transform.x;
// 		translateY = transform.y;

// 		projection.scale(scale).translate([translateX, translateY]);
// 		pathDataMap.value = mapHelper.getPathData();
// 	}

// 	// Construct functions and variables to access from outside
// 	const mapHelper = {};

// 	mapHelper.setupZoom = () => {
// 		zoomHelper(select(svgLayer));
// 		zoomHelper.transform(
// 			select(svgLayer),
// 			zoomIdentity.translate(mapWidth / 2, mapHeight / 2).scale(scale)
// 		);
// 	};

// 	mapHelper.getPathData = () => {
// 		const pathDataTmp = [];

// 		const pathGenerator = geoPath(projection);

// 		data.features.forEach((feature, i) => {
// 			const pathString = pathGenerator(feature);
// 			pathDataTmp.push({
// 				id: feature.id,
// 				area_seat: feature.properties.area_seat,
// 				pathString
// 			});
// 		});

// 		return pathDataTmp;
// 	};

// 	return mapHelper;
// };

// ----------------------------------------------------------------------------------

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
