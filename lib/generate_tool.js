'use strict';
const mkdirp = require('mkdirp');
const inquirer = require('inquirer');
const fs = require('fs-extra');

const questions = [{
  type: 'input',
  name: 'project_path',
  message: "What's the location of your project?",
  default: () => '/Applications/XAMPP/htdocs/testingProject/'
}];

const generateDirs = function(path) {
  const dirs = ['app', 'es6', 'images', 'licences', 'locales', 'partial', 'script', 'css', 'fonts', 'html', 'scss'];
  dirs.forEach(dir => {
    mkdirp(`${path}${dir}`, function(err) {
      if (err) console.error(err)
      else console.log(`created dir ${dir}`)
    });
  });
};

const askQuestions = function(questions) {
  inquirer.prompt(questions).then(answers => {
    const keys = Object.keys(answers);
    const values = Object.values(answers);

    values.forEach((value, index) => {
      if (value !== '' && fs.existsSync(value)) generateDirs(value);
      else askQuestions(questions);
    });
  });
};



exports.generate = () => askQuestions(questions);
