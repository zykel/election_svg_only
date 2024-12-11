<script>
	import gsap from 'gsap-trial/dist/gsap';

	let {
		visTypeToCheckFor,
		visType = $bindable(),
		visTypePrev = $bindable(),
		tl = $bindable(),
		isAnimating,
		hoverDataSeats = $bindable(),
		hoverDataPercentages = $bindable()
	} = $props();
</script>

<button
	style:color={visType === visTypeToCheckFor || isAnimating ? 'gray' : 'black'}
	onclick={() => {
		if (visType !== visTypeToCheckFor && !isAnimating) {
			visTypePrev = visType;
			visType = visTypeToCheckFor;
			// Set hoverData to 0 if the vis category changes
			if ([visType, visTypePrev].includes('percentages')) {
				hoverDataSeats = null;
				hoverDataPercentages = null;
			}

			tl = gsap.timeline({
				onComplete: () => {
					// Do something at the end of the timeline
					tl = null;
				}
			});
		}
	}}>{visTypeToCheckFor[0]}</button
>
