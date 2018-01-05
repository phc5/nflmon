const inquirer = require('inquirer');
const puppeteer = require('puppeteer');

const helpers = require('./helpers');

var username = null;
var password = null;
var numberOfTransactions = 0;
var questions = [
    {
        type: 'input',
        name: 'username',
        message: 'Enter your username...'
    },
    {
        type: 'password',
        name: 'password',
        mask: '*',
        message: 'Enter your password...',
    },
    {
        type: 'input',
        name: 'transactions',
        message: 'How many transactions are you going to make?',
        validate: function (transactions) {
            var reg = /^\d+$/;
            return reg.test(transactions) || 'Please enter a number...';
        },
        filter: Number
    },
];

const prompt = () => {
    inquirer.prompt(questions).then(function (answers) {
        username = answers.username;
        password = answers.password;
        numberOfTransactions = answers.transactions
        var transactionsArray = [];
        for (var i = 0; i < answers.transactions; i++) {
                transactionsArray.push(
                    {
                    type: 'input',
                    name: 'add' + i,
                    message: 'Enter the full name of the player to ADD',
                    },
                    {
                        type: 'input',
                        name: 'drop' + i,
                        message: 'Enter the full name of the player to DROP'
                    }
                );
        }
        return { transactions: transactionsArray, answers: answers };
    })
    .then(function (dataObj) {
        inquirer.prompt(dataObj.transactions).then(function (answers) {
            var listOfPlayers = [];
            for (var i = 0; i < dataObj.answers.transactions; i++) {
                var add = helpers.toTitleCase(answers['add' + i]);
                var drop = helpers.toTitleCase(answers['drop' + i]);
                listOfPlayers.push([add, drop]);
            }
            login(dataObj.answers.username, dataObj.answers.password, listOfPlayers, dataObj.answers.transactions);
        })
    });
}


async function login(username, password, listOfPlayers, numberOfTransactions) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://football.fantasysports.yahoo.com/f1/149810/players');
  await page.type('#login-username', username);
  await page.click('#login-signin');
  await page.waitForNavigation();
  await page.type('#login-passwd', password);
  await page.click('#login-signin');
  await page.waitForNavigation();

  await page.goto(`https://football.fantasysports.yahoo.com/f1/149810/playersearch?&search=${listOfPlayers[0][0]}`);
  await page.screenshot({path: 'example.png', fullPage: true});

  //complete waiver process...
  await browser.close();
};

module.exports = {
    prompt
}
