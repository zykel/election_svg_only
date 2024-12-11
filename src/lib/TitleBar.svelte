<script>
	import VisTypeButton from '$lib/VisTypeButton.svelte';

	let {
		visTypeToCheckFor,
		visType = $bindable(),
		visTypePrev = $bindable(),
		tl = $bindable(),
		isAnimating,
		hoverDataSeats = $bindable(),
		hoverDataPercentages = $bindable()
	} = $props();
</script>

<div class="title-bar-container">
	<div class="title-text-container">
		<h1>Toghchán '24</h1>
	</div>

	<div class="title-button-container">
		<VisTypeButton
			visTypeToCheckFor={'map'}
			bind:visType
			bind:visTypePrev
			bind:tl
			{isAnimating}
			bind:hoverDataSeats
			bind:hoverDataPercentages
		/>
		<VisTypeButton
			visTypeToCheckFor={'parliament'}
			bind:visType
			bind:visTypePrev
			bind:tl
			{isAnimating}
			bind:hoverDataSeats
			bind:hoverDataPercentages
		/>
		<VisTypeButton
			visTypeToCheckFor={'barchart'}
			bind:visType
			bind:visTypePrev
			bind:tl
			{isAnimating}
			bind:hoverDataSeats
			bind:hoverDataPercentages
		/>
		<VisTypeButton
			visTypeToCheckFor={'percentages'}
			bind:visType
			bind:visTypePrev
			bind:tl
			{isAnimating}
			bind:hoverDataSeats
			bind:hoverDataPercentages
		/>
	</div>
</div>

<style>
	.title-bar-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: hsl(144 48% 71% / 1); /*#aedbb5;*/
		padding: 10px 15px;
		font-family: 'Inter', sans-serif;
	}

	h1 {
		margin: 0.2rem 0;
	}

	@media (max-width: 400px) {
		.title-bar-container {
			padding: 5px 15px;
		}
	}
</style>
