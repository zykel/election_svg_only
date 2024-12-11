<script>
	let { visType } = $props();

	const getText = () => {
		let text = '';

		if (visType === 'map') {
			text =
				'In the map view, the constituencies were divided based on the seats they correspond to.';
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
		margin: 15px 15px 0 15px;
	}
	@media (max-width: 400px) {
		.vis-description {
			font-size: 14px;
		}
	}
</style>
