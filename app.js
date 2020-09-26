const express = require('express');
const morgan = require('morgan');
const cors= require('cors');

const app = express();
app.use(morgan('common'));
app.use(cors());

const apps= require('./playstore-data.js')

app.get('/apps', (req, res) => {
    const { search= '', sort, genres }= req.query;

    if(sort){
        if(!['Rating', 'App'].includes(sort)) {
            return res
            .status(400)
            .send('Sort must be one of Rating or App')
        }
    }

    let results = apps
        .filter(app => 
            app
                .App
                .toLowerCase()
                .includes(search.toLowerCase()));
                

    if(sort) {
        results.sort((a, b) => {
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0
        });
    }

    if(genres){
        if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)) {
            return res
            .status(400)
            .send('Genre must be one of Action, Puzzle, Strategy, Casual, Arcade, Card')
        }
    }   

    if(genres) {
        results = results.filter(app => 
            app
                .Genres
                .includes(genres))
        }

    res
    .json(results)
});

module.exports = app;