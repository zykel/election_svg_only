<script>
	import { colorScale } from './p.svelte';

	let { data, hoverData, mapWidth, mapHeight, visType } = $props();

	const getY = (hoverData) => {
		let y = 0;
		if (hoverData !== null) {
			y = hoverData.node.getBBox().y - height - hoverBoxMargin;
			if (y < hoverBoxMargin) {
				y = hoverData.node.getBBox().y + hoverData.node.getBBox().height + hoverBoxMargin;
			}
			if (y + height > mapHeight - hoverBoxMargin) {
				y = hoverBoxMargin;
			}
		}

		return y;
	};

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

	let cx = $derived(
		hoverData !== null ? hoverData.node.getBBox().x + hoverData.node.getBBox().width / 2 : 0
	);
	let y = $derived(getY(hoverData));
	let x = $derived(
		Math.max(hoverBoxMargin, Math.min(mapWidth - width - hoverBoxMargin, cx - width / 2))
	);

	const getBodyText = () => {
		if (hoverData === null) return '';
		if (['map', 'parliament', 'barchart'].includes(visType)) {
			return `${hoverData.area_seat.split('_')[0]} (${hoverData.area_seat.split('_')[1]})`;
			// return data.features.filter((d) => d.properties.party === hoverData.party).length;
		} else {
			return `${hoverData.year}: ${(data.find((d) => d.year === hoverData.year && d.party === hoverData.party).percentage * 100).toFixed(1)}%`;
		}
	};

	const bodyText = $derived(getBodyText());
</script>

{#if hoverData !== null}
	<rect {x} {y} {width} {height} fill="white" stroke="black" stroke-width={strokeWidth} />
	<rect
		{x}
		{y}
		width={5}
		{height}
		fill={colorScale(hoverData.party)}
		stroke="black"
		stroke-width={strokeWidth}
	/>
	<g bind:this={textGroup} class="hover-text-g">
		<text bind:this={textTitle} class="title-text" x={x + 10} y={y + 20}>{hoverData.party}</text>
		<text bind:this={textBody} x={x + 10} y={y + 40}>{bodyText}</text>
	</g>
{/if}

<style>
	.title-text {
		font-weight: bold;
	}
	text {
		font-family: 'Roboto', sans-serif;
	}
	rect,
	text {
		pointer-events: none;
	}
</style>
