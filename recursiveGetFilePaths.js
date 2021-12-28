const fs = require('fs');

/**
 * Get a list of files in a folder and its subfolders
 * @param {string} folderPath the relative path to the folder
 * @returns {string[]} a list of the relative paths to the files in the folders and its subfolders
 */
function recursiveGetFilePaths(folderPath) {

    const contents = fs.readdirSync(folderPath, { withFileTypes: true });

    const files = contents
        .filter(dirEnt => { return dirEnt.isFile() })
        .map(dirEnt => folderPath + "/" + dirEnt.name)

    contents
        .filter(dirEnt => { return dirEnt.isDirectory() })
        .forEach(subfolder => files.push(...recursiveGetFilePaths(folderPath + "/" + subfolder.name)))

    return files;
}

module.exports = recursiveGetFilePaths