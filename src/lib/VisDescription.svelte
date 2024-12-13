<script>
	let { visType, mapWidth, mapHeight } = $props();

	const getText = () => {
		let text = '';

		// let vh100 = typeof window === 'undefined' ? '0' : window.innerHeight;
		// let vw100 = typeof window === 'undefined' ? '0' : window.innerWidth;

		if (visType === 'map') {
			text =
				mapWidth +
				'.' +
				mapHeight +
				'.v8In the map view, the constituencies were divided based on the seats they correspond to.';
		}
		if (visType === 'parliament') {
			text =
				'In this view, each circle corresponds to one of the 174 seats in the Irish parliament.';
		}
		if (visType === 'barchart') {
			text =
				'In this view, the seats for each party are grouped to compare how many seats each party received.';
		}
		if (visType === 'percentages') {
			text =
				'The bars represent how many percent each party received in 2024 (saturated) and in 2020 (light).';
		}

		return text;
	};

	const text = $derived(getText());
</script>

<div>
	<p class="vis-description">
		{text}
	</p>
</div>

<style>
	div {
		width: 100%;
	}
	.vis-description {
		margin: 15px 15px 10px 15px;
	}
	@media (max-width: 400px) {
		.vis-description {
			font-size: 14px;
		}
	}
	@media (max-height: 600px) {
		.vis-description {
			font-size: 12px;
		}
	}
</style>
