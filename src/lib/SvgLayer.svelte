<script>
	import { geoPath, geoMercator, geoTransform } from 'd3-geo';
	import { selectAll } from 'd3';
	import { onMount } from 'svelte';

	let { svgLayer = $bindable(), map, mapMoveNotifyToggle, data, mapWidth, mapHeight } = $props();

	let lng = -7.807195714694519;
	let lat = 53.41035563891312;

	let cx = $state(0);
	let cy = $state(0);

	let pathData = $state([]);

	console.log(data);

	$effect(() => {
		const pathDataTmp = [];

		const getPoint = (coord) => {
			let { x, y } = map.project([coord[0], coord[1]]);
			return [x, y];
		};

		const projection = geoTransform({
			point: function (px, py) {
				this.stream.point(...getPoint([px, py]));
			}
		});

		const renderPath = geoPath(projection);

		data.features.forEach((feature) => {
			const pathString = renderPath(feature);
			pathDataTmp.push({ id: feature.id, pathString });
		});

		pathData = pathDataTmp;

		mapMoveNotifyToggle;
		cx = map.project([lng, lat]).x;
		cy = map.project([lng, lat]).y;
	});

	onMount(() => {
		document.addEventListener('click', (e) => {
			selectAll('.region-path')
				.filter((d, i) => {
					const bbox = document.getElementById(`path-${i}`).getBoundingClientRect();
					return bbox.height > 500;
				})
				.attr('opacity', 0);
		});
	});
</script>

<svg bind:this={svgLayer} class="test-svg" width="100%" height="100%">
	<g class="region-paths-g">
		{#each pathData as { id, pathString }, i}
			<path
				id="path-{i}"
				class="region-path"
				d={pathString}
				fill={['red', 'green', 'blue', 'yellow', 'pink'][i % 5]}
				opacity="0.2"
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
