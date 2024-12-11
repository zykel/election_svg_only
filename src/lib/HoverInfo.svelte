<script>
	import { colorScale } from './p.svelte';

	let { data, hoverData, mapWidth, mapHeight, visType } = $props();

	// const getY = (hoverData) => {
	// 	let y = 0;
	// 	if (hoverData !== null) {
	// 		y = hoverData.node.getBBox().y - height - hoverBoxMargin;
	// 		if (y < hoverBoxMargin) {
	// 			y = hoverData.node.getBBox().y + hoverData.node.getBBox().height + hoverBoxMargin;
	// 		}
	// 		if (y + height > mapHeight - hoverBoxMargin) {
	// 			y = hoverBoxMargin;
	// 		}
	// 	}

	// 	return y;
	// };

	let hoverInfoNode = $state(null);

	const minWidth = 150;
	const maxWidth = 200;

	const getWidth = (textTitle, textBody, hoverData) => {
		let width = 300;
		if (textTitle !== null) {
			width = textTitle.getBBox().width + 20;
		}
		if (textBody !== null) {
			width = Math.max(width, textBody.getBBox().width + 20);
		}
		return width;
	};

	const getWidthG = (textGroup, hoverData) => {
		let width = 300;
		if (textGroup !== null) {
			width = textGroup.getBBox().width + 20;
		}
		return width;
	};

	let textGroup = $state(null);
	let textTitle = $state(null);
	let textBody = $state(null);
	const width = $derived(getWidth(textTitle, textBody, hoverData));

	const hoverBoxMargin = 5;
	// const width = 200;
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
		return hovernodeClientRect.x - svgClientRect.x + hovernodeClientRect.width / 2;
	};

	const getYAndOffset = () => {
		if (hoverData === null) return 0;
		let y = hovernodeClientRect.y - svgClientRect.y - 5;
		let offsetY = '-100%';
		if (y - 200 < 0) {
			y += hovernodeClientRect.height + 2 * 5;
			offsetY = '0%';
			if (y > svgClientRect.height - 200) {
				y = 0;
				offsetY = '110%';
			}
		}

		return { y, offsetY };
	};
	let cx = $derived(getX());
	let { y, offsetY } = $derived(getYAndOffset());
	let x = $derived(
		Math.max(hoverBoxMargin, Math.min(mapWidth - width - hoverBoxMargin, cx - width / 2))
	);

	const getBodyText = () => {
		if (hoverData === null) return '';
		if (['map', 'parliament', 'barchart'].includes(visType)) {
			const mühoverData = hoverData;
			const müdata = data;
			const seatProperties = data.features.find(
				(d) => d.properties.idx === hoverData.idx
			).properties;
			return `${seatProperties.first_name} ${hoverData.area_seat.split('_')[0]} (${hoverData.area_seat.split('_')[1]})`;
			// return data.features.filter((d) => d.properties.party === hoverData.party).length;
		} else {
			return `${hoverData.year}: ${(data.find((d) => d.year === hoverData.year && d.party === hoverData.party).percentage * 100).toFixed(1)}%`;
		}
	};

	const bodyText = $derived(getBodyText());

	const getOffsetX = () => {
		if (hoverInfoNode === null) return '0%';
		let offset = '-50%';
		if (cx - maxWidth / 2 < 0) offset = '0%';
		if (cx + maxWidth / 2 > svgClientRect.width) offset = '-100%';

		// deal with case where all borders are out of view
		return offset;
	};
	const offsetX = $derived(getOffsetX());

	const getOffsetY = () => {
		if (hoverInfoNode === null) return '0%';
		let offset = '-100%';
		if (y - 200 < 0) offset = '0%';

		// deal with case where all borders are out of view
		return offset;
	};
	// calc(-{hoverInfoNode?.getBoundingClientRect().width}px * 0.5)
</script>

{#if hoverData !== null}
	<div
		bind:this={hoverInfoNode}
		class="hover-info"
		style="left: {cx}px; top: {y}px;"
		style:transform="translate({offsetX}, {offsetY})"
	>
		<div class="hover-info-color" style="background-color: {colorScale(hoverData.party)};"></div>
		<div class="hover-info-content" style:min-width="{minWidth}px" style:max-width="{maxWidth}px">
			<p class="title-text" style="color: {colorScale(hoverData.party)};">
				{hoverData.party}
			</p>
			<p>{bodyText}</p>
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
