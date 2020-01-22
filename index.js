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
const PdfPrinter = require('pdfmake');
const printer = new PdfPrinter(fonts);
inquirer
    .prompt({
        message: "Enter your GitHub username:",
        name: "username"
    })
    .then(function ({ username }) {
        const queryUrl = `https://api.github.com/users/${username}`;
        axios.get(queryUrl)
            .then(function (res) {
                //  console.log(res);


                const userName = res.data.name;
                const userGitHub = res.data.html_url;
                const userImg = res.data.avatar_url;
                const Followers = res.data.followers;
                const userFollowing = res.data.following;
                const userLocation = res.data.location;
                const userBio = res.data.bio;
                const userBlog = res.data.blog;
                const userPublicRepo = res.data.public_repos;
                const userreposLink = res.data.repos_url;
                const backgroundColor = res.data.gravatar_id;

                var docDefinition = {
                    content: [
                        {
                            text:`${userName}`, style: 'header'
                        },
                        '\n',
                        '\n',
                        {
                            text:
                                'lives in ', style: 'subHeader'
                        },
                        '\n',
                        `${userLocation}`,
                        '\n',
                        '\n',
                        {
                            text:
                                'Bio', style: 'subHeader'
                        },
                        '\n',
                        `${userBio}`,
                        '\n',
                        '\n',
                        {
                            text: 'GitHub Link: ', style: 'subHeader'
                        },
                        '\n',
                        ` ${userGitHub}`,
                        '\n',
                        '\n',
                        {
                            text: 'Blog: ', style: 'subHeader'
                        },
                        '\n',
                        `${userBlog}`,
                        '\n',
                        '\n',
                        {
                            text:
                                'Followers', style: 'subHeader'
                        },
                        '\n',
                        `Number of followers on gitHub: ${Followers}`,
                        '\n',
                        '\n',
                        {
                            text:
                                'Following', style: 'subHeader'
                        },
                        '\n',
                        `${userFollowing} people`,
                        '\n',
                        '\n',
                        {
                            text:
                                'Public Repo', style: 'subHeader'
                        },
                        '\n',
                        `${userName} has ${userPublicRepo} public repositories on GitHub`,
                        '\n',
                        '\n',
                        {
                            text:
                                'Link to the repos in GitHub: ', style: 'subHeader'
                        },
                        '\n',
                        `${userreposLink}`
                    ],
                    defaultStyle: {
                        font: 'Helvetica'
                    },
                    styles: {
                        header: {
                            fontSize: 24,
                            bold: true,
                            alignment: 'center'
                        },
                        subHeader: {
                            fontSize: 18,
                            bold: true
                        }
                    }
                };
                var pdfDoc = printer.createPdfKitDocument(docDefinition);
                pdfDoc.pipe(fs.createWriteStream('document.pdf'));
                pdfDoc.end();

            });
    });