<script>
	import { interpolateString } from 'd3-interpolate';
	import * as flubber from 'flubber';
	import { cubicInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	let { idx, area_seat, pathString, showMap } = $props();

	const pathTween = tweened(pathString, {
		interpolate: flubber.interpolate,
		duration: 4000,
		easing: cubicInOut
	});

	$effect(() => {
		pathTween.set(pathString);
	});
</script>

<!-- d={showMap ? pathString : $pathTween} -->
<path
	id="path-{idx}-{area_seat}"
	class="seat-path"
	d={$pathTween}
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
	][idx % 9]}
	stroke="white"
	stroke-width="1"
	opacity="1"
></path>
