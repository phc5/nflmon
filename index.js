#!/usr/bin/env node
const program = require('commander');
const axios = require('axios');
const ora = require('ora');
const Table = require('cli-table2');
const colors = require('colors');
const convert = require('xml-js');

const helper = require('./helpers/helpers.js');
const boris = require('./helpers/boris.js');
const freeagent = require('./helpers/freeagent.js');

const list = val => val.split(',');

program
    .version('0.0.1')
    .option('-n, --nflmon', 'get scores for current week')
    .option('-b, --boris [position, scoring]', 'get data from borischen.co(ex: rb, half)', list, [])
    .option('-d, --date [week, year, type]', 'get data at week, year, and type of season(ex: 3,2017,REG)', list, [])
    .option('-f, --freeAgent', 'add freeagent')
    .parse(process.argv);

const isNflmon = program.nflmon;
const borisArgs = program.boris;
const isBoris = (borisArgs.length >= 1 ? true : false)

const season = program.date;
const isXML = (season.length === 3);

const isFreeAgent = program.freeAgent;

// Start spinner before calling data.
const spinner = ora('Loading NFL games').start();

// Fetch data
if (isNflmon || isXML) {
    const scoreTable = new Table({
        chars: {
            'top': '═',
            'top-mid': '╤',
            'top-left': '╔',
            'top-right': '╗',
            'bottom': '═',
            'bottom-mid': '╧',
            'bottom-left': '╚',
            'bottom-right': '╝',
            'left': '║',
            'left-mid': '╟',
            'right': '║',
            'right-mid': '╢'
        },
        head: ['TIME', 'HOME', '', 'AWAY', '']
    });

    helper.title('nflmon');

    const scoreJSON = (isXML ? `http://www.nfl.com/ajax/scorestrip?season=${season[1]}&seasonType=${season[2]}&week=${season[0]}` : 'https://www.nfl.com/liveupdate/scorestrip/ss.json');

    axios.get(scoreJSON)
    .then(function (response) {
        spinner.stop();
        if (response && response.data) {
            const data = (isXML ? JSON.parse(convert.xml2json(response.data, {compact: true, spaces: 4})) : response.data);
            (isXML) ? helper.mapOverXML(data.ss.gms.g, scoreTable) : helper.mapOverJSON(data.gms, scoreTable);

            if (scoreTable.length === 0) {
                console.log('No data was received...Is the season over? :(');
            } else {
                helper.getDataInfo(isXML, data);
                console.log(scoreTable.toString());
            }
        } else {
            console.log('No live updates on scores...Is the season over?');
        }
    })
    .catch(function (error) {
        spinner.stop();
        console.log('there');
        console.log('Oops... something went wrong: ' + error);
    });

} else if (isBoris) {
    spinner.stop();
    helper.title('borischen.co');
    boris.validateInput(borisArgs[0], borisArgs[1]);
} else if (isFreeAgent) {
    spinner.stop();
    helper.title('Free Agent Adder');
    freeagent.prompt();
} else {
    spinner.stop();
    console.log('Use a flag with the command nflmon: -b, -d, or -n');
    console.log('Type nflmon -h for help');
}
