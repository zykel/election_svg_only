export const delay = (visType, visTypePrev, visTypesArray) => {
	return !visTypesArray.includes(visTypePrev) && visTypesArray.includes(visType);
};

export const delayPercentageRects = (visType, visTypePrev) => {
	return visTypePrev !== 'percentages' && visType === 'percentages';
};

export const normalizeName = (name) => {
	let nameTransformed = name
		.toLowerCase()
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

	nameTransformed = nameTransformed
		.split("'")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join("'");

	nameTransformed = nameTransformed
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('-');

	nameTransformed = nameTransformed
		.split('Mc')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('Mc');

	nameTransformed = nameTransformed
		.split('Mac')
		.map((word, i) => (i > 0 ? ' ' : '') + word.charAt(0).toUpperCase() + word.slice(1))
		.join('Mac');

	return nameTransformed;
};
