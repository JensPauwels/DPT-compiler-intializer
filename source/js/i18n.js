var topener = topener || {};

/* Load a language from localstorage or return 'en' on failure */
function loadStoredLanguage() {
  if (typeof(Storage) !== "undefined") {
    var lang = localStorage.getItem("_site_lang");
    if (lang == "undefined" || lang == null) {
      return "en";
    } else {
      return lang;
    }
  } else {
    return "en";
  }
};

/* Try to store the language in HTML5 localstorage */
function storeLanguage(lang) {
  if (typeof(Storage) !== "undefined") {
    localStorage.setItem("_site_lang", lang.toLowerCase());
    return true;
  } else {
    return false;
  }
}

topener.i18n = function() {
  var self = this;

  this.language = ko.observable(loadStoredLanguage());

  // Save language for the next time
  this.language.subscribe(function(value) {
    self.language(value.toLowerCase());
    storeLanguage(value.toLowerCase());
  });

  this.langVars = ko.computed(function() {
    var r = {};
    if (topener.lang[self.language()]) {
      r = topener.lang[self.language()];
    } else {
      r = topener.lang.en;
    }
    return r;
  })

  this.vars = {};

  this.get = function(name, vars) {

    var vars = vars || false;

    if (!vars) {
      return simpleComputed(name);
    } else {
      return varsComputed(name, vars);
    }
  }

  var varsComputed = function(name, vars) {

    self.vars[name] = ko.computed(function() {

      if (!name) {
        return '';
      }

      if (!self.langVars()[name]) {
        var message = 'var "' + name + '" not found';
        console && console.warn && console.warn(message);
        return message;
      }

      var string = self.langVars()[name];


      for (key in vars) {
        string = string.replace('%' + key + '%', vars[key]);
      }

      return string;

    });

    return self.vars[name];

  }

  var simpleComputed = function(name) {

    if (self.vars[name]) {
      return self.vars[name];
    }

    self.vars[name] = ko.computed(function() {

      if (!name) {
        return '';
      }

      if (!self.langVars()[name]) {
        var message = 'var "' + name + '" not found';
        console && console.warn && console.warn(message);
        return message;
      }

      return self.langVars()[name];

    });

    return self.vars[name];
  }
}
