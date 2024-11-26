<script>
	import { geoPath, geoMercator, geoTransform } from 'd3-geo';
	import { select, selectAll } from 'd3';
	import { zoom, zoomIdentity } from 'd3-zoom';
	import { onMount } from 'svelte';
	import { rewind } from '@turf/rewind';
	import { getMapHelper } from '$lib/helperMap.svelte.js';

	let { svgLayer = $bindable(), data, mapWidth, mapHeight } = $props();

	const mapHelper = $derived(getMapHelper(svgLayer, data, mapWidth, mapHeight));
	// const mapHelper = new MapHelper(svgLayer, data, mapWidth, mapHeight);

	onMount(() => {
		mapHelper.setupZoom();
	});

	const pathData = $derived(mapHelper.pathData);
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
