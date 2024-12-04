<script>
	import { onMount } from 'svelte';
	import { getMapHelper } from '$lib/helperMap.svelte.js';
	import { getParliamentHelper } from '$lib/helperParliament.svelte.js';
	import { getBarchartHelper } from '$lib/helperBarchart.svelte.js';
	import { getPercentagesHelper } from '$lib/helperPercentages.svelte.js';
	import SeatPath from '$lib/SeatPath.svelte';
	import PercentageRect from '$lib/PercentageRect.svelte';
	import { scaleOrdinal } from 'd3';
	import { parties, colorScale, margin } from '$lib/p.svelte.js';
	import { delay, delayPercentageRects } from '$lib/fn.svelte.js';
	import VisTypeButton from './VisTypeButton.svelte';
	import gsap from 'gsap-trial/dist/gsap';
	import BoundaryPath from './BoundaryPath.svelte';
	import HoverInfo from '$lib/HoverInfo.svelte';
	import Legend from '$lib/Legend.svelte';

	let {
		svgLayer = $bindable(),
		dataSeats,
		dataBoundaries,
		dataPercentages,
		mapWidth,
		mapHeight,
		legendHeight
	} = $props();

	let visType = $state('map');
	let visTypePrev = $state(null);

	const mapHelper = $derived(getMapHelper(dataSeats, dataBoundaries, mapWidth, mapHeight));
	$effect(() => {
		if (visType === 'map') mapHelper.setupZoom(svgLayer);
		else mapHelper.removeZoom();
	});
	const zooming = $derived(mapHelper.zooming);
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
	const rectData = $derived(getRectData());

	let tl = $state(null);
	const isAnimating = $derived(tl !== null);

	let hoverDataSeats = $state(null);
	let hoverDataPercentages = $state(null);
	$effect(() => {
		if (zooming) {
			hoverDataSeats = null;
			hoverDataPercentages = null;
		}
	});
</script>

<svg
	style:pointer-events={isAnimating ? 'none' : 'auto'}
	bind:this={svgLayer}
	class="main-svg"
	width="100%"
	height="100%"
>
	<rect
		x="0"
		y="0"
		width={mapWidth}
		height={mapHeight}
		fill="white"
		onpointermove={() => {
			hoverDataSeats = null;
			hoverDataPercentages = null;
		}}
		onpointerdown={() => {
			hoverDataSeats = null;
			hoverDataPercentages = null;
		}}
	></rect>
	<g class="seat-paths-g">
		{#each pathData as { idx, area_seat, party, pathString, opacity = 1 } (idx)}
			<SeatPath
				{tl}
				{idx}
				{area_seat}
				{pathString}
				{opacity}
				delayAnimation={delay(visType, visTypePrev, ['map', 'parliament', 'barchart'])}
				{zooming}
				bind:hoverDataSeats
				{visType}
				{party}
				{isAnimating}
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
				bind:hoverDataPercentages
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
	<g class="hover-info-g">
		<HoverInfo hoverData={hoverDataSeats} {mapWidth} {mapHeight} />
		<HoverInfo hoverData={hoverDataPercentages} {mapWidth} {mapHeight} />
	</g>
	<g class="legend-g" transform="translate(0, {mapHeight})">
		<Legend legendWidth={mapWidth} {legendHeight} {visType} {dataSeats} {dataPercentages} />
	</g>
</svg>
<svg class="legend-svg"> </svg>

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
