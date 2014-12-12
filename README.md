Introduction To Angular
=======================

In this project, we learnt about the Angular MVC framework.  This was relatively similar in nature to our [AJAX Project with the Github API](https://github.com/benhutchinson/Github-Pages-Tutorial), where I chose to focus more effort.  Where it differed and offered an exciting functionality lay in a more dynamic auto-searching effort.  i.e. the search field tries to anticipate your query dynamically as you type, similar to Google.com.  We tested with Karma & Protractor in this project and learnt how to configure mock tests with the Github API via the Angular Mocks module.

###Code Extract
```
<form class="form-horizontal">
  <input type="text" ng-model="searchTerm" ng-change="doSearch()" ng-model-options="{ updateOn: 'default blur', debounce: {'default': 500, 'blur': 0} }">
  <button class="btn" ng-click="doSearch()">Search</button>
</form>
```

###Core Technologies
- Angular
- Karma-Testing
- jQuery & Javascript
- SVG
- Basic HTML/CSS