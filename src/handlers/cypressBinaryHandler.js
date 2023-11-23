const Downloader = require("nodejs-file-downloader");
const fs = require('fs');
const logger = require("../utils/logger");

const CYPRESS_BINARY_DOWNLOAD_URL = "https://download.cypress.io/desktop"

/**
 * Download a zip file of the Cypress binary.
 * @param {String} fileIdentifier The binary string. (version-platform-arch format)
 */
const downloadCypressBinaryZip = async (fileIdentifier) => {
    const [version, platform, arch] = fileIdentifier.split('-')
    const queryParams = new URLSearchParams()
    queryParams.append('platform', platform)
    arch && queryParams.append('arch', arch)

    const downloader = new Downloader({
        url: `${CYPRESS_BINARY_DOWNLOAD_URL}/${version}?${queryParams}`,
        directory: `${process.cwd()}/downloads/${fileIdentifier}`,
        fileName: 'Cypress.zip'
    })

    try {
        await downloader.download()
    } catch (error) {
        console.error(error)
    }
}

/**
 * Checks if the downloads folder exists.
 * @returns Whether or not the folder exists.
 */
const doCypressBinariesExist = () => fs.existsSync(`${process.cwd()}/downloads`)

/**
 * Predicate to check if the specified Cypress binary exists.
 * @param {String} version The binary string. (version-platform-arch format)
 * @returns whether or not the binary exists.
 */
const doesCypressBinaryExist = (binary) => {
    try {
        fs.accessSync(`${process.cwd()}/downloads/${binary}/Cypress.zip`);
        return true;
    } catch {
        return false;
    }
}

/**
 * Delete all files with a .download extension in the downloads folder.
 */
const deleteIncompleteDownloads = () => {
    const directoryPath = `${process.cwd()}/downloads`;

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            logger.error('Failed reading directories in downloads directory.');
            console.error(err);
            return;
        }

        files.forEach((file) => {
            const filePath = `${directoryPath}/${file}`;

            // Check if it's a directory
            if (fs.statSync(filePath).isDirectory()) {
                // Read files within the subdirectory
                fs.readdir(filePath, (err, subFiles) => {
                    if (err) {
                        logger.error('Failed reading .download file.');
                        console.error(err)
                        return;
                    }

                    subFiles.forEach((subFile) => {
                        // Check if the file ends with '.download' and delete it
                        if (subFile.endsWith('.download')) {
                            const subFilePath = `${filePath}/${subFile}`;
                            fs.unlinkSync(subFilePath);
                            fs.rmSync(filePath, { recursive: true, force: true })
                        }
                    });
                });
            }
        });
    });
}

module.exports = {
    downloadCypressBinaryZip,
    doCypressBinariesExist,
    doesCypressBinaryExist,
    deleteIncompleteDownloads
}