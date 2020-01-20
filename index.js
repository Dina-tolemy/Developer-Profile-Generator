var fonts = {
    Courier: {
        normal: 'Courier',
        bold: 'Courier-Bold',
        italics: 'Courier-Oblique',
        bolditalics: 'Courier-BoldOblique'
    },
    Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    },
    Times: {
        normal: 'Times-Roman',
        bold: 'Times-Bold',
        italics: 'Times-Italic',
        bolditalics: 'Times-BoldItalic'
    },
    Symbol: {
        normal: 'Symbol'
    },
    ZapfDingbats: {
        normal: 'ZapfDingbats'
    }
};

const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");

var PdfPrinter = require('pdfmake');
var printer = new PdfPrinter(fonts);
inquirer
    .prompt({
        message: "Enter your GitHub username:",
        name: "username"
    })
    .then(function ({ username }) {
        const queryUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
        axios.get(queryUrl)
            .then(function (res) {
               // console.log(res);
                const repoNames = res.data.map(function (repo) {
                    return repo.name;
                });
                const projectUrl = res.data.map(function (repo) {
                    return repo.url;
                });
                const repoUrlStr = projectUrl.join("\n");
                const repoNamesStr = repoNames.join("\n");
                var docDefinition = {
                    content: [
                        `${username}`,
                        '\n',
                        `${username} has ${repoNames.length} project: `,
                        "\n",
                        `${repoNamesStr}`,
                        "\n",
                        "links to the deployed projects on git hub: ",
                        "\n",
                        `${repoUrlStr}`,
                    ],
                    defaultStyle: {
                        font: 'Helvetica'
                    }
                };
                var pdfDoc = printer.createPdfKitDocument(docDefinition);
                pdfDoc.pipe(fs.createWriteStream('document.pdf'));
                pdfDoc.end();

            });
    });