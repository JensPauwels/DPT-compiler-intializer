
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const mkdirp = require('mkdirp');
const shell = require('shelljs');

const cmd = require('node-cmd');

let fails = [];
let succeeded = {};


const Choice = function (name) {
  this.name = name;
};

const jsMap = {
  Jquery: 'jquery-3.1.1.min.js',
  Materialize: 'materialize.min.js',
  Bootstrap: '',
  I18n: 'i18n.js',
  Knockout: 'knockout-3.4.0.js'
};

const cssMap = {
  Materialize: 'materialize.min.css',
  Fontawesome: 'font-awesome.min.css'
};

const questions = [{
    type: 'input',
    name: 'compiler_path',
    message: `What's the location of your compiler?`,
    default: '/Users/jenspauwels/Documents/htmlcompiler/compiler.jar'
  },
  {
    type: 'input',
    name: 'project_path',
    message: "What's the location of your project?",
    default: `${process.cwd()}/`
  },
  {
    type: 'list',
    name: 'compile_type',
    message: "Do you want to compile for build or dev?",
    choices: ['Dev', 'Build'],
    filter: val => val.toLowerCase()
  }
];


const askAgain = function() {
  askQuestions(questions.filter(question => fails.includes(question.name)));
};

const addToSucceeded = function(key, value) {
  succeeded[key] = value;
};

async function generateDirs(path) {
  const dirs = ['app', 'es6', 'images', 'licences', 'locales', 'partial', 'script', 'css', 'fonts', 'html', 'scss'];
  dirs.forEach(dir => {
    mkdirp(`${path}${dir}`, err => {
      (err) ? console.error(err) : console.log(`created dir ${dir}`);
    });
  });
};

async function writeFile(file, data) {
  fs.writeFile(`${data.project_path}/${file}`, JSON.stringify(data), err => {
    (err) ? console.error(err) : console.log(`generated ${file}`);
  });
};

async function copyFile(file, newFileName) {
  const fileName = (newFileName !== undefined) ? newFileName : file;
  fs.copy(`${__dirname}/${file}`, `${succeeded.project_path}${fileName}`)
    .then(() => console.log(`copied ${fileName}`))
    .catch(err => console.error(err))
};

const includeScripts = function (data) {
  data.forEach(script => {
    const scriptName = jsMap[script];
    if (scriptName !== undefined) copyFile(`../source/js/${scriptName}`, `/script/${scriptName}`);
  });
};

const includeCss = function (data) {
  data.forEach(cssFile => {
    const cssName = cssMap[cssFile];
    if (cssName !== undefined) copyFile(`../source/css/${cssName}`, `/css/${cssName}`);
  });
};

async function generateConfig() {
  await generateDirs(succeeded.project_path);
  await writeFile('compiler_config.json', succeeded);
  await copyFile('gulpfile.js');
  await copyFile('new_package.json', 'package.json');
  await copyFile('.gitignore');
  await copyFile('../source/js/global.js', '/es6/global.js');
  await copyFile('../source/html/index.html', '/html/index.html');
  await copyFile('../source/html/index.html', '/html/index.html');
  await copyFile('../source/scss/screen.scss', '/scss/screen.scss');
  await copyFile('../source/partial/footer.html', '/partial/footer.html');
  await copyFile('../source/partial/header.html', '/partial/header.html');
  includeScripts(['I18n','Materialize', 'Knockout']);
  includeCss(['Materialize', 'Fontawesome']);
  
};

const askQuestions = function(questions) {
  fails = [];
  inquirer.prompt(questions).then(answers => {
    const keys = Object.keys(answers);
    const values = Object.values(answers);

    values.forEach((value, index) => {
      if (keys[index] === 'compile_type' && value !== '') addToSucceeded(keys[index], value);
      else if (keys[index] === 'include_scripts' && value !== '') includeScripts(value);
      else if (keys[index] === 'include_css' && value !== '') includeCss(value);
      else if (value !== '' && fs.existsSync(value)) addToSucceeded(keys[index], value);
      else fails.push(keys[index]);
    });

    (fails.length !== 0) ? askAgain(): generateConfig();
  });
};

const start = function() {
  askQuestions(questions);
};

exports.start = start;
