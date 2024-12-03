<script>
	import { onMount } from 'svelte';
	import { getMapHelper } from '$lib/helperMap.svelte.js';
	import { getParliamentHelper } from '$lib/helperParliament.svelte.js';
	import { getBarchartHelper } from '$lib/helperBarchart.svelte.js';
	import { getPercentagesHelper } from '$lib/helperPercentages.svelte.js';
	import SeatPath from '$lib/SeatPath.svelte';
	import PercentageRect from '$lib/PercentageRect.svelte';
	import { scaleOrdinal } from 'd3';
	import { parties, margin } from '$lib/p.svelte.js';
	import { delay, delayPercentageRects } from '$lib/fn.svelte.js';
	import VisTypeButton from './VisTypeButton.svelte';
	import gsap from 'gsap-trial/dist/gsap';
	import BoundaryPath from './BoundaryPath.svelte';

	let {
		svgLayer = $bindable(),
		dataSeats,
		dataBoundaries,
		dataPercentages,
		mapWidth,
		mapHeight
	} = $props();

	$inspect(dataSeats);
	let visType = $state('map');
	let visTypePrev = $state(null);

	const mapHelper = $derived(getMapHelper(dataSeats, dataBoundaries, mapWidth, mapHeight));
	$effect(() => {
		if (visType === 'map') mapHelper.setupZoom(svgLayer);
		else mapHelper.removeZoom();
	});
	const parliamentHelper = $derived(getParliamentHelper(dataSeats, mapWidth, mapHeight));
	const barchartHelper = $derived(getBarchartHelper(dataSeats, mapWidth, mapHeight));
	const percentagesHelper = $derived(
		getPercentagesHelper(dataSeats, dataPercentages, mapWidth, mapHeight)
	);

	onMount(() => {
		// mapHelper.setupZoom(svgLayer);
	});

	const getPathData = () => {
		let pathDataTmp = [];
		if (visType === 'map') pathDataTmp = mapHelper.pathData;
		if (visType === 'parliament') pathDataTmp = parliamentHelper.pathData;
		if (visType === 'barchart') pathDataTmp = barchartHelper.pathData;
		if (visType === 'percentages') {
			if (visTypePrev === 'map') pathDataTmp = mapHelper.pathData;
			if (visTypePrev === 'parliament') pathDataTmp = parliamentHelper.pathData;
			if (visTypePrev === 'barchart') pathDataTmp = barchartHelper.pathData;
			// debugger;
			pathDataTmp = pathDataTmp.map((d) => ({ ...d, opacity: 0 }));
		}
		return pathDataTmp;
	};

	const getRegionBoundaryData = () => {
		// TODO: maybe redundant
		return mapHelper.regionBoundaryData;
	};

	const getRectData = () => {
		let rectDataTmp = [];
		if (visType === 'percentages') rectDataTmp = percentagesHelper.rectData;
		else rectDataTmp = percentagesHelper.rectDataFlat;
		return rectDataTmp;
	};

	const pathData = $derived(getPathData());
	const regionBoundaryData = $derived(getRegionBoundaryData());
	$inspect(pathData);
	const rectData = $derived(getRectData());

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

	let tl = $state(null);
	const isAnimating = $derived(tl !== null);
</script>

<svg
	style:pointer-events={isAnimating ? 'none' : 'auto'}
	bind:this={svgLayer}
	class="test-svg"
	width="100%"
	height="100%"
>
	<g class="seat-paths-g">
		{#each pathData as { idx, area_seat, party, pathString, opacity = 1 } (idx)}
			<SeatPath
				{tl}
				{idx}
				{area_seat}
				{pathString}
				{opacity}
				fill={colorScale(party)}
				delayAnimation={delay(visType, visTypePrev, ['map', 'parliament', 'barchart'])}
			/>
		{/each}
	</g>
	<g class="percentage-rects-g">
		{#each rectData as { year, party, percentage, x, y, opacity, width, height, idx } (idx)}
			<PercentageRect
				{tl}
				{year}
				{party}
				{percentage}
				{x}
				{y}
				y0={mapHeight - margin}
				{opacity}
				{width}
				{height}
				fill={colorScale(party)}
				delayAnimation={delay(visType, visTypePrev, ['percentages'])}
			/>
		{/each}
	</g>
	<g class="axes-g">
		{#each regionBoundaryData as { pathString, idx, constituency } (idx)}
			<BoundaryPath
				{tl}
				{idx}
				{pathString}
				{constituency}
				opacity={visType === 'map' ? 1 : 0}
				delayAnimation={delay(visType, visTypePrev, ['map'])}
			/>
		{/each}
	</g>
</svg>

<VisTypeButton visTypeToCheckFor={'map'} bind:visType bind:visTypePrev bind:tl {isAnimating} />
<VisTypeButton
	visTypeToCheckFor={'parliament'}
	bind:visType
	bind:visTypePrev
	bind:tl
	{isAnimating}
/>
<VisTypeButton visTypeToCheckFor={'barchart'} bind:visType bind:visTypePrev bind:tl {isAnimating} />
<VisTypeButton
	visTypeToCheckFor={'percentages'}
	bind:visType
	bind:visTypePrev
	bind:tl
	{isAnimating}
/>
