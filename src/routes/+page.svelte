<script>
	import SvgLayer from '$lib/SvgLayer.svelte';
	import { onMount, mount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import { PUBLIC_MAPBOX_API_TOKEN } from '$env/static/public';

	// https://svelte.dev/tutorial/kit/page-data
	// and
	// +page.server.ts plus +page.svelte

	let { data } = $props();
	data.geodataVoronoi.features = data.geodataVoronoi.features.filter((d) => d.geometry !== null);

	// topology => topojson.feature(topology, topology.objects.states)

	// console.log(data);

	let lng = -7.807195714694519;
	let lat = 53.41035563891312;
	let zoom = 5;

	let svgLayer = $state(null);

	let vw100 = $state(10000);

	const mapWidth = $derived(Math.min(600, vw100));
	const mapHeight = 600;
</script>

<div id="main-content" bind:clientWidth={vw100}>
	<div id="svg-map-container" style:width="{mapWidth}px" style:height="{mapHeight}px">
		<SvgLayer
			bind:svgLayer
			dataSeats={data.geodataVoronoi}
			dataPercentages={data.dataPercentages}
			{mapWidth}
			{mapHeight}
		/>
	</div>
</div>

<style>
	#main-content {
		display: flex;
		justify-content: center;
	}

	#mapbox-map-container,
	#svg-map-container {
	}
</style>
