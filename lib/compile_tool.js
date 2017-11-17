'use strict';
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');

const questions = [{
    type: 'input',
    name: 'compiler_path',
    message: `What's the location of your compiler?`,
    default: () => '/Users/jenspauwels/Documents/htmlcompiler/DPT-StatApp-Compiler.jar'
  },
  {
    type: 'input',
    name: 'project_path',
    message: "What's the location of your project?",
    default: () => '/Applications/XAMPP/htdocs/testingProject/'
  },
  {
    type: 'list',
    name: 'compile_type',
    message: "Do you want to compile for build or dev?",
    choices: ['Dev', 'Build'],
    filter: function(val) {
      return val.toLowerCase();
    }
  }
];

let fails = [];
let succeeded = {};

const askAgain = function() {
  const newQuestions = questions.filter(question => fails.includes(question.name));
  askQuestions(newQuestions);
};

const addToSucceeded = function(key, value) {
  succeeded[key] = value;
};

const generateConfig = function() {
  fs.writeFile(`${succeeded.project_path}/compiler_config.json`, JSON.stringify(succeeded), err => {
    if (err) console.log(err);
    else console.log('file saved');
  });

  fs.copy(`${__dirname}/gulpfile.js`, `${succeeded.project_path}gulpfile.js`)
    .then(() => console.log('success!'))
    .catch(err => console.error(err))

  fs.copy(`${__dirname}/new_package.json`, `${succeeded.project_path}package.json`)
    .then(() => console.log('success!'))
    .catch(err => console.error(err))

  fs.copy(`${__dirname}/.gitignore`, `${succeeded.project_path}.gitignore`)
    .then(() => console.log('success!'))
    .catch(err => console.error(err))
};

const askQuestions = function(questions) {
  fails = [];
  inquirer.prompt(questions).then(answers => {
    const keys = Object.keys(answers);
    const values = Object.values(answers);

    values.forEach((value, index) => {
      if (keys[index] === 'compile_type' && value !== '') addToSucceeded(keys[index], value);
      else if (value !== '' && fs.existsSync(value)) addToSucceeded(keys[index], value);
      else fails.push(keys[index]);
    });

    (fails.length !== 0) ? askAgain(): generateConfig();
  });
};

const start = function () {
  askQuestions(questions);
};

exports.start = start;
