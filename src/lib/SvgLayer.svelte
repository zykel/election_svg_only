<script>
	import { onMount } from 'svelte';
	import { getMapHelper } from '$lib/helperMap.svelte.js';
	import { getParliamentHelper } from '$lib/helperParliament.svelte.js';
	import SeatPath from '$lib/SeatPath.svelte';

	let { svgLayer = $bindable(), data, mapWidth, mapHeight } = $props();

	let showMap = $state(true);
	let animateFast = $state(true);

	const mapHelper = $derived(getMapHelper(svgLayer, data, mapWidth, mapHeight));
	const parliamentHelper = getParliamentHelper(mapWidth, mapHeight);

	onMount(() => {
		mapHelper.setupZoom();
	});

	const pathData = $derived(showMap ? mapHelper.pathData : parliamentHelper.pathData);
	// $inspect(pathData);
</script>

<svg bind:this={svgLayer} class="test-svg" width="100%" height="100%">
	<g class="seat-paths-g">
		{#each pathData as { idx, area_seat, pathString } (idx)}
			<SeatPath {idx} {area_seat} {pathString} bind:animateFast />
		{/each}
	</g>
</svg>
<button
	on:click={() => {
		animateFast = false;
		showMap = !showMap;
	}}>Toggle Map</button
>
