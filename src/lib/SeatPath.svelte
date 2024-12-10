<script>
	import { interpolateString } from 'd3-interpolate';
	import * as flubber from 'flubber';
	import gsap from 'gsap-trial/dist/gsap';
	import MorphSVGPlugin from 'gsap-trial/dist/MorphSVGPlugin';
	import { cubicInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { duration, delay, colorScale } from '$lib/p.svelte.js';
	import { pointer } from 'd3';

	let {
		tl,
		idx,
		area_seat,
		pathString,
		opacity,
		delayAnimation,
		zooming,
		hoverDataSeats = $bindable(),
		visType,
		party,
		isAnimating
	} = $props();

	// gsap.to("#path", {duration: 2, morphSVG: "M10 315 L 110 215 A 30 50 0 0 1 162.55 162.45 L 172.55 152.45 A 30 50 -45 0 1 215.1 109.9 L 315 10"});

	let seatPath = $state(null);

	const pathStringInitial = pathString;

	// const getOpacity = (hoverDataSeats, seatPath) => {
	// 	return opacity;
	// 	if (hoverDataSeats !== null && hoverDataSeats.node !== seatPath) {
	// 		return opacity * 0.7;
	// 	} else {
	// 		return opacity;
	// 	}
	// };

	$effect(() => {
		if (seatPath) {
			if (tl === null) {
				gsap.set(seatPath, {
					attr: { d: pathString, opacity: opacity }
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
	// const getStroke = (hoverDataSeats, seatPath) => {
	// 	if (hoverDataSeats !== null && hoverDataSeats.node === seatPath) {
	// 		return 'white';
	// 	} else {
	// 		return 'white';
	// 	}
	// };
	// const getStrokeWidth = (hoverDataSeats, seatPath) => {
	// 	return 0.5;
	// 	if (hoverDataSeats !== null && hoverDataSeats.node === seatPath) {
	// 		return 2;
	// 	} else {
	// 		return 0.5;
	// 	}
	// };

	const updatehoverDataSeats = () => {
		if (!zooming) {
			hoverDataSeats = { type: 'seat', idx, party, area_seat, node: seatPath };
		}
	};
</script>

<path
	bind:this={seatPath}
	onpointermove={updatehoverDataSeats}
	onpointerenter={updatehoverDataSeats}
	id="path-{idx}-{area_seat}"
	class="seat-path"
	d={pathStringInitial}
	fill={colorScale(party)}
	stroke={hoverDataSeats !== null && hoverDataSeats.node === seatPath ? 'black' : 'white'}
	stroke-width={hoverDataSeats !== null && hoverDataSeats.node === seatPath ? 2 : 0.5}
	style:cursor={visType !== 'map' ? 'pointer' : zooming ? 'grabbing' : 'grab'}
	style:pointer-events={visType === 'percentages' || isAnimating ? 'none' : 'auto'}
></path>

<style>
	path {
		transition: opacity 0.1s;
	}
</style>
