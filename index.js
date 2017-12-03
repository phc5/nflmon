#!/usr/bin/env node
const program = require('commander');
const axios = require('axios');
const ora = require('ora');
const cfonts = require('cfonts');
const Table = require('cli-table2');
const colors = require('colors');

program
    .version('0.0.1')
    .parse(process.argv);

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
const scoreJSON = 'https://www.nfl.com/liveupdate/scorestrip/ss.json';

// Fetch data
axios.get(scoreJSON)
    .then(function (response) {
        spinner.stop();
        const data = response.data;
        data.gms
            .map(game => {
                const homeTeam = `${game.h} ${game.hnn}`;
                const awayTeam = `${game.v} ${game.vnn}`;
                const homeScore = game.hs;
                const awayScore = game.vs;
                const time = `${game.d} ${game.t} EST`;
                return [
                    time,
                    homeTeam,
                    homeScore,
                    awayTeam,
                    awayScore
                ];
            })
            .forEach(game => table.push(game));

        if (table.length === 0) {
            console.log('No data was received...Is the season over? :(');
        } else {
            console.log(`Week ${data.w} data of the ${data.y} ${(data.t === 'REG' ? 'regular season' : 'playoffs')} from nfl.com at ${new Date().toLocaleTimeString('en-US')}`);
            console.log(table.toString());
        }
    })
    .catch(function (error) {
        spinner.stop();
        console.log('Oops... something went wrong: ' + error);
    });
