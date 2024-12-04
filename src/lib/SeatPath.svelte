<script>
	import { interpolateString } from 'd3-interpolate';
	import * as flubber from 'flubber';
	import gsap from 'gsap-trial/dist/gsap';
	import MorphSVGPlugin from 'gsap-trial/dist/MorphSVGPlugin';
	import { cubicInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { duration, delay, colorScale } from '$lib/p.svelte.js';

	let {
		tl,
		idx,
		area_seat,
		pathString,
		opacity,
		delayAnimation,
		zooming,
		hoverData = $bindable(),
		visType,
		party
	} = $props();

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
						delay: delayAnimation ? delay : 0
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
	const getOpacity = (hoverData, seatPath) => {
		if (hoverData !== null && hoverData.node !== seatPath) {
			return 0.7;
		} else {
			return 1;
		}
	};
	const getStroke = (hoverData, seatPath) => {
		if (hoverData !== null && hoverData.node === seatPath) {
			return 'white';
		} else {
			return 'white';
		}
	};
	const getStrokeWidth = (hoverData, seatPath) => {
		return 0.5;
		if (hoverData !== null && hoverData.node === seatPath) {
			return 2;
		} else {
			return 0.5;
		}
	};
</script>

<!-- d={showMap ? pathString : $pathTween} -->
<!-- 
	onpointermove={() => {
		if (!zooming) {
			hoverData = { type: 'seat', idx, party, area_seat, node: seatPath };
		}
	}} -->
<path
	bind:this={seatPath}
	onpointermove={() => {
		if (!zooming) {
			hoverData = { type: 'seat', idx, party, area_seat, node: seatPath };
		}
	}}
	onpointerenter={() => {
		if (!zooming) {
			hoverData = { type: 'seat', idx, party, area_seat, node: seatPath };
		}
	}}
	id="path-{idx}-{area_seat}"
	class="seat-path"
	d={pathStringInitial}
	fill={colorScale(party)}
	stroke={getStroke(hoverData, seatPath)}
	stroke-width={getStrokeWidth(hoverData, seatPath)}
	style:opacity={getOpacity(hoverData, seatPath)}
	style:cursor={visType !== 'map' ? 'pointer' : zooming ? 'grabbing' : 'grab'}
></path>

<style>
	path {
		transition: opacity 0.1s;
	}
</style>
