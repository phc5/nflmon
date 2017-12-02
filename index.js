#!/usr/bin/env node
const program = require('commander');
const axios = require('axios');
const ora = require('ora');
const cfonts = require('cfonts');
const Table = require('cli-table2');
const colors = require('colors');
const os = require('os');

const platform = os.platform();
const supportsEmoji = platform !== 'darwin';

const list = val => val.split(',');

program
    .version('0.0.1')
    .parse(process.argv);

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

console.log(table.toString());
