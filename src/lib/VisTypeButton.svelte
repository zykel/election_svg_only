<script>
	let {
		visTypeToCheckFor,
		visType = $bindable(),
		animateFast = $bindable(),
		isAnimating
	} = $props();
</script>

<button
	style:color={visType === visTypeToCheckFor || isAnimating ? 'gray' : 'black'}
	onclick={() => {
		if (visType !== visTypeToCheckFor && !isAnimating) {
			animateFast = false;
			visType = visTypeToCheckFor;
		}
	}}>{visTypeToCheckFor}</button
>
