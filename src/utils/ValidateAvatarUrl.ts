export const validateAvatarUrl = (url: string) => {
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
