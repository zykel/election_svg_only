<script>
	import TestComponent from '$lib/TestComponent.svelte';
	import { onMount, mount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import { PUBLIC_MAPBOX_API_TOKEN } from '$env/static/public';

	// https://svelte.dev/tutorial/kit/page-data
	// and
	// +page.server.ts plus +page.svelte

	let { data } = $props();

	console.log(data);

	let mapContainer;

	let lng = -7.807195714694519;
	let lat = 53.41035563891312;
	let zoom = 5;

	let map = $state(null);
	let svgLayer = $state(null);

	const mapWidth = 600;
	const mapHeight = 600;

	let mapMoveNotifyToggle = $state(false);

	onMount(() => {
		mapboxgl.accessToken = PUBLIC_MAPBOX_API_TOKEN;

		map = new mapboxgl.Map({
			container: 'mapbox-map-container',
			style: 'mapbox://styles/mapbox/dark-v10',
			center: [lng, lat],
			zoom: zoom
		});

		map.on('move', () => (mapMoveNotifyToggle = !mapMoveNotifyToggle));
	});
</script>

<div id="map-container" style:width="{mapWidth}px" style:height="{mapHeight}px">
	<div id="mapbox-map-container" style:width="{mapWidth}px" style:height="{mapHeight}px"></div>
	<div id="svg-map-container" style:width="{mapWidth}px" style:height="{mapHeight}px">
		{#if map !== null}
			<TestComponent
				bind:svgLayer
				{map}
				{mapMoveNotifyToggle}
				data={data.geodataVoronoi}
				{mapWidth}
				{mapHeight}
			/>
		{/if}
	</div>
</div>

<style>
	#map-container {
		position: relative;
	}

	#mapbox-map-container,
	#svg-map-container {
		position: absolute;
		top: 0;
		left: 0;
	}
	#svg-map-container {
		overflow: hidden;
		pointer-events: none;
	}
</style>
