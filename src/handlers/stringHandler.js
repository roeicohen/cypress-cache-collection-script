const { curryN } = require("ramda");

/**
 * Takes a string, and extracts a version string (major.minor.patch) from it, if one exists.
 * returns only the first instance of a version within the string.
 * @param {String} str The string to extract the version from.
 * @returns the version string. returns null if there's no version within the string.
 */
const extractVersionFromString = (str) => {
    const versionRegex = /\b[vV]?\d+\.\d+\.\d+\b/g; // Regular expression to match version number possibly preceded by 'v' or 'V'

    const matched = str.match(versionRegex);

    if (matched) {
        const version = matched[0];
        // Remove the preceding 'v' or 'V' if it exists
        const cleanVersion = version.replace(/[vV]/, '');
        return cleanVersion;
    }

    return null; // Return null if version is not found in the string
}

/**
 * Takes two version strings (major.minor.patch) and returns whether the second version
 * is greater than the first version. curried for convinience.
 * @param {String} version1 the version to compare against.
 * @param {String} version2 the version to test.
 * @returns true if the second version is greater than the first version
 */
const isVersionGreaterThan = (version1, version2) => {
    const [major1, minor1, patch1] = version1.split('.').map(Number);
    const [major2, minor2, patch2] = version2.split('.').map(Number);

    if (major2 > major1) {
        return true;
    } else if (major1 === major2 && minor2 > minor1) {
        return true;
    } else if (major1 === major2 && minor1 === minor2 && patch2 > patch1) {
        return true;
    }

    return false;
}

module.exports = {
    extractVersionFromString,
    isVersionGreaterThan: curryN(2, isVersionGreaterThan)
}