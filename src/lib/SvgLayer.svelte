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
	import LegendGrid from '$lib/LegendGrid.svelte';
	import TitleBar from '$lib/TitleBar.svelte';
	import ParliamentSeatNumber from '$lib/ParliamentSeatNumber.svelte';
	import BarchartLabel from '$lib/BarchartLabel.svelte';
	import BarchartValueLabel from '$lib/BarchartValueLabel.svelte';
	import PercentagesYearLabels from '$lib/PercentagesYearLabels.svelte';
	import VisDescription from '$lib/VisDescription.svelte';

	let {
		svgLayer = $bindable(),
		dataSeats,
		dataBoundaries,
		dataPercentages,
		dataSeatCounts2019,
		titleHeight,
		mapWidth,
		mapHeight
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

	// const archartValueLabelData
	// const getBarchartLabelData = () => {
	// 	return barchartHelper.barchartLabelData;
	// };
	// const getRectLabelData = () => {
	// 	return percentagesHelper.rectLabelData;
	// };

	const pathData = $derived(getPathData());
	const regionBoundaryData = $derived(getRegionBoundaryData());
	const rectData = $derived(getRectData());
	const barchartValueLabelData = $derived(barchartHelper.barchartValueLabelData);
	const barchartLabelData = $derived(barchartHelper.barchartLabelData);
	const rectValueLabelData = $derived(percentagesHelper.rectValueLabelData);
	const rectLabelData = $derived(percentagesHelper.rectLabelData);

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

<div class="main-container">
	<div class="top-container">
		<TitleBar
			bind:visType
			bind:visTypePrev
			bind:tl
			{isAnimating}
			bind:hoverDataSeats
			bind:hoverDataPercentages
		/>
	</div>
	<VisDescription {visType} />
	<div class="middle-container">
		<svg
			style:pointer-events={isAnimating ? 'none' : 'auto'}
			bind:this={svgLayer}
			class="main-svg"
			viewBox={`0 0 ${mapWidth} ${mapHeight}`}
			preserveAspectRatio="xMidYMid meet"
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
						x0={margin}
						{opacity}
						{width}
						{height}
						fill={colorScale(party)}
						delayAnimation={delay(visType, visTypePrev, ['percentages'])}
						bind:hoverDataPercentages
					/>
				{/each}
			</g>
			<g class="axes-g" pointer-events="none">
				<g class="region-boundaries-g">
					{#each regionBoundaryData as { pathString, idx, constituency } (idx)}
						<BoundaryPath
							{tl}
							{idx}
							{pathString}
							{constituency}
							opacity={visType === 'map' ? 1 : 0}
							delayAnimation={delay(visType, visTypePrev, ['map'])}
							changingVisCategory={visType === 'map' && visTypePrev === 'percentages'}
						/>
					{/each}
				</g>
				<g class="parliament-seat-number-g">
					<ParliamentSeatNumber
						{tl}
						{mapWidth}
						{mapHeight}
						opacity={visType === 'parliament' ? 1 : 0}
						delayAnimation={delay(visType, visTypePrev, ['parliament'])}
						changingVisCategory={visType === 'parliament' && visTypePrev === 'percentages'}
					/>
				</g>
				<g class="barchart-value-label-g">
					{#each barchartValueLabelData as { x, y, party, value } (party)}
						<BarchartValueLabel
							{tl}
							{x}
							{y}
							{party}
							{value}
							opacity={visType === 'barchart' ? 1 : 0}
							delayAnimation={delay(visType, visTypePrev, ['barchart'])}
							changingVisCategory={visType === 'barchart' && visTypePrev === 'percentages'}
						/>
					{/each}
				</g>
				<g class="barchart-partyname-label-g">
					{#each barchartLabelData as { x, y, party } (party)}
						<BarchartLabel
							{tl}
							{x}
							{y}
							{party}
							opacity={visType === 'barchart' ? 1 : 0}
							delayAnimation={delay(visType, visTypePrev, ['barchart'])}
							changingVisCategory={visType === 'barchart' && visTypePrev === 'percentages'}
						/>
					{/each}
				</g>
				<g class="percentages-value-label-g">
					{#each rectValueLabelData as { x, y, party, value } (party)}
						<BarchartValueLabel
							{tl}
							{x}
							{y}
							{party}
							{value}
							opacity={visType === 'percentages' ? 1 : 0}
							delayAnimation={delay(visType, visTypePrev, ['percentages'])}
							changingVisCategory={visType === 'percentages' && visTypePrev !== 'percentages'}
						/>
					{/each}
				</g>
				<g class="percentages-partyname-label-g">
					{#each rectLabelData as { x, y, party } (party)}
						<BarchartLabel
							{tl}
							{x}
							{y}
							{party}
							opacity={visType === 'percentages' ? 1 : 0}
							delayAnimation={delay(visType, visTypePrev, ['percentages'])}
							changingVisCategory={visType === 'percentages' && visTypePrev !== 'percentages'}
						/>
					{/each}
				</g>
				<g class="percentages-year-label-g">
					<PercentagesYearLabels
						{tl}
						{rectData}
						opacity={visType === 'percentages' ? 1 : 0}
						delayAnimation={delay(visType, visTypePrev, ['percentages'])}
					/>
				</g>
			</g>
			{#if hoverDataSeats !== null}
				<use href="#path-{hoverDataSeats.idx}-{hoverDataSeats.area_seat}" />
			{/if}
		</svg>

		<HoverInfo data={dataSeats} hoverData={hoverDataSeats} {mapWidth} {mapHeight} {visType} />
		<HoverInfo
			data={dataPercentages}
			hoverData={hoverDataPercentages}
			{mapWidth}
			{mapHeight}
			{visType}
		/>
	</div>
	<div class="bottom-container">
		<LegendGrid
			legendWidth={mapWidth}
			{visType}
			{dataSeats}
			{dataPercentages}
			{dataSeatCounts2019}
		/>
	</div>
</div>

<style>
	.main-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		max-height: 1000px;
		justify-content: space-between;
		align-items: center;
		background: white;
	}
	.top-container,
	.bottom-container {
		/* flex: 0 1 auto; Allow the divs to take up their natural height */
		width: 100%;
	}
	.middle-container {
		/* flex: 1 1 auto; Allow the SVG to grow and shrink */
		height: 55%;
		display: flex;
		justify-content: center; /* Center the SVG horizontally */
		align-items: center; /* Center the SVG vertically */
		position: relative;
	}
	.main-svg {
		height: 100%;
		width: 100%;
		/* object-fit: contain; */
	}
</style>
