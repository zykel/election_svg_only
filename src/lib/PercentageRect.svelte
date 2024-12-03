<script>
	import { interpolateString } from 'd3-interpolate';
	import * as flubber from 'flubber';
	import gsap from 'gsap-trial/dist/gsap';
	import MorphSVGPlugin from 'gsap-trial/dist/MorphSVGPlugin';
	import { cubicInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { duration } from '$lib/p.svelte.js';

	let {
		year,
		party,
		percentage,
		x,
		y,
		y0,
		opacity,
		width,
		height,
		fill,
		animateFast = $bindable()
	} = $props();

	// gsap.to("#path", {duration: 2, morphSVG: "M10 315 L 110 215 A 30 50 0 0 1 162.55 162.45 L 172.55 152.45 A 30 50 -45 0 1 215.1 109.9 L 315 10"});

	let percentageRect = $state(null);

	$effect(() => {
		percentageRect.style.display = 'block';
		if (percentageRect) {
			gsap.to(percentageRect, {
				duration,
				attr: { y, height },
				ease: 'power1.inOut',
				// delay: 1.5,
				onComplete: () => {
					if (y === 0) percentageRect.style.display = 'none';
				}
			});
		}
	});

	// const pathTween = tweened(pathString, {
	// 	interpolate: flubber.interpolate,
	// 	duration: 4000,
	// 	easing: cubicInOut
	// });

	// $effect(() => {
	// 	pathTween.set(pathString);
	// });

	// d={$pathTween}
</script>

<!-- d={showMap ? pathString : $pathTween} -->
<rect
	bind:this={percentageRect}
	id="rect-percentage-{party}"
	class="percentage-rect"
	{x}
	y={y0}
	{width}
	height={0}
	{fill}
	{opacity}
	stroke="white"
	stroke-width="1"
	style:display="none"
></rect>
