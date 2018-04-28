const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;
//Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev')
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => console.log(err))

//load Idea model
require('./models/Idea');
const Idea = mongoose.model('ideas')

//how middleware works
app.use((req, res, next) => {
    //do something...
    next();
});

//handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//index route
app.get('/', (req, res) => {
    const title = 'Welcome1';
    res.render('index', {
        title: title
    });
});

//about route
app.get('/about', (req, res) => {
    res.render('about');
});

//process form
app.post('/ideas', (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({ text: 'Please add a title' })
    }
    if (!req.body.details) {
        errors.push({ text: 'Please add some details' })
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        })
    }
    else {
        const newIdea = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newIdea).save()
            .then(idea => {
                res.redirect('/ideas');
            })
    }
});

//idea index page
app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        })

});

//add idea form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

//edit idea form
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            res.render('ideas/edit', {
                idea: idea
            });
        })

});

const port = 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})