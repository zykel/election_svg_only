<script>
	import gsap from 'gsap-trial/dist/gsap';
	import { duration, durationFast, delay } from '$lib/p.svelte.js';

	let { tl, mapWidth, mapHeight, opacity, delayAnimation, changingVisCategory = false } = $props();

	const yAnchor = mapHeight * 0.9;

	const fontsizeNumber = 57;
	const fontsizeWord = (fontsizeNumber / 3) * 2;

	let textG = $state(null);

	$effect(() => {
		if (textG) {
			textG.style.display = 'block';
			if (tl === null) {
				gsap.set(textG, {
					attr: { opacity }
				});
			} else {
				tl.to(
					textG,
					{
						duration: durationFast,
						attr: { opacity },
						ease: 'power1.inOut',
						delay: delayAnimation ? (changingVisCategory ? 2 * duration : duration) : 0,
						onComplete: () => {
							if (opacity === 0) textG.style.display = 'none';
						}
					},
					0
				);
			}
		}
	});
</script>

<g bind:this={textG}>
	<text
		class="parliament-legend-number"
		x={mapWidth / 2}
		y={yAnchor - 40}
		font-size={fontsizeNumber}
		text-anchor="middle"
	>
		174
	</text>
	<text
		class="parliament-legend-word"
		x={mapWidth / 2}
		y={yAnchor}
		font-size={fontsizeWord}
		text-anchor="middle"
	>
		seats
	</text>
</g>

<style>
	.parliament-legend-number {
		fill: rgb(132, 132, 132);
		font-family: 'Inter', sans-serif;
		font-weight: bold;
	}
	.parliament-legend-word {
		fill: rgb(132, 132, 132);
		font-family: 'Inter', sans-serif;
		font-weight: bold;
	}
</style>
