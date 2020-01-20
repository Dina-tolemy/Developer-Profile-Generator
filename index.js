const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");

var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

inquirer
    .prompt({
        message: "Enter your GitHub username:",
        name: "username"
    })
    .then(function ({ username }) {
        const queryUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
        axios.get(queryUrl)
        .then(function (res) {
            console.log(res);
            const repoNames = res.data.map(function (repo) {
                return repo.name;
            });
            const repoNamesStr = repoNames.join("\n");
            doc.fontSize(25).text(username, 100, 80);
            doc.fontSize(22).text(`${username} has ${repoNames.length} projects`);
            doc.fontSize(20).text(repoNamesStr);
            doc.end();
            stream.on('finish', function () {
                iframe.src = stream.toBlobURL('resume/pdf');
            });

        });
    });