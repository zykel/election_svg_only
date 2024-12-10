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

	const titleHeight = 50;
	const mainContainerWidth = $derived(Math.min(600, vw100));
	const mapWidth = 450;
	const mapHeight = 600;
	const legendHeight = 200;
</script>

<div id="main-content" bind:clientWidth={vw100}>
	<div id="svg-map-container" style:width="{mainContainerWidth}px">
		<SvgLayer
			bind:svgLayer
			dataSeats={data.geodataVoronoi}
			dataBoundaries={data.geodataRegionBoundaries}
			dataPercentages={data.dataPercentages}
			dataSeatCounts2019={data.dataSeatCounts2019}
			{titleHeight}
			{mapWidth}
			{mapHeight}
			{legendHeight}
		/>
	</div>
</div>

<style>
	:global(body) {
		font-family: 'Roboto', sans-serif;
		margin: 0px;
	}

	#main-content {
		display: flex;
		justify-content: center;
	}

	#mapbox-map-container,
	#svg-map-container {
	}
</style>
