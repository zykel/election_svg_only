<script>
	import { interpolateString } from 'd3-interpolate';
	import * as flubber from 'flubber';
	import gsap from 'gsap-trial/dist/gsap';
	import MorphSVGPlugin from 'gsap-trial/dist/MorphSVGPlugin';
	import { cubicInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { duration } from '$lib/p.svelte.js';

	let { tl, idx, area_seat, pathString, fill, animateFast = $bindable(), opacity } = $props();

	// gsap.to("#path", {duration: 2, morphSVG: "M10 315 L 110 215 A 30 50 0 0 1 162.55 162.45 L 172.55 152.45 A 30 50 -45 0 1 215.1 109.9 L 315 10"});

	let seatPath = $state(null);

	const pathStringInitial = pathString;

	$effect(() => {
		if (seatPath) {
			if (tl === null) {
				gsap.set(seatPath, {
					attr: { d: pathString, opacity }
				});
			} else {
				tl.to(
					seatPath,
					{
						duration,
						morphSVG: pathString,
						attr: { opacity },
						ease: 'power1.inOut',
						onComplete: () => {
							animateFast = true;
						}
					},
					0
				);
			}
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
<path
	bind:this={seatPath}
	id="path-{idx}-{area_seat}"
	class="seat-path"
	d={pathStringInitial}
	{fill}
	stroke="white"
	stroke-width="0.5"
	opacity="1"
></path>
