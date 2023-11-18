const logger = require('../utils/logger');
const { Octokit } = require('octokit');

const getCypressReleases = async () => {
    try {
        const octokit = new Octokit({});
        const cypressReleases = [];

        const iterator = octokit.paginate.iterator(octokit.rest.repos.listReleases, {
            owner: 'cypress-io',
            repo: 'cypress',
        })

        for await (const { data: releases } of iterator) {
            for (const release of releases) {
                cypressReleases.push(release.name)
            }
        }

        logger.info('Queried Cypress releases.', { releaseCount: cypressReleases.length })
        return cypressReleases;
    } catch (error) {
        logger.error('Failed to query Cypress releases.');
        console.error(error)
        process.exit(1);
    }
}



module.exports = {
    getCypressReleases
}