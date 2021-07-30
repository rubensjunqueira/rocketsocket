export const validateAvatarUrl = (url) => {
	try {
		if (!url) return false;
		// eslint-disable-next-line no-new
		new URL(url);
	} catch (e) {
		console.log(e);
		return false;
	}
	return true;
};
