<script>
	import { interpolateString } from 'd3-interpolate';
	import * as flubber from 'flubber';
	import gsap from 'gsap-trial/dist/gsap';
	import MorphSVGPlugin from 'gsap-trial/dist/MorphSVGPlugin';
	import { cubicInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { duration, delay } from '$lib/p.svelte.js';

	let {
		tl,
		year,
		party,
		percentage,
		x,
		y,
		x0,
		opacity,
		width,
		height,
		fill,
		delayAnimation,
		hoverDataPercentages = $bindable()
	} = $props();

	// gsap.to("#path", {duration: 2, morphSVG: "M10 315 L 110 215 A 30 50 0 0 1 162.55 162.45 L 172.55 152.45 A 30 50 -45 0 1 215.1 109.9 L 315 10"});

	let percentageRect = $state(null);

	$effect(() => {
		percentageRect.style.display = 'block';
		if (percentageRect && tl !== null) {
			tl.to(
				percentageRect,
				{
					duration,
					attr: { width },
					ease: 'power1.inOut',
					delay: delayAnimation ? delay : 0,
					onComplete: () => {
						if (width === 0) percentageRect.style.display = 'none';
					}
				},
				0
			);
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

	const getOpacity = (hoverDataPercentages, percentageRect) => {
		return opacity;
		if (hoverDataPercentages !== null) {
			if (hoverDataPercentages.node === percentageRect) {
				return 1;
			} else {
				return opacity * 0.7;
			}
		} else {
			return opacity;
		}
	};

	const updatehoverDataPercentages = () => {
		hoverDataPercentages = { type: 'percentage', party, node: percentageRect, year };
	};
</script>

<rect
	bind:this={percentageRect}
	onpointermove={updatehoverDataPercentages}
	onpointerenter={updatehoverDataPercentages}
	class="percentage-rect-{party}"
	{x}
	{y}
	width={0}
	{height}
	{fill}
	stroke={hoverDataPercentages !== null && hoverDataPercentages.node === percentageRect
		? 'black'
		: 'white'}
	stroke-width={hoverDataPercentages !== null && hoverDataPercentages.node === percentageRect
		? 2
		: 1}
	style:display="none"
	fill-opacity={getOpacity(hoverDataPercentages, percentageRect)}
	style:cursor="pointer"
></rect>
