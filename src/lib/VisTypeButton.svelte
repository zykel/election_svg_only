<script>
	let {
		visTypeToCheckFor,
		visType = $bindable(),
		visTypePrev = $bindable(),
		animateFast = $bindable(),
		isAnimating
	} = $props();
</script>

<button
	style:color={visType === visTypeToCheckFor || isAnimating ? 'gray' : 'black'}
	onclick={() => {
		if (visType !== visTypeToCheckFor && !isAnimating) {
			animateFast = false;
			visTypePrev = visType;
			visType = visTypeToCheckFor;
		}
	}}>{visTypeToCheckFor}</button
>
