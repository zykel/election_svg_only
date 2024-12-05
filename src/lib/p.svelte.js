import { scaleOrdinal } from 'd3-scale';

export const parties = [
	'Fianna Fáil',
	'Sinn Féin',
	'Fine Gael',
	'Green',
	'Labour',
	'Social Democrats',
	'People Before Profit',
	'Aontú',
	'Ind / Other'
];

export const partyAbbreviations = ['FF', 'SF', 'FG', 'Gre', 'Lab', 'SD', 'PBP', 'Aon', 'Ind'];

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

console.log('partyToAbbrev', partyToAbbrev);
console.log('abbrevToParty', abbrevToParty);

const colors = [
	'#00C24A',
	'#009C77',
	'#01B3DD',
	'#A7C54E',
	'#F2471C',
	'#76267F',
	'#E2A739',
	'#E2A739',
	'#AEAEAE'
];

export const colorScale = scaleOrdinal()
	.domain([...parties, ...partyAbbreviations])
	.range([...colors, ...colors]);

export const margin = 100;

export const duration = 2;
export const delay = 1.5;

export const rem = $state({ value: 16 });
