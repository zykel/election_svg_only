<script>
	let { svgLayer = $bindable(), map, mapMoveNotifyToggle, data } = $props();

	let lng = -7.807195714694519;
	let lat = 53.41035563891312;

	let cx = $state(0);
	let cy = $state(0);

	let pathData = $state([]);
	$inspect(pathData);

	console.log(data);

	$effect(() => {
		const pathDataTmp = [];

		data.features.forEach((feature) => {
			const coordinates = feature.geometry.coordinates[0];
			const pathString =
				coordinates
					.map((coord, i) => {
						if (typeof coord[0] === 'number' && typeof coord[1] === 'number') {
							const point = map.project([coord[0], coord[1]]);
							return `${i === 0 ? 'M' : 'L'}${point.x},${point.y}`;
						}
					})
					.join(' ') + ' Z';
			pathDataTmp.push(pathString);
		});

		pathData = pathDataTmp;

		mapMoveNotifyToggle;
		cx = map.project([lng, lat]).x;
		cy = map.project([lng, lat]).y;
	});
</script>

<svg bind:this={svgLayer} class="test-svg" width="100%" height="100%">
	<rect width="100" height="100" fill="red"> </rect>
	<circle {cx} {cy} r="10" fill="blue"></circle>
	{#each pathData as pathString}
		<path d={pathString} fill="none" stroke="red"></path>
	{/each}
</svg>

<style>
	.test-svg {
		position: absolute;
		z-index: 2;
	}
</style>
