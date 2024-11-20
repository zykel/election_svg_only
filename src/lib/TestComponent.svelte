<script>
	let { svgLayer = $bindable(), map, printcount } = $props();

	$inspect(printcount);
</script>

<svg bind:this={svgLayer} class="test-svg" width="200" height="200">
	<rect width="100" height="100" fill="red"> </rect>
</svg>

<style>
	.test-svg {
		background-color: lightblue;
		position: absolute;
		z-index: 2;
	}
</style>
