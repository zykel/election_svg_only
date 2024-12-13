<script>
	import VisTypeButton from '$lib/VisTypeButton.svelte';
	import VisTypeButtonPercentages from '$lib/VisTypeButtonPercentages.svelte';
	import VisTypeButtonBarchart from '$lib/VisTypeButtonBarchart.svelte';
	import VisTypeButtonParliament from '$lib/VisTypeButtonParliament.svelte';
	import VisTypeButtonMap from '$lib/VisTypeButtonMap.svelte';

	let {
		visTypeToCheckFor,
		visType = $bindable(),
		visTypePrev = $bindable(),
		tl = $bindable(),
		isAnimating,
		hoverDataSeats = $bindable(),
		hoverDataPercentages = $bindable()
	} = $props();

	const color = 'rgb(40, 40, 40)';
	const backgroundColor = 'hsl(144 48% 71% / 1)';
	const w = 70;
	const h = 100;

	const marginVert = h / 4;
	const marginHor = w / 8;
</script>

<div class="title-bar-container" style:background-color={backgroundColor}>
	<div class="title-text-container">
		<h1 style:color>Toghchán '24</h1>
	</div>

	<div class="title-button-container">
		<!-- <VisTypeButton
			visTypeToCheckFor={'map'}
			bind:visType
			bind:visTypePrev
			bind:tl
			{isAnimating}
			bind:hoverDataSeats
			bind:hoverDataPercentages
		/> -->
		<!-- <VisTypeButton
			visTypeToCheckFor={'parliament'}
			bind:visType
			bind:visTypePrev
			bind:tl
			{isAnimating}
			bind:hoverDataSeats
			bind:hoverDataPercentages
		/> -->
		<!-- <VisTypeButton
			visTypeToCheckFor={'barchart'}
			bind:visType
			bind:visTypePrev
			bind:tl
			{isAnimating}
			bind:hoverDataSeats
			bind:hoverDataPercentages
		/> -->
		<VisTypeButtonMap
			visTypeToCheckFor={'map'}
			bind:visType
			bind:visTypePrev
			bind:tl
			{isAnimating}
			bind:hoverDataSeats
			bind:hoverDataPercentages
			{color}
			{w}
			{h}
			{marginVert}
			{marginHor}
		/>
		<VisTypeButtonParliament
			visTypeToCheckFor={'parliament'}
			bind:visType
			bind:visTypePrev
			bind:tl
			{isAnimating}
			bind:hoverDataSeats
			bind:hoverDataPercentages
			{color}
			{w}
			{h}
			{marginVert}
			{marginHor}
		/>
		<VisTypeButtonBarchart
			visTypeToCheckFor={'barchart'}
			bind:visType
			bind:visTypePrev
			bind:tl
			{isAnimating}
			bind:hoverDataSeats
			bind:hoverDataPercentages
			{color}
			{w}
			{h}
			{marginVert}
			{marginHor}
		/>
		<VisTypeButtonPercentages
			visTypeToCheckFor={'percentages'}
			bind:visType
			bind:visTypePrev
			bind:tl
			{isAnimating}
			bind:hoverDataSeats
			bind:hoverDataPercentages
			{color}
			{w}
			{h}
			{marginVert}
			{marginHor}
		/>
		<!-- <VisTypeButton
			visTypeToCheckFor={'percentages'}
			bind:visType
			bind:visTypePrev
			bind:tl
			{isAnimating}
			bind:hoverDataSeats
			bind:hoverDataPercentages
		/> -->
	</div>
</div>

<style>
	.title-bar-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0px 15px;
		font-family: 'Inter', sans-serif;
	}

	.title-button-container {
		height: 3.5rem;
	}

	h1 {
		margin: 0.2rem 0;
		font-size: 1.75rem;
	}

	@media (max-width: 400px) {
		.title-bar-container {
			padding: 0px 15px;
		}
	}
</style>
