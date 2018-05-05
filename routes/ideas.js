const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

//load Idea model
require('../models/Idea');
const Idea = mongoose.model('ideas')

//process form
router.post('/', (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({ text: 'Please add a title' })
    }
    if (!req.body.details) {
        errors.push({ text: 'Please add some details' })
    }

    if (errors.length > 0) {
        res.render('../views/ideas/add', {
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
                req.flash('success_msg', 'Video idea added.')
                res.redirect('/ideas');
            })
    }
});

//idea index page
router.get('/', (req, res) => {
    Idea.find({})
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('../views/ideas/index', {
                ideas: ideas
            });
        })

});

//add idea form
router.get('/add', (req, res) => {
    res.render('../views/ideas/add');
});

//edit idea form
router.get('/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            res.render('../views/ideas/edit', {
                idea: idea
            });
        })

});

//Edit form process
router.put('/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    req.flash('success_msg', 'Video idea updated.')
                    res.redirect('/ideas');
                })
        })

})

//Delete idea
router.delete('/:id', (req, res) => {
    Idea.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Video idea removed.');
            res.redirect('/ideas');
        })
})

module.exports = router;