<script>
	let { visTypeToCheckFor, visType = $bindable(), animateFast = $bindable() } = $props();
</script>

<button
	onclick={() => {
		if (visType !== visTypeToCheckFor) {
			animateFast = false;
			visType = visTypeToCheckFor;
		}
	}}>{visTypeToCheckFor}</button
>
