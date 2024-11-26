import { range } from 'd3-array';

export const getParliamentHelper = (mapWidth, mapHeight) => {
	const pathData = range(175).map((d, idx) => {
		const amp = 200;
		const cx = mapWidth / 2 + amp * Math.cos((d / 175) * 2 * Math.PI);
		const cy = mapHeight / 2 + amp * Math.sin((d / 175) * 2 * Math.PI);
		const r = 10;
		// create an svg path to depict a circle at cx, cy with radius r
		const pathString = `M ${cx} ${cy} A ${r} ${r} 0 1 1 ${cx + 0.1} ${cy}`;

		// pathString = `M ${x} ${y} A ${r} ${r} 0 1 1 ${x + 0.1} ${y}`;
		return { idx, area_seat: 'dummy-circle', pathString };
	});

	return {
		get pathData() {
			return pathData;
		}
	};
};
