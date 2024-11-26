const lngInitial = -7.807195714694519;
const latInitial = 53.41035563891312;
const scaleInitial = 1 << 12;

let projection = $state(
	geoMercator()
		.scale(scaleInitial)
		.translate([mapWidth / 2, mapHeight / 2])
		.center([lngInitial, latInitial])
);

export const getMapHelper = (svgLayer, data, mapWidth, mapHeight) => {
	const mapHelper = {};

	mapHelper.setupMap = () => {
		zoomHelper(select(svgLayer));
		zoomHelper.transform(
			select(svgLayer),
			zoomIdentity.translate(mapWidth / 2, mapHeight / 2).scale(scale)
		);
	};

	return mapHelper;
};
