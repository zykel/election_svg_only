<script>
	import { scaleBand, range, max } from 'd3';
	import gsap from 'gsap-trial/dist/gsap';

	let {
		visTypeToCheckFor,
		visType = $bindable(),
		visTypePrev = $bindable(),
		tl = $bindable(),
		isAnimating,
		hoverDataSeats = $bindable(),
		hoverDataPercentages = $bindable()
	} = $props();

	const marginVert = 30;
	const marginHor = 10;

	const w = 80;
	const h = 100;

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
</script>

<svg
	style:height="3.5rem"
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
	{#each rectData as { x, y, width, height }}
		<rect {x} {y} {width} {height} />
	{/each}
	<rect x="0" y={h - 10} width={w} height={10}> </rect>
</svg>
