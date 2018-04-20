const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

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

//index route
app.get('/', (req, res) => {
    const title = 'Welcome1';
    res.render('index',{
        title: title
    });
});
app.get('/about', (req, res) => {
    res.render('about');
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})