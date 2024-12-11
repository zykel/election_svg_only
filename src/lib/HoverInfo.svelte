<script>
	import { colorScale } from './p.svelte';

	let { data, hoverData, mapWidth, mapHeight, visType } = $props();

	let hoverInfoNode = $state(null);

	const minWidth = 150;
	const maxWidth = 200;

	let textGroup = $state(null);
	let textTitle = $state(null);
	let textBody = $state(null);

	const hoverBoxMargin = 5;
	const height = 50;
	const strokeWidth = 0;

	const hovernodeClientRect = $derived(
		hoverData !== null ? hoverData.node.getBoundingClientRect() : null
	);
	const svgClientRect = $derived(
		hoverData !== null ? hoverData.node.ownerSVGElement.getBoundingClientRect() : null
	);

	const getX = () => {
		if (hoverData === null) return 0;
		let x = hovernodeClientRect.x - svgClientRect.x + hovernodeClientRect.width / 2;
		// Deal with case where all borders are out of view
		if (x < 0) x += hovernodeClientRect.width / 2;
		if (x > svgClientRect.width) x -= hovernodeClientRect.width / 2;

		return x;
	};
	let x = $derived(getX());

	const getYAndOffset = () => {
		if (hoverData === null) return { y: 0, offsetY: '0%' };
		let y = hovernodeClientRect.y - svgClientRect.y - 5;
		let offsetY = '-100%';
		if (y - 200 < 0) {
			y += hovernodeClientRect.height + 2 * 5;
			offsetY = '0%';
			// Deal with case where all borders are out of view
			if (y > svgClientRect.height - 200) {
				y = 0;
				offsetY = '110%';
			}
		}

		return { y, offsetY };
	};
	let { y, offsetY } = $derived(getYAndOffset());

	const getOffsetX = () => {
		if (hoverInfoNode === null) return '0%';
		let offset = '-50%';
		if (x - maxWidth / 2 < 0) offset = '0%';
		if (x + maxWidth / 2 > svgClientRect.width) offset = '-100%';

		return offset;
	};
	const offsetX = $derived(getOffsetX());

	const getBodyText = () => {
		if (hoverData === null) return '';
		if (['map', 'parliament', 'barchart'].includes(visType)) {
			const seatProperties = data.features.find(
				(d) => d.properties.idx === hoverData.idx
			).properties;
			return `
				<span>${hoverData.area_seat.split('_')[0]}</span><br>
				<span>Seat ${seatProperties.placement.split('/')[0]} of ${seatProperties.placement.split('/')[1]}</span><br>
				<span>${seatProperties.first_name} ${seatProperties.surname}</span>
				
			`;
		} else {
			return `${hoverData.year}: ${(data.find((d) => d.year === hoverData.year && d.party === hoverData.party).percentage * 100).toFixed(1)}%`;
		}
	};

	const bodyText = $derived(getBodyText());
</script>

{#if hoverData !== null}
	<div
		bind:this={hoverInfoNode}
		class="hover-info"
		style="left: {x}px; top: {y}px;"
		style:transform="translate({offsetX}, {offsetY})"
	>
		<div class="hover-info-color" style="background-color: {colorScale(hoverData.party)};"></div>
		<div class="hover-info-content" style:min-width="{minWidth}px" style:max-width="{maxWidth}px">
			<p class="title-text" style="color: {colorScale(hoverData.party)};">
				{hoverData.party}
			</p>
			<p>{@html bodyText}</p>
		</div>
	</div>
{/if}

<style>
	.hover-info {
		position: absolute;
		background-color: white;
		border: 1px solid black;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		pointer-events: none;
		display: flex;
	}
	.hover-info-color {
		width: 5px;
		height: 100%;
	}
	.hover-info-content {
		padding: 10px;
		flex-grow: 1;
	}
	.title-text {
		font-weight: bold;
		margin: 0;
	}
	p {
		font-family: 'Inter', sans-serif;
		margin: 3px 0;
	}

	@media (max-width: 400px) {
		.hover-info {
			font-size: 14px;
			/* grid-template-columns: repeat(2, 1fr); Change to 2 columns */
		}
	}
</style>
