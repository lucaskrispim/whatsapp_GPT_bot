const rateLimitInfo = {};
const blacklist = {};

function isUserBlocked(userPhoneNumber) {
    const userRateLimit = rateLimitInfo[userPhoneNumber];

    if (!userRateLimit) {
        return false;
    }

    const currentTime = Date.now();
    return userRateLimit.blockedUntil > currentTime;
}

function addUserToBlacklist(userPhoneNumber) {
    blacklist[userPhoneNumber] = true;
}

function isUserInBlacklist(userPhoneNumber) {
    return !!blacklist[userPhoneNumber];
}

function getUserRateLimit(userPhoneNumber) {
    if (!rateLimitInfo[userPhoneNumber]) {
        rateLimitInfo[userPhoneNumber] = {
            messages: [],
            blockedUntil: 0,
            violations: 0,
            violationNotified: false,
            lengthViolations: 0,
            unsupportedViolations: 0
        };
    }

    return rateLimitInfo[userPhoneNumber];
}

function updateUserRateLimit(userPhoneNumber, userRateLimit) {
    rateLimitInfo[userPhoneNumber] = userRateLimit;
}

module.exports = {
    rateLimitInfo,
    blacklist,
    isUserBlocked,
    addUserToBlacklist,
    isUserInBlacklist,
    getUserRateLimit,
    updateUserRateLimit
};