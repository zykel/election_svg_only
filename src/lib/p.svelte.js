import { scaleOrdinal } from 'd3-scale';

export const parties = [
	'Fianna Fail',
	'Sinn Fein',
	'Fine Gael',
	'Labour',
	'Green',
	'Social dems',
	'Aontu',
	'People before profit',
	'Ind'
];

export const colorScale = scaleOrdinal()
	.domain(parties)
	.range([
		'#00C24A',
		'#009C77',
		'#01B3DD',
		'#F2471C',
		'#A7C54E',
		'#76267F',
		'#E2A739',
		'#E2A739',
		'#AEAEAE'
	]);

export const margin = 100;

export const duration = 2;
export const delay = 1.5;
