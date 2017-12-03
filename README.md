# NFLMON

Welcome to nflmon!
This is a CLI tool that gives you the latest scores in the NFL.

## Usage

### Current Week Scores
Follow these steps to use this tool on your local computer.
```
$ git clone https://github.com/phc5/nflmon.git
$ cd nflmon
$ npm install -g
$ npm link
$ nflmon
```
### Any Week Scores
To get the scores of any week at any point in time in the NFL (with whatever data we have):
```
$ nflmon -d [week,year,type]
```
where the fields in [] are typed without spaces. For example, `nflmon -d 3,2017,REG`.

#### week and type
The type field has three possible choices: `PRE`, `REG`, and `POST`.

- `PRE` consists of weeks `0-4`.
- `REG` consists of weeks `5-17`.
- `POST` consists of weeks `18-22`.

## Data
All data comes from www.nfl.com/liveupdates/scorestrip/ss.json and http://www.nfl.com/ajax/scorestrip.
I had to use two different endpoints because it was difficult to find any API's that would let me get data on boxscores.
Please let me know if there are any better alternatives.

## To-do

- [X] Check scores of any week in the current season (12/2/2017)
- [X] Check scores of any week in NFL history (12/2/2017)
- [ ] Convert time to correct time zone
- [ ] Allow spaces in between fields after `-d` flag
