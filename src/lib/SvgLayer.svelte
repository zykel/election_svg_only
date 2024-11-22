<script>
	import { geoPath, geoMercator, geoTransform } from 'd3-geo';
	import { selectAll } from 'd3';
	import { onMount } from 'svelte';

	let { svgLayer = $bindable(), data, mapWidth, mapHeight } = $props();

	let lng = -7.807195714694519;
	let lat = 53.41035563891312;
	let scale = 1 << 12;

	let pathData = $state([]);

	const pathDataTmp = [];

	const projection = geoMercator()
		.scale(scale)
		.translate([mapWidth / 2, mapHeight / 2])
		.center([lng, lat]);

	const pathGenerator = geoPath(projection);

	data.features.forEach((feature) => {
		const pathString = pathGenerator(feature);
		pathDataTmp.push({ id: feature.id, pathString });
	});

	pathData = pathDataTmp;

	onMount(() => {
		// document.addEventListener('click', (e) => {
		// 	selectAll('.region-path')
		// 		.filter((d, i) => {
		// 			const bbox = document.getElementById(`path-${i}`).getBoundingClientRect();
		// 			return bbox.height > 600;
		// 		})
		// 		.attr('opacity', 0);
		// });
	});
</script>

<svg bind:this={svgLayer} class="test-svg" width="100%" height="100%">
	<g class="region-paths-g">
		{#each pathData as { id, pathString }, i}
			<path
				id="path-{i}"
				class="region-path"
				d={pathString}
				fill={[
					'#00C24A',
					'#009C77',
					'#01B3DD',
					'#F2471C',
					'#A7C54E',
					'#76267F',
					'#E2A739',
					'#E2A739',
					'#AEAEAE'
				][i % 9]}
				stroke="white"
			></path>
		{/each}
	</g>
</svg>

<style>
	.test-svg {
		position: absolute;
		z-index: 2;
	}
</style>
