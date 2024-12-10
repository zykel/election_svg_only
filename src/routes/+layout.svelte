<script>
	let { children } = $props();
</script>

{@render children()}

<style>
	@font-face {
		font-family: 'Inter';
		src: url('/fonts/Inter-VariableFont_opsz,wght.ttf') format('truetype');
		font-weight: 100 900; /* Define the range of weights available */
		font-style: normal;
	}
</style>
