require('dotenv').config();

module.exports = {
    MINIMAL_CYPRESS_VERSION: process.env.MINIMAL_CYPRESS_VERSION || '0.0.0',
    GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
}