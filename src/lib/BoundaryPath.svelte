<script>
	import { interpolateString } from 'd3-interpolate';
	import gsap from 'gsap-trial/dist/gsap';
	import { duration, delay } from '$lib/p.svelte.js';

	let {
		tl,
		idx,
		pathString,
		constituency,
		opacity,
		delayAnimation,
		changingVisCategory = false
	} = $props();

	let boundaryPath = $state(null);

	const pathStringInitial = pathString;

	$effect(() => {
		if (boundaryPath) {
			boundaryPath.style.display = 'block';
			if (tl === null) {
				gsap.set(boundaryPath, {
					attr: { d: pathString, opacity }
				});
			} else {
				gsap.set(boundaryPath, {
					attr: { d: pathString }
				});
				tl.to(
					boundaryPath,
					{
						duration: 0,
						attr: { opacity },
						ease: 'power1.inOut',
						delay: delayAnimation ? (changingVisCategory ? 2 * duration : duration) : 0,
						onComplete: () => {
							if (opacity === 0) boundaryPath.style.display = 'none';
						}
					},
					0
				);
			}
		}
	});
</script>

<path
	bind:this={boundaryPath}
	id="path-{idx}-{constituency?.replace(' ', '-')}"
	class="boundary-path"
	d={pathString}
	fill="none"
	stroke="white"
	stroke-width="1.5"
	opacity="1"
></path>
