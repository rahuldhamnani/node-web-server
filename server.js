const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

// set is a method to set various configuration properties for Express.
app.set('view engine', 'hbs');
//Above we are setting the view engine to hbs

// Using app use we were able to create some middleware that helps us keep track of how our server is working (Server Log)
app.use((req, res, next)=>{
  var now = new Date().toString();
  var log = `${now} ${req.method} ${req.url}` // injecting timestamp HTTP method and URL for calls to application
  console.log(log);
  fs.appendFile('server.log', log+'\n', (err)=>{
    if(err){
      console.log('Unable to write to server.log file');
    }
    });
  next(); //if we do not call next then the function is never going to finish and the page will keep loading. ;
});

// Second Middleware logic
// This middleware is going to stop everything after it from executing. Since, We don't call next.
// So the actual handlers below are never going to get executed.
 // app.use((req,res, next)=>{
//   res.render('maintenance.hbs')
// });

app.use(express.static(__dirname + '/public')); // Middleware to use static public directory

// REMEMBER THAT THE MIDDLEWARE LOGIC IS EXECUTING IN SEQUNCE OF CODE WRITTEN
// IF WE HAD WRITTEN ABOVE LINE BEFORE MIDDLEWARE RENDER LOGIC THEN IT WOULD HAVE ALLOWED US TO ACCESS PUBLIC DIRECTORY FILES WITHOUT MAINTENANCE BLOCK.

//we are using partials to replace repeative code in the markups eg: footer information or header info.
//The above line registers the partials location.
hbs.registerPartials(__dirname + '/views/partials');

// Helpers are going to be ways for you to register functions to run to dynamically create some output.
hbs.registerHelper('getCurrentYear', ()=>{
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text)=>{
  return text.toUpperCase();
});

app.get('/', (req, res)=>{ //Adding a handler for root page
  // res.send('Hello World!')
  res.render('root.hbs', {
    pageTitle: 'Home Page',
    message: 'Hello User! Welcome to my first application!'
  });
});

app.get('/about', (req, res)=> { //Adding a handler for About page
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

app.get('/bad', (req, res)=> { //Adding a handler for About bad
  res.send({
    errorMessage: 'Unable to handle request',
    statusCode: 404
  });
});

app.listen(3000, ()=>{ // Can take second optional argument to let developer know that the server started
  console.log('Server is up and running at port 3000');
});
