<script>
	import TestComponent from '$lib/TestComponent.svelte';
	import { onMount, mount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';

	let mapContainer;

	let lng = 0;
	let lat = 0;
	let zoom = 5;

	let map = $state(null);
	let svgLayer = $state(null);

	const mapWidth = 600;
	const mapHeight = 600;

	const mm = {};

	/*
    mm.ll2l = (map, d) => {
        return map.latLngToLayerPoint(new L.LatLng(d.lat, d.lon))
    }
    */

	mm.ll2l = (map, d) => {
		return map.project(mm.getLL(d));
	};
	mm.unll2l = (map, x, y) => {
		return map.unproject(mm.getPoint(x, y));
	};
	mm.getLL = (d) => {
		return new mapboxgl.LngLat(+d.lon, +d.lat);
	};
	mm.getPoint = (x, y) => {
		return new mapboxgl.Point(x, y);
	};

	mm.viewReset = (map, mapId) => {
		// Translate all circles for the map
		select(`#${mapId}-svg`)
			.selectAll('circle')
			//.attr('transform', d => `translate(${mm.ll2l(map, d.pos).x},${mm.ll2l(map, d.pos).y})`)
			.attr('cx', (d) => mm.ll2l(map, d.pos).x)
			.attr('cy', (d) => mm.ll2l(map, d.pos).y);
	};

	let count = $state(0);
	let printcount = $derived('' + count + '');

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

		// const canvasContainer = map.getCanvasContainer();
		// Do this does not seem to be properly reactive - only the component in the markup fires the printcount
		// const testSvg = mount(TestComponent, { target: canvasContainer, props: { map, printcount } });

		map.on('move', () => (count += 1)); // mm.viewReset(map, mapId)

		// TODO: mapManager.js inside C:\Users\benedikt\Documents\phd\projects\exex\story shows an example of how to keep the svg position synced with the mapbox map
	});
</script>

<!-- <div id="mapbox-map-container" bind:this={mapContainer}></div>

<TestComponent  /> -->

<!-- 	<Earthquakes /> -->

<div id="map-container" style="width: {mapWidth}px; height: {mapHeight}px">
	<div id="mapbox-map-container" style="width: {mapWidth}px; height: {mapHeight}px"></div>
	<div id="svg-map-container" style="width: {mapWidth}px; height: {mapHeight}px">
		<TestComponent bind:svgLayer {map} {printcount} />
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
