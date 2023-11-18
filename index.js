const { getCypressReleases } = require('./src/handlers/githubHandler');
const { downloadCypressBinaryZip, doesCypressBinaryExist, doCypressBinariesExist, deleteIncompleteDownloads } = require('./src/handlers/cypressBinaryHandler');
const { extractVersionFromString, isVersionGreaterThan } = require('./src/handlers/stringHandler');
const logger = require('./src/utils/logger');
const { MINIMAL_CYPRESS_VERSION } = require('./src/config');
const { reject } = require('ramda');

const run = async () => {
    deleteIncompleteDownloads();

    const cypressReleases = await getCypressReleases();
    const cypressVersions = cypressReleases.map(extractVersionFromString);
    const relevantCypressVersions = cypressVersions.filter(isVersionGreaterThan(MINIMAL_CYPRESS_VERSION));

    if (cypressVersions.length > relevantCypressVersions.length) logger.info('Filtered irrelevant versions', { relevantVersions: relevantCypressVersions.length });

    const relevantCypressVersionsWithSupportedOs = [
        ...relevantCypressVersions.map(v => `${v}-win32-x64`),
        ...relevantCypressVersions.map(v => `${v}-linux`)
    ];

    const cypressVersionsToDownload = doCypressBinariesExist() ? reject(doesCypressBinaryExist, relevantCypressVersionsWithSupportedOs) : relevantCypressVersionsWithSupportedOs;

    const binariesLocated = relevantCypressVersionsWithSupportedOs.length - cypressVersionsToDownload.length;
    if (binariesLocated) logger.info('Found some existing binaries, downloading only nonexistant binaries', { binariesLocated });
    logger.info('Downloading binaries.', { binariesToDownload: cypressVersionsToDownload.length })

    const failures = [];

    for (let i = 0; i < cypressVersionsToDownload.length; i++) {
        const version = cypressVersionsToDownload[i]

        try {
            await downloadCypressBinaryZip(version)
            logger.info('Downloaded Cypress cache files.', { version })
        } catch (error) {
            logger.error('Failed downloading Cypress cache files', { version })
            failures.push(version)
        }
    }

    logger.info('Finished downloading Cypress cache files.');

    if (failures.length) {
        console.log('\n~~~~~~~~~~')
        logger.warn('Failed downloading some versions.', { count: failures.length })
        console.log(failures);
        console.log('~~~~~~~~~~')
    }
}

run();