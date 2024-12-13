<script>
	import { scaleBand, scaleLinear, range, max } from 'd3';
	import gsap from 'gsap-trial/dist/gsap';

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

	const parties = [0, 1];
	const years = [0, 1];
	const xScale = scaleLinear()
		.domain([0, 1])
		.range([marginHor, w - marginHor]);
	const yScale = scaleBand()
		.domain(parties)
		.range([marginVert, h - marginVert])
		.padding(0.2);
	const values = [
		{ party: 0, year: 0, value: 0.5 },
		{ party: 0, year: 1, value: 0.6 },
		{ party: 1, year: 0, value: 0.9 },
		{ party: 1, year: 1, value: 1 }
	];

	const rectData = parties
		.map((party) => {
			return years.map((year) => {
				const value = values.find((v) => v.party === party && v.year === year).value;
				const yOffset = year === 0 ? 0 : yScale.bandwidth() / 2;
				return {
					x: xScale(0),
					y: yScale(party) + yOffset,
					width: xScale(value) - xScale(0),
					height: yScale.bandwidth() * 0.6,
					opacity: year === 0 ? 0.6 : 1
				};
			});
		})
		.flat();
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
	{#each rectData as { x, y, width, height, opacity }}
		<rect {x} {y} {width} {height} {opacity} fill={color} />
	{/each}
	{#if visType == visTypeToCheckFor}
		<rect x="0" y={h - 10} width={w} height={10} fill={color} />
	{/if}
</svg>

<style>
	.vis-type-button-svg {
		cursor: pointer;
		height: 3.5rem;
		background-color: hsl(144 48% 71% / 1);
	}
	.vis-type-button-svg:hover {
		background-color: hsl(144 48% 79% / 1);
	}
</style>
