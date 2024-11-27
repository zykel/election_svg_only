<script>
	import { onMount } from 'svelte';
	import { getMapHelper } from '$lib/helperMap.svelte.js';
	import { getParliamentHelper } from '$lib/helperParliament.svelte.js';
	import SeatPath from '$lib/SeatPath.svelte';
	import { scaleOrdinal } from 'd3';
	import { parties } from '$lib/p.svelte.js';

	let { svgLayer = $bindable(), data, mapWidth, mapHeight } = $props();

	let visType = $state('map');
	let animateFast = $state(true);

	const mapHelper = $derived(getMapHelper(svgLayer, data, mapWidth, mapHeight));
	const parliamentHelper = getParliamentHelper(data, mapWidth, mapHeight);

	onMount(() => {
		mapHelper.setupZoom();
	});

	const getPathData = (visType) => {
		let data = [];
		if (visType === 'map') data = mapHelper.pathData;
		if (visType === 'parliament') data = parliamentHelper.pathData;
		return data;
	};

	const pathData = $derived(getPathData(visType));

	const colorScale = scaleOrdinal()
		.domain(parties)
		.range([
			'#00C24A',
			'#009C77',
			'#01B3DD',
			'#F2471C',
			'#A7C54E',
			'#76267F',
			'#E2A739',
			'#E2A739',
			'#AEAEAE'
		]);
	// $inspect(pathData);
</script>

<svg bind:this={svgLayer} class="test-svg" width="100%" height="100%">
	<g class="seat-paths-g">
		{#each pathData as { idx, area_seat, pathString, party } (idx)}
			<SeatPath {idx} {area_seat} {pathString} fill={colorScale(party)} bind:animateFast />
		{/each}
	</g>
</svg>
<button
	on:click={() => {
		if (visType !== 'map') {
			animateFast = false;
			visType = 'map';
		}
	}}>Map</button
>
<button
	on:click={() => {
		if (visType !== 'parliament') {
			animateFast = false;
			visType = 'parliament';
		}
	}}>Parliament</button
>
