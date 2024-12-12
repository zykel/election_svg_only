<script>
	import { scaleBand, range, max } from 'd3';
	import gsap from 'gsap-trial/dist/gsap';
	import IrelandIconPath from '$lib/IrelandIconPath.svelte';

	let {
		visTypeToCheckFor,
		visType = $bindable(),
		visTypePrev = $bindable(),
		tl = $bindable(),
		isAnimating,
		hoverDataSeats = $bindable(),
		hoverDataPercentages = $bindable(),
		color,
		w,
		h,
		marginVert,
		marginHor
	} = $props();

	const parties = [0, 1, 2];
	const nrRects = [range(2), range(6), range(5)];
	const xScale = scaleBand()
		.domain(range(max(nrRects, (arr) => arr.length)))
		.range([marginHor, w - marginHor])
		.padding(0.3);
	const yScale = scaleBand()
		.domain(parties)
		.range([marginVert, h - marginVert])
		.padding(0.2);

	const rectData = parties
		.map((party) => {
			return nrRects[party].map((rectNr) => {
				return {
					x: xScale(rectNr),
					y: yScale(party),
					width: xScale.bandwidth(),
					height: yScale.bandwidth()
				};
			});
		})
		.flat();

	// const svgPath = '/electoral_map_icon.svg';
	const hardcodedPathWidth = 68;
	const scaleFactor = (h - 2 * marginVert) / h;
	const scaledPathWidth = hardcodedPathWidth * scaleFactor;
</script>

<svg
	style:opacity={isAnimating ? 0.5 : 1}
	class="vis-type-button-svg"
	viewBox="0 0 {w} {h}"
	onclick={() => {
		if (visType !== visTypeToCheckFor && !isAnimating) {
			visTypePrev = visType;
			visType = visTypeToCheckFor;
			// Set hoverData to 0 if the vis category changes
			if ([visType, visTypePrev].includes('percentages')) {
				hoverDataSeats = null;
				hoverDataPercentages = null;
			}

			tl = gsap.timeline({
				onComplete: () => {
					// Do something at the end of the timeline
					tl = null;
				}
			});
		}
	}}
>
	<g transform="translate({w / 2 - scaledPathWidth / 2},{marginVert}) scale({scaleFactor})">
		<IrelandIconPath fill={color} />
	</g>
	{#if visType == visTypeToCheckFor}
		<rect x="0" y={h - 10} width={w} height={10} fill={color} />
	{/if}
</svg>

<style>
	.vis-type-button-svg {
		cursor: pointer;
		height: 3.5rem;
	}
</style>
