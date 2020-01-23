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
    .prompt([{
        message: "Enter your GitHub username:",
        name: "username"
    },
    {
        message: "chhose your color: ",
        name: "usercolor"
    }])
    .then(function ({username,usercolor}) {
        const queryUrl = `https://api.github.com/users/${username}`;
        const querryurl2=`https://api.github.com/users/${username}/repos?per_page=100`;

        axios.all([
            axios.get(queryUrl),
            axios.get(querryurl2)
          ])
            .then(axios.spread((res, repoRes)=> {

                let repoStarscount = repoRes.data.map(function(repo) {
                     return repo.stargazers_count;
                    }); 
                var starresult=repoStarscount.reduce(add,0);
                function add(a, b) {
                    return a + b;
                };               
                const userName = res.data.name;
                const userEmail=res.data.email;
                const userGitHub = res.data.html_url;
                const userImg = res.data.avatar_url;
                const Followers = res.data.followers;
                const userFollowing = res.data.following;
                const userLocation = res.data.location;
                const userBio = res.data.bio;
                const userBlog = res.data.blog;
                const userPublicRepo = res.data.public_repos;
                const userreposLink = res.data.repos_url;
                const backgroundColor = usercolor;

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
                            text: 'Email: ', style: 'subHeader'
                        },
                        '\n',
                        ` ${userEmail}`,
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
                                'GitHub Stars', style: 'subHeader'
                        },
                        '\n',
                        `${userName} has ${starresult} Stars on GitHub`,
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
                        font: 'Helvetica',
                        fontSize: 16,
                        color: 'grey',      
                    },
                    styles: {
                        header: {
                            decoration: 'underline',
                            fontSize: 26,
                            bold: true,
                            alignment: 'center',
                            background: backgroundColor,
                            color: 'darkred'
                        },
                        subHeader: {
                            decoration: 'underline',
                            fontSize: 20,
                            bold: true,
                            background: backgroundColor,
                            color:'darkred'
                        }
                    }
                };
                var pdfDoc = printer.createPdfKitDocument(docDefinition);
                pdfDoc.pipe(fs.createWriteStream('document.pdf'));
                pdfDoc.end();

            }));
    });