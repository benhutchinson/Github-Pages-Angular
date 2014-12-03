
 branch: master  Walkthroughs/angularjs.md
Leo Allenpitchinvasion 2 hours ago Update angularjs.md
2 contributors Leo AllenSam Joseph
604 lines (424 sloc)  26.938 kb RawBlameHistory   
AngularJS 1.3 Introduction
Video of session

Please note, as with all Makers Academy materials, there may be subtle errors in the following materials. Please try to approach those as challenges on which to polish your debugging skills - pull requests always welcome.

[Note also that the initial code for this walkthrough is available in https://github.com/makersacademy/angularjs-intro]

What is Angular?

Angular is a front-end MVC framework designed to build web applications rather than just static HTML pages. As the web has matured people have started asking for more from websites - we've seen this with the ubiquitous use of jQuery on almost every webpage you visit. As people have started putting more and more logic into the front-end, the size and complexity of front-end applications has grown. Angular attempts to alleviate some of the problems associated with large front-end applications, and also provides some tools to help you write and test them.

Resources

Introduction to Angular
The official Angular tutorial
Single Page Applications (SPAs)

Angular is a framework that helps you build single page applications, the goal being that you have a web application that fits on a single page so that you can provide an experience more akin to a desktop application (think Gmail). Note that we're not going to be covering SPAs in this walkthrough - one step at a time young Padawan!

Objective

What we want to achive is a simple Github user search.
To do this we're going to be using Github's API. Be careful when using this endpoint, it's heavily rate limited

Also in this walkthrough we're going to build a simple Angular application that demonstrates a few simple concepts:

Two-way data-binding
Dependency injection
In addition we're going to be introducing bower, a package manager for the web.

So let's get started. First you'll need to to have node installed:

brew install node
Then you'll need to install bower, don't forget the -g

npm install -g bower
Let's check everything is okay, run node -v and bower -v and make sure they both return a version number.

Now lets get some boilerplate working. Make a new directory, cd into it then run:

bower init
Choose the defaults (keep hitting return) and you're all good. Now let's install some packages:

bower install jquery --save
bower install bootstrap --save
bower install angular --save
bower install angular-resource --save
The --save will add the package into your bower.json file as dependencies. Then when you clone your repo again you can do a bower install in exactly the same way as you bundle install with Ruby.

Most package managers don't work the same way as Ruby gems. Package managers normally download packages into your local folder. Go ahead and do an ls and see what has been downloaded. Now we don't really want to add bower_components into our repository - most people consider it bad practice but not all.

Because we don't want to commit those dependencies we need to add bower_components to our .gitignore file.

Right then - maybe now would be a good time to commit your work.

Git Diff

Let's sketch out some HTML

We're going to need somewhere to get the user search term and somewhere to display the results. Let's knock together a form with a button, a text box, and an unordered list for our results.

Also note we're pulling in our AngularJS dependencies at the top of the code.

Go ahead and add the following code into index.html:

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Github user search</title>
    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css">
    <script src="bower_components/jquery/dist/jquery.js"></script>
    <script src="bower_components/angular/angular.js"></script>
    <script src="bower_components/angular-resource/angular-resource.js"></script>
  </head>

  <body>
    <div>
      <form class="form-horizontal">
        <input type="text" >
        <button class="btn">Search</button>
      </form>
      <ul class="list-group">
        <li class="list-group-item">
          <img src="https://avatars.githubusercontent.com/u/469160?v=3&s=50">
          <a href="https://github.com/antonydenyer">antonydenyer</a>
        </li>
        <li class="list-group-item">
          <img src="https://avatars.githubusercontent.com/u/30216?v=3&s=50">
          <a href="https://github.com/tansaku">tansaku</a>
        </li>
      </ul>
    </div>
  </body>
</html>
What we're doing here is stubbing out what we want the page to look like with some results. It'll help us get a feel for the visual design.

Go ahead and open index.html. Have a play and get it looking how you want.

Git Diff

Creating the Angular module

Now we need to create our Angular module (not to be confused with Ruby modules!).

Create a new file called js/app.js and put in the following.

var githubUserSearch = angular.module('GitUserSearch', ['ngResource']);
What is all this? We're doing a couple of things: first we're creating our application called 'GitUserSearch' and then we're also pulling in the ngResource module as an external dependency. What scope is the variable githubUserSearch in? Refresh index.html and use your console to find out.

Now lets reference the script from our HTML.

<script src="js/app.js"></script>
Now that we've created an app we need to wire it up to the HTML. Place ng-app="GitUserSearch" inside the html tag so it looks like this:

<html lang="en" ng-app="GitUserSearch">
Notice that Angular uses the string to wire up the app and not the variable; it's 'GitUserSearch' and not githubUserSearch.

Git Diff

Setting up our test environment

Before going any further we need to setup our test environment - since we want to be practising TDD we'll need to write some tests before we write any more angular code. Fortunately as we'll see Angular provides plenty of options for testing your code, but first we need to get our environment set up with some boilerplate.

bower install angular-mocks --save-dev
bower install angular-route --save-dev
(save-dev saves these dependencies in the bower.json file, but as development only dependencies. That's because we won't be needing these libraries in production.)

Angular comes with tools to help you test your applications, but we'll need something to run these tests for us. A common test runner is Karma, which we'll be using for this walkthrough.

To get cracking you need to install some packages, which we'll do via npm. Npm is a bit like bower but for node modules, and has a package.json file which stores our node dependencies (a bit like a Gemfile in Ruby). To generate this file run the following command, pressing return for every argument like you did when setting up bower:

npm init
Don't forget to add node_modules to your .gitignore to prevent all of your node modules being added to git.
Now let's install our node packages:

npm install karma --save-dev
npm install karma-jasmine karma-chrome-launcher karma-phantomjs-launcher --save-dev
npm install -g karma-cli
Then you need to set up your karma config. This can be done with the command karma init, which takes you through a series of questions about your project to create the files. However in this case just create a folder called test and place inside it a file called karma.conf.js with the following code. This will be our Karma config file.

// Karma configuration
// Generated on Thu Nov 27 2014 10:43:21 GMT+0000 (GMT)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'js/**/*.js',
            'test/**/*.spec.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};