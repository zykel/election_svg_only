<script>
	let { svgLayer = $bindable(), map, mapMoveNotifyToggle } = $props();

	let lng = -7.807195714694519;
	let lat = 53.41035563891312;

	let cx = $state(0);
	let cy = $state(0);

	$effect(() => {
		mapMoveNotifyToggle;
		cx = map.project([lng, lat]).x;
		cy = map.project([lng, lat]).y;
	});
</script>

<svg bind:this={svgLayer} class="test-svg" width="100%" height="100%">
	<rect width="100" height="100" fill="red"> </rect>
	<circle {cx} {cy} r="10" fill="blue"></circle>
</svg>

<style>
	.test-svg {
		position: absolute;
		z-index: 2;
	}
</style>
