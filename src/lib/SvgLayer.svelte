<script>
	import { onMount } from 'svelte';
	import { getMapHelper } from '$lib/helperMap.svelte.js';
	import { getParliamentHelper } from '$lib/helperParliament.svelte.js';
	import { getBarchartHelper } from '$lib/helperBarchart.svelte.js';
	import SeatPath from '$lib/SeatPath.svelte';
	import { scaleOrdinal } from 'd3';
	import { parties } from '$lib/p.svelte.js';
	import VisTypeButton from './VisTypeButton.svelte';

	let { svgLayer = $bindable(), data, mapWidth, mapHeight } = $props();

	let visType = $state('map');
	let animateFast = $state(true);

	// TODO: Issue is: I recreate the mapHelper upon browser window resize, but the setupZoom function is not called again (which would also not make a lot of sense because the zoom functionality is already set up). This way, however, the pathData is not updated inside the mapHelper
	// TODO: This is being rerun whenever panning/zooming
	const mapHelper = $derived(getMapHelper(data, mapWidth, mapHeight));
	$effect(() => {
		if (visType === 'map') mapHelper.setupZoom(svgLayer);
		else mapHelper.removeZoom();
	});
	const parliamentHelper = $derived(getParliamentHelper(data, mapWidth, mapHeight));
	const barchartHelper = $derived(getBarchartHelper(data, mapWidth, mapHeight));

	onMount(() => {
		// mapHelper.setupZoom(svgLayer);
	});

	const getPathData = () => {
		let data = [];
		if (visType === 'map') data = mapHelper.pathData;
		if (visType === 'parliament') data = parliamentHelper.pathData;
		if (visType === 'barchart') data = barchartHelper.pathData;
		return data;
	};

	const pathData = $derived(getPathData());

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

	const isAnimating = $derived(!animateFast);
</script>

<svg
	style:pointer-events={isAnimating ? 'none' : 'auto'}
	bind:this={svgLayer}
	class="test-svg"
	width="100%"
	height="100%"
>
	<g class="seat-paths-g">
		{#each pathData as { idx, area_seat, pathString, party } (idx)}
			<SeatPath {idx} {area_seat} {pathString} fill={colorScale(party)} bind:animateFast />
		{/each}
	</g>
</svg>

<VisTypeButton visTypeToCheckFor={'map'} bind:visType bind:animateFast {isAnimating} />
<VisTypeButton visTypeToCheckFor={'parliament'} bind:visType bind:animateFast {isAnimating} />
<VisTypeButton visTypeToCheckFor={'barchart'} bind:visType bind:animateFast {isAnimating} />
