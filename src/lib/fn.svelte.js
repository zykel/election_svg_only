export const delay = (visType, visTypePrev, visTypesArray) => {
	return !visTypesArray.includes(visTypePrev) && visTypesArray.includes(visType);
};

export const delayPercentageRects = (visType, visTypePrev) => {
	return visTypePrev !== 'percentages' && visType === 'percentages';
};
