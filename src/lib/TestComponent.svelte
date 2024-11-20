<script>
	import { geoPath, geoMercator } from 'd3-geo';
	import simplify from '@turf/simplify';

	let { svgLayer = $bindable(), map, mapMoveNotifyToggle, data, mapWidth, mapHeight } = $props();

	let lng = -7.807195714694519;
	let lat = 53.41035563891312;

	let cx = $state(0);
	let cy = $state(0);

	let pathData = $state([]);
	// $inspect(pathData);

	console.log(data);
	const simplifiedFeatures = simplify(data, { tolerance: 0.001, highQuality: true }).features;

	$effect(() => {
		console.log('updating view');
		const pathDataTmp = [];

		const mümap = map;
		// debugger;

		// TODO: https://gist.github.com/enjalot/1ed5d9795b82f846759f89029b0b8ff3

		// TODO: This is just much more performat: https://observablehq.com/@d3/zoomable-raster-vector?collection=@d3/d3-zoom

		const center = map.getCenter();
		const zoom = map.getZoom();
		// 512 is hardcoded tile size, might need to be 256 or changed to suit your map config
		const scale = ((512 * 0.5) / Math.PI) * Math.pow(2, zoom);

		const projection = geoMercator()
			.center([center.lng, center.lat])
			.translate([mapWidth / 2, mapHeight / 2])
			.scale(scale);

		const renderPath = geoPath(projection);

		simplifiedFeatures.forEach((feature) => {
			const pathString = renderPath(feature);
			pathDataTmp.push(pathString);
		});
		// pathDataTmp.push(renderPath(data)); // Works as well, but just one path

		// console.log(pathDataTmp);

		pathData = pathDataTmp;

		mapMoveNotifyToggle;
		cx = map.project([lng, lat]).x;
		cy = map.project([lng, lat]).y;
	});
</script>

<svg bind:this={svgLayer} class="test-svg" width="100%" height="100%">
	<!-- <rect width="100" height="100" fill="red"> </rect>
	<circle {cx} {cy} r="10" fill="blue"></circle> -->
	<g class="region-paths-g">
		{#each pathData as pathString, i}
			<path
				d={pathString}
				fill={['red', 'green', 'blue', 'yellow', 'pink'][i % 5]}
				opacity="0.2"
				stroke="red"
			></path>
		{/each}
	</g>
</svg>

<style>
	.test-svg {
		position: absolute;
		z-index: 2;
	}
</style>
