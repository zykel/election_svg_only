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
	let svh100 = $state(1);

	onMount(() => {
		svh100 = window.innerHeight;
	});
	// let svh100 = $derived(typeof window !== "undefined" ? window.innerHeight : 1)

	const titleHeight = 50;
	const mainContainerWidth = $derived(Math.min(600, vw100));
	const mapHeight = 600;
	const mapHeightPercent = 0.55;
	// const mapWidth = $derived(Math.max(450, mainContainerWidth));
	const mapWidth = $derived(
		Math.min(600, (mainContainerWidth / (svh100 * mapHeightPercent)) * 600)
	);
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
			{mapHeightPercent}
		/>
	</div>
</div>

<style>
	@media (max-width: 400px) {
		:global(html) {
			font-size: 14px;
		}
	}
	@media (max-height: 600px) {
		:global(html) {
			font-size: 12px;
		}
	}
	:global(body) {
		font-family: 'Inter', sans-serif;
		margin: 0px;
		background: hsl(144 48% 71% / 0.2); /*#aedbb55e; #abffbc36; */
	}

	#main-content {
		display: flex;
		justify-content: center;
	}
</style>
