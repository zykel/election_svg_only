<script>
	import gsap from 'gsap-trial/dist/gsap';
	import { colorScale, partyToAbbrev, duration, durationFast, delay } from '$lib/p.svelte.js';

	let { tl, rectData, opacity, delayAnimation } = $props();

	let text20 = $state(null);
	let text24 = $state(null);

	$effect(() => {
		if (text20) {
			text20.style.display = 'block';
			if (tl === null) {
				gsap.set(text20, {
					attr: { opacity }
				});
			} else {
				tl.to(
					text20,
					{
						duration: durationFast,
						attr: { opacity },
						ease: 'power1.inOut',
						delay: delayAnimation ? duration : 0,
						onComplete: () => {
							if (opacity === 0) text20.style.display = 'none';
						}
					},
					0
				);
			}
		}
	});
	$effect(() => {
		if (text24) {
			text24.style.display = 'block';
			if (tl === null) {
				gsap.set(text24, {
					attr: { opacity }
				});
			} else {
				tl.to(
					text24,
					{
						duration: durationFast,
						attr: { opacity },
						ease: 'power1.inOut',
						delay: delayAnimation ? duration : 0,
						onComplete: () => {
							if (opacity === 0) text24.style.display = 'none';
						}
					},
					0
				);
			}
		}
	});

	const fontSize = 16;
</script>

<text
	bind:this={text20}
	x={rectData.find((d) => d.year === 2020).x + 1}
	y={rectData.find((d) => d.year === 2020).y + fontSize - 2}
	font-size={fontSize}
	fill="gray"
	text-anchor="start"
>
	2020
</text>
<text
	bind:this={text24}
	x={rectData.find((d) => d.year === 2024).x + 1}
	y={rectData.find((d) => d.year === 2024).y + fontSize - 2}
	font-size={fontSize}
	fill="black"
	text-anchor="start"
>
	2024
</text>

<style>
	text {
		font-family: 'Inter', sans-serif;
	}
</style>
