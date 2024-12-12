<script>
	import gsap from 'gsap-trial/dist/gsap';
	import { colorScale, partyToAbbrev, duration, durationFast, delay } from '$lib/p.svelte.js';

	let { tl, x, y, party, value, opacity, delayAnimation, changingVisCategory = false } = $props();

	const opacityInitial = 0;

	let textNode = $state(null);
	let textNodeWhite = $state(null);

	$effect(() => {
		if (textNode) {
			textNode.style.display = 'block';
			if (tl === null) {
				gsap.set(textNode, {
					attr: { opacity }
				});
			} else {
				tl.to(
					textNode,
					{
						duration: durationFast,
						attr: { opacity },
						ease: 'power1.inOut',
						delay: delayAnimation ? (changingVisCategory ? 2 * duration : duration) : 0,
						onComplete: () => {
							if (opacity === 0) textNode.style.display = 'none';
						}
					},
					0
				);
			}
		}
	});
	$effect(() => {
		if (textNodeWhite) {
			textNodeWhite.style.display = 'block';
			if (tl === null) {
				gsap.set(textNodeWhite, {
					attr: { opacity }
				});
			} else {
				tl.to(
					textNodeWhite,
					{
						duration: durationFast,
						attr: { opacity },
						ease: 'power1.inOut',
						delay: delayAnimation ? (changingVisCategory ? 2 * duration : duration) : 0,
						onComplete: () => {
							if (opacity === 0) textNodeWhite.style.display = 'none';
						}
					},
					0
				);
			}
		}
	});

	const fontSize = 24;
</script>

<text
	bind:this={textNodeWhite}
	opacity={opacityInitial}
	x={x + 10}
	y={y + fontSize * 0.4}
	font-size={fontSize}
	stroke="white"
	stroke-width="4"
	fill={colorScale(party)}
	text-anchor="start"
>
	{value}
</text>
<text
	bind:this={textNode}
	opacity={opacityInitial}
	x={x + 10}
	y={y + fontSize * 0.4}
	font-size={fontSize}
	fill={colorScale(party)}
	text-anchor="start"
>
	{value}
</text>

<style>
	text {
		font-family: 'Inter', sans-serif;
	}
</style>
