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
			seatInfo: `<tspan style="font-weight: bold">${seats}</tspan> seats (${seatSign}${Math.abs(seatDiff)})`,
			percentageInfo: `<tspan style="font-weight: bold">${percentage}%</tspan> (${percentageSign}${Math.abs(percentageDiff)}%)`
		};
	});
</script>

<div class="legend-grid-container">
	{#each partyData as { party, seatInfo, percentageInfo }}
		<div class="legend-grid-item">
			<p style:color={colorScale(party)} class="legend-party-title">{party}</p>
			<p>{@html visType === 'percentages' ? percentageInfo : seatInfo}</p>
		</div>
	{/each}
</div>

<style>
	.legend-grid-container {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
	}
	.legend-grid-item {
		margin: 10px;
	}
	.legend-party-title {
		font-weight: bold;
	}
	p {
		margin: 3px 0px;
		font-family: 'Roboto', sans-serif;
	}
</style>
