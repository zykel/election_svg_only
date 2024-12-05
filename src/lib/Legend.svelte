<script>
	import { parties, colorScale } from '$lib/p.svelte.js';

	let { legendHeight, legendWidth, visType, dataSeats, dataPercentages, dataSeatCounts2019 } =
		$props();

	const margin = 10;

	const partyData = parties.map((party, i) => {
		// Seats
		const seats = dataSeats.features.filter((d) => d.properties.party === party).length;
		// const müdataSeatCounts2019 = dataSeatCounts2019;
		// debugger;
		const seatsPrev = dataSeatCounts2019[party];
		const seatDiff = seats - seatsPrev;
		const seatSign = seatDiff >= 0 ? '+' : '-';

		// Percentages
		const percentage =
			Math.round(
				dataPercentages.find((d) => d.year === 2024 && d.party === party).percentage * 1000
			) / 10;
		const percentagePrev =
			Math.round(
				dataPercentages.find((d) => d.year === 2020 && d.party === party).percentage * 1000
			) / 10;
		const percentageDiff = Math.round((percentage - percentagePrev) * 10) / 10;
		const percentageSign = percentageDiff >= 0 ? '+' : '-';

		return {
			party,
			x: margin + ((i % 3) / 3) * (legendWidth - 2 * margin),
			y: margin + (Math.floor(i / 3) / 3) * (legendHeight - 2 * margin) + 16,
			seatInfo: `<tspan style="font-weight: bold">${seats}</tspan> seats (${seatSign}${Math.abs(seatDiff)})`,
			percentageInfo: `<tspan style="font-weight: bold">${percentage}%</tspan> (${percentageSign}${Math.abs(percentageDiff)}%)`
		};
	});
</script>

<rect x="0" y="0" width={legendWidth} height={legendHeight} fill="white" />
{#each partyData as { party, x, y, seatInfo, percentageInfo }}
	<text class="legend-party-title" {x} {y} fill={colorScale(party)}>{party}</text>
	<text {x} y={y + 20} fill="black"
		>{@html visType === 'percentages' ? percentageInfo : seatInfo}</text
	>
{/each}

<style>
	.legend-party-title {
		font-weight: bold;
	}
	text {
		font-family: 'Roboto', sans-serif;
	}
</style>
