const sessions = {};

const findOrCreateSession = fbid => {
	let sessionId;
	// Let's see if we already have a session for the user fbid
	Object.keys(sessions).forEach(k => {
		if (sessions[k].fbid === fbid) {
			// Yep, got it!
			sessionId = k;
		}
	});
	if (!sessionId) {
		// No session found for user fbid, let's create a new one
		sessionId = new Date().toISOString();
		sessions[sessionId] = { fbid, context: {} };
	}
	return sessionId;
};

const setSession = (sessionId, key, val) => {
	sessions[sessionId].context[key] = val;
};

module.exports = {
	findOrCreateSession,
	sessions,
	setSession
};
