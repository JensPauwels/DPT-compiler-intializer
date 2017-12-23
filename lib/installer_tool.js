'use strict';
const mkdirp = require('mkdirp');
const inquirer = require('inquirer');
const fs = require('fs-extra');

const questions = [{
  type: 'input',
  name: 'project_path',
  message: "Where do you want to install the compiler?",
}];

const installTheCompiler = function (path) {
  fs.copy(`${__dirname}/../dist/compiler.jar`, `${path}compiler.jar`)
    .then(() => console.log(`installed the compiler`))
    .catch(err => console.error(err))
};

const askQuestions = function(questions) {
  inquirer.prompt(questions).then(answers => {
    const keys = Object.keys(answers);
    const values = Object.values(answers);

    values.forEach((value, index) => {
      if (value !== '' && fs.existsSync(value)) installTheCompiler(value);
      else askQuestions(questions);
    });
  });
};



const start = function() {
  askQuestions(questions);
};

exports.start = start;
