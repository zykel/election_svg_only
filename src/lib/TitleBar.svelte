<script>
	import VisTypeButton from '$lib/VisTypeButton.svelte';

	let {
		visTypeToCheckFor,
		visType = $bindable(),
		visTypePrev = $bindable(),
		tl = $bindable(),
		isAnimating
	} = $props();
</script>

<div class="title-bar-container">
	<div class="title-text-container">
		<h1>Ire-lection</h1>
	</div>

	<div class="title-button-container">
		<VisTypeButton visTypeToCheckFor={'map'} bind:visType bind:visTypePrev bind:tl {isAnimating} />
		<VisTypeButton
			visTypeToCheckFor={'parliament'}
			bind:visType
			bind:visTypePrev
			bind:tl
			{isAnimating}
		/>
		<VisTypeButton
			visTypeToCheckFor={'barchart'}
			bind:visType
			bind:visTypePrev
			bind:tl
			{isAnimating}
		/>
		<VisTypeButton
			visTypeToCheckFor={'percentages'}
			bind:visType
			bind:visTypePrev
			bind:tl
			{isAnimating}
		/>
	</div>
</div>

<style>
	.title-bar-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: lightgray;
		padding: 10px;
		font-family: 'Roboto', sans-serif;
	}

	h1 {
		margin: 0.2rem 0;
	}
</style>
