if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mongodb://wyang36:Unendlichkeit828@ds121730.mlab.com:21730/vidjot-prod'
    }
}
else {
    module.exports = {
        mongoURI: 'mongodb://localhost/vidjot-dev'
    }
}