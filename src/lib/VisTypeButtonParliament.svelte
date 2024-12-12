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
		hoverDataPercentages = $bindable(),
		color,
		w,
		h,
		marginVert,
		marginHor
	} = $props();

	export const getPositions = (mapWidth, mapHeight) => {
		const nrSeatsPerRow = {
			0: 7,
			1: 9
		};
		const nrSeatsStraightSide = 1;

		const rows = Object.keys(nrSeatsPerRow);
		const nrSeatsPerRowCurved = rows.map((row) => nrSeatsPerRow[row] - 2 * nrSeatsStraightSide);

		const rowDistance = 10;

		const getPositionsArray = (row) => {
			const r = 15 + rowDistance * row;
			const nrSeatsCurved = nrSeatsPerRowCurved[row];
			const positionsCurved = range(nrSeatsCurved).map((seatNr) => {
				const angle = (seatNr / (nrSeatsCurved - 1)) * Math.PI - Math.PI;
				const x = mapWidth / 2 + r * Math.cos(angle);
				const y = mapHeight * 0.565 + r * Math.sin(angle);
				return { seatNr, x, y, angle, row };
			});
			const yOffset = 12;
			const positionsStraightLeft = range(nrSeatsStraightSide).map((seatNr) => {
				const x = positionsCurved[0].x;
				const y = positionsCurved[0].y + yOffset * (seatNr + 1);
				// Just for ordering purposes
				const angle = -Math.PI - (1 + seatNr + 0.1 * row);
				return { seatNr, x, y, angle, row };
			});
			const positionsStraightRight = range(nrSeatsStraightSide).map((seatNr) => {
				const x = positionsCurved[positionsCurved.length - 1].x;
				const y = positionsCurved[0].y + yOffset * (seatNr + 1);
				// Just for ordering purposes
				const angle = 1 + seatNr + 0.1 * row;
				return { seatNr, x, y, angle, row };
			});
			const positions = [...positionsStraightLeft, ...positionsCurved, ...positionsStraightRight];
			return positions;
		};

		let positions = rows.map((row) => getPositionsArray(row)).flat();

		// To ensure that the seats for different parties are in block-like order, sort them by angle
		positions.sort((a, b) => (a.angle < b.angle ? -1 : 1));

		return positions;
	};

	const positions = getPositions(w, h);
	// debugger;

	// const parties = [0, 1, 2];
	// const nrRects = [range(2), range(6), range(5)];
	// const xScale = scaleBand()
	// 	.domain(range(max(nrRects, (arr) => arr.length)))
	// 	.range([marginHor, w - marginHor])
	// 	.padding(0.3);
	// const yScale = scaleBand()
	// 	.domain(parties)
	// 	.range([marginVert, h - marginVert])
	// 	.padding(0.2);

	// const rectData = parties
	// 	.map((party) => {
	// 		return nrRects[party].map((rectNr) => {
	// 			return {
	// 				x: xScale(rectNr),
	// 				y: yScale(party),
	// 				width: xScale.bandwidth(),
	// 				height: yScale.bandwidth()
	// 			};
	// 		});
	// 	})
	// 	.flat();
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
	{#each positions as { x, y }}
		<circle cx={x} cy={y} r={4} fill={color} />
	{/each}
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
