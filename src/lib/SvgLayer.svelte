<script>
	import { geoPath, geoMercator, geoTransform } from 'd3-geo';
	import { select, selectAll } from 'd3';
	import { zoom, zoomIdentity } from 'd3-zoom';
	import { onMount } from 'svelte';
	import { rewind } from '@turf/rewind';
	import { setupMap } from '$lib/helperMap.svelte.js';

	let { svgLayer = $bindable(), data, mapWidth, mapHeight } = $props();

	// Following this https://observablehq.com/@d3/zoomable-raster-vector?collection=@d3/d3-zoom

	// For us : [-98.58333333333333, 39.833333333333336]

	const zoomHelper = zoom()
		.scaleExtent([1 << 2, 1 << 20])
		.extent([
			[0, 0],
			[mapWidth, mapHeight]
		])
		.on('zoom', ({ transform }) => zoomed(transform));

	function zoomed(transform) {
		projection = geoMercator() // redudant?
			.center([lngInitial, latInitial]) // redudant?
			.scale(transform.k)
			.translate([transform.x, transform.y]);
	}

	const mapHelper = $derived(
		getMapHelper(svgLayer, data, mapWidth, mapHeight, lngInitial, latInitial, scaleInitial)
	);

	onMount(() => {
		mapHelper.setupMap();
	});

	function getPathData(projection) {
		const pathDataTmp = [];

		const pathGenerator = geoPath(projection);

		data.features.forEach((feature, i) => {
			const pathString = pathGenerator(feature);
			pathDataTmp.push({ id: feature.id, area_seat: feature.properties.area_seat, pathString });
		});

		return pathDataTmp;
	}

	let pathData = $derived(getPathData(projection));
</script>

<svg bind:this={svgLayer} class="test-svg" width="100%" height="100%">
	<g class="seat-paths-g">
		{#each pathData as { id, area_seat, pathString }, i}
			<path
				id="path-{i}-{area_seat}"
				class="seat-path"
				d={pathString}
				fill={'blue'}
				stroke="red"
				fill-rule="nonzero"
				stroke-width="2"
				opacity="0.1"
			></path>
		{/each}
	</g>
</svg>

<!-- {[
					'#00C24A',
					'#009C77',
					'#01B3DD',
					'#F2471C',
					'#A7C54E',
					'#76267F',
					'#E2A739',
					'#E2A739',
					'#AEAEAE'
				][i % 9]} -->

<style>
	.test-svg {
	}
</style>
