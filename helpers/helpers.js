const cfonts = require('cfonts');

exports.title = (name) => {
    // Title at the top
    cfonts.say(name, {
        font: 'block',
        align: 'left',
        colors: ['blue', 'white'],
        background: 'black',
        letterSpacing: 1,
        lineHeight: 1,
        space: true,
        maxLength: '0'
    });
};

exports.capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

exports.mapOverXML = (xmlData, table, isXML) => {
    xmlData
        .map(data => {
            var game = data._attributes;
            const homeTeam = `${game.h} ${capitalizeFirstLetter(game.hnn)}`;
            const awayTeam = `${game.v} ${capitalizeFirstLetter(game.vnn)}`;
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
};

exports.mapOverJSON = (jsonData, table) => {
    jsonData
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
};

exports.getDataInfo = (isXML, data) => {
    if (isXML) {
        var info = data.ss.gms._attributes;
        console.log(`Week ${info.w} data of the ${info.y} ${(info.t === 'REG' ? 'regular season' : 'playoffs')} from nfl.com at ${new Date().toLocaleTimeString('en-US')}`);
    } else {
        console.log(`Week ${data.w} data of the ${data.y} ${(data.t === 'REG' ? 'regular season' : 'playoffs')} from nfl.com at ${new Date().toLocaleTimeString('en-US')}`);
    }
};
