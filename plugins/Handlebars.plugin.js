const HandlebarsPlugin = require("handlebars-webpack-plugin");
const mergeJSON = require('handlebars-webpack-plugin/utils/mergeJSON');
const path = require('path');

const dataDirectory = path.join(process.cwd(), "data/*.json");
const projectData = mergeJSON(dataDirectory);

console.log({projectData, dataDirectory})

module.exports = new HandlebarsPlugin({
    entry: path.join(process.cwd(), "src", "views", "*.hbs"),
    output: path.join(process.cwd(), "dist", "[name].html"),
    data: projectData,
    partials: [
        path.join(process.cwd(), "src", "views", "*", "*.hbs")
    ],

    helpers: {
        // nameOfHbsHelper: Function.prototype,
        projectHelpers: path.join(process.cwd(), "src", "views", "helpers", "*.helper.js")
    },

    onBeforeSetup: function (Handlebars) {
    },
})
