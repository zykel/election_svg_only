<script>
	import TestComponent from '$lib/TestComponent.svelte';
	import { onMount, mount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';

	let mapContainer;

	let lng = 0;
	let lat = 0;
	let zoom = 5;

	let map;

	onMount(() => {
		mapboxgl.accessToken =
			'pk.eyJ1IjoiY2hvNCIsImEiOiJja3Z0b2ViNTIwdG55MzBseWZ3Mmc0bXluIn0.F3y-oHZn9KCmgPNR_11zzg';
		// map = new mapboxgl.Map({
		// 	container: mapContainer, // container id
		// 	style: 'mapbox://styles/cho4/clg3kv3ji003z01mwniqkksw2', // 'mapbox://styles/mapbox/light-v10'
		// 	// with satellite-based styles, some odd uncatchable fog errors pop up: https://docs.mapbox.com/mapbox-gl-js/style-spec/fog/
		// 	attributionControl: false,
		// 	center: [lng, lat],
		// 	zoom: zoom,
		// 	projection: 'naturalEarth'
		// });

		map = new mapboxgl.Map({
			container: 'mapbox-map-container',
			style: 'mapbox://styles/mapbox/dark-v10',
			center: [lng, lat],
			zoom: zoom
		});

		const canvasContainer = map.getCanvasContainer();
		const testSvg = mount(TestComponent, { target: canvasContainer });

		// TODO: mapManager.js inside C:\Users\benedikt\Documents\phd\projects\exex\story shows an example of how to keep the svg position synced with the mapbox map
	});
</script>

<div id="mapbox-map-container" bind:this={mapContainer}></div>

<!-- 	<Earthquakes /> -->

<style>
	#mapbox-map-container,
	:global(.mapboxgl-map) {
		height: 600px;
	}

	:global(.mapboxgl-canvas) {
		z-index: 1;
	}
</style>
