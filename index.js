#!/usr/bin/env node
const program = require('commander');
const axios = require('axios');
const ora = require('ora');
const cfonts = require('cfonts');
const Table = require('cli-table2');
const colors = require('colors');
const convert = require('xml-js');
const helper = require('./helpers/helpers.js');

const list = val => val.split(',');

program
    .version('0.0.1')
    .option('-d, --date [week, year, type]', 'Get data at specified week, year of season, and type of season...ex: 3,2017,REG', list, [])
    .parse(process.argv);

const season = program.date;
const isXML = (season.length === 3 ? true : false);

// Set up table
const table = new Table({
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

// Title at the top
cfonts.say('nflmon', {
    font: 'block',
    align: 'left',
    colors: ['blue', 'white'],
    background: 'black',
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: '0'
});

// Start spinner before calling data.
const spinner = ora('Loading NFL games').start();
const scoreJSON = (isXML ? `http://www.nfl.com/ajax/scorestrip?season=${season[1]}&seasonType=${season[2]}&week=${season[0]}` : 'https://www.nfl.com/liveupdate/scorestrip/ss.json');

// Fetch data
axios.get(scoreJSON)
    .then(function (response) {
        spinner.stop();
        const data = (isXML ? JSON.parse(convert.xml2json(response.data, {compact: true, spaces: 4})) : response.data);
        (isXML) ? helper.mapOverXML(data.ss.gms.g, table) : helper.mapOverJSON(data.gms, table);

        if (table.length === 0) {
            console.log('No data was received...Is the season over? :(');
        } else {
            helper.getDataInfo(isXML, data);
            console.log(table.toString());
        }
    })
    .catch(function (error) {
        spinner.stop();
        console.log('Oops... something went wrong: ' + error);
    });
