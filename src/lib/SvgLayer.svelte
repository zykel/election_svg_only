<script>
	import { geoPath, geoMercator, geoTransform } from 'd3-geo';
	import { select, selectAll } from 'd3';
	import { zoom, zoomIdentity } from 'd3-zoom';
	import { onMount } from 'svelte';

	let { svgLayer = $bindable(), data, mapWidth, mapHeight } = $props();

	// Following this https://observablehq.com/@d3/zoomable-raster-vector?collection=@d3/d3-zoom

	// For us : [-98.58333333333333, 39.833333333333336]
	let lng = -7.807195714694519;
	let lat = 53.41035563891312;
	let scale = 1 << 12;

	let projection = $state(
		geoMercator()
			.scale(scale)
			.translate([mapWidth / 2, mapHeight / 2])
			.center([lng, lat])
	);

	const zoomHelper = zoom()
		.scaleExtent([scale, 1 << 20])
		.extent([
			[0, 0],
			[mapWidth, mapHeight]
		])
		.on('zoom', ({ transform }) => zoomed(transform));

	function zoomed(transform) {
		projection = geoMercator() // redudant?
			.center([lng, lat]) // redudant?
			.scale(transform.k)
			.translate([transform.x, transform.y]);
	}

	onMount(() => {
		zoomHelper(select(svgLayer));
		zoomHelper.transform(
			select(svgLayer),
			zoomIdentity.translate(mapWidth / 2, mapHeight / 2).scale(scale)
		);
	});

	function getPathData(projection) {
		const pathDataTmp = [];

		const pathGenerator = geoPath(projection);

		data.features.forEach((feature) => {
			const pathString = pathGenerator(feature);
			pathDataTmp.push({ id: feature.id, pathString });
		});

		return pathDataTmp;
	}

	let pathData = $derived(getPathData(projection));

	// document.addEventListener('click', (e) => {
	// 	selectAll('.region-path')
	// 		.filter((d, i) => {
	// 			const bbox = document.getElementById(`path-${i}`).getBoundingClientRect();
	// 			return bbox.height > 600;
	// 		})
	// 		.attr('opacity', 0);
	// });
</script>

<svg bind:this={svgLayer} class="test-svg" width="100%" height="100%">
	<g class="region-paths-g">
		{#each pathData as { id, pathString }, i}
			<path
				id="path-{i}"
				class="region-path"
				d={pathString}
				fill={[
					'#00C24A',
					'#009C77',
					'#01B3DD',
					'#F2471C',
					'#A7C54E',
					'#76267F',
					'#E2A739',
					'#E2A739',
					'#AEAEAE'
				][i % 9]}
				stroke="white"
			></path>
		{/each}
	</g>
</svg>

<style>
	.test-svg {
	}
</style>
