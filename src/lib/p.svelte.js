import { scaleOrdinal } from 'd3-scale';

export const parties = [
	'Fianna Fáil',
	'Sinn Féin',
	'Fine Gael',
	'Labour',
	'Social Democrats',
	'People Before Profit',
	'Aontú',
	'Green',
	'Ind / Other'
];

export const partyAbbreviations = ['FF', 'SF', 'FG', 'Lab', 'SD', 'PBP', 'Aon', 'Gre', 'Ind'];

const getPartyToAbbrev = () => {
	const partyToAbbrev = {};
	parties.forEach((party, i) => {
		partyToAbbrev[party] = partyAbbreviations[i];
	});
	return partyToAbbrev;
};
export const partyToAbbrev = getPartyToAbbrev();

const getAbbrevToParty = () => {
	const abbrevToParty = {};
	partyAbbreviations.forEach((abbrev, i) => {
		abbrevToParty[abbrev] = parties[i];
	});
	return abbrevToParty;
};
export const abbrevToParty = getAbbrevToParty();

const colors = [
	'#00C24A',
	'#009C77',
	'#01B3DD',
	'#F2471C',
	'#6d2c7b',
	'#d63954',
	'#E2A739',
	'#A7C54E',
	'#AEAEAE'
];

export const colorScale = scaleOrdinal()
	.domain([...parties, ...partyAbbreviations])
	.range([...colors, ...colors]);

export const margin = 60;

export const duration = 2;
export const durationFast = 0.2;
export const delay = 1.5;

export const rem = $state({ value: 16 });
