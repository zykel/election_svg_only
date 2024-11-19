<script>
	import TestComponent from '$lib/TestComponent.svelte';
	import { Map, Geocoder, Marker, controls } from '@beyonk/svelte-mapbox';
	// import Earthquakes from './Earthquakes.svelte'; // custom component

	const { GeolocateControl, NavigationControl, ScaleControl } = controls;

	let mapComponent;

	let lng = 0;
	let lat = 0;
	let zoom = 5;

	// Usage of methods like setCenter and flyto
	mapComponent?.setCenter([lng, lat], zoom); // zoom is optional
	mapComponent?.flyTo({ center: [lng, lat] }); // documentation (https://docs.mapbox.com/mapbox-gl-js/example/flyto)

	// Define this to handle `eventname` events - see [GeoLocate Events](https://docs.mapbox.com/mapbox-gl-js/api/markers/#geolocatecontrol-events)
	function eventHandler(e) {
		const data = e.detail;
		// do something with `data`, it's the result returned from the mapbox event
	}
</script>

<Map
	accessToken="pk.eyJ1IjoiY2hvNCIsImEiOiJja3Z0b2ViNTIwdG55MzBseWZ3Mmc0bXluIn0.F3y-oHZn9KCmgPNR_11zzg"
	bind:this={mapComponent}
	on:recentre={(e) => console.log(e.detail.center.lat, e.detail.center.lng)}
	options={{ scrollZoom: false }}
></Map>

<!-- 	<Earthquakes />
	<Marker
		lat={someLat}
		lng={someLng}
		color="rgb(255,255,255)"
		label="some marker label"
		popupClassName="class-name"
	/>
	<NavigationControl />
	<GeolocateControl options={{ some: 'control-option' }} on:eventname={eventHandler} />
	<ScaleControl /> -->

<style>
	:global(.mapboxgl-map) {
		height: 200px;
	}
</style>
