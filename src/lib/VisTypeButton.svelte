<script>
	import gsap from 'gsap-trial/dist/gsap';

	let {
		visTypeToCheckFor,
		visType = $bindable(),
		visTypePrev = $bindable(),
		tl = $bindable(),
		isAnimating
	} = $props();
</script>

<button
	style:color={visType === visTypeToCheckFor || isAnimating ? 'gray' : 'black'}
	onclick={() => {
		if (visType !== visTypeToCheckFor && !isAnimating) {
			visTypePrev = visType;
			visType = visTypeToCheckFor;
			tl = gsap.timeline({
				onComplete: () => {
					// Do something at the end of the timeline
					tl = null;
				}
			});
		}
	}}>{visTypeToCheckFor}</button
>
