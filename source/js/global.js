const Observable = function (instance, key) {
  instance[key] = (key in instance.defaultData) ? ko.observable(instance[key]) : ko.observable(undefined);
};

const ObservableArray = function (instance, key) {
  instance[key] = (key in instance.defaultData) ? ko.observableArray(instance[key]) : ko.observableArray([]);
};

function GlobalViewModel() {
  if (typeof pageViewModel === 'function') pageViewModel(this);
};

document.addEventListener("DOMContentLoaded", () => {
  viewModel = new GlobalViewModel();

  ko.bindingHandlers.insertText = {
    init: (element, valueAccessor) => element.appendChild(document.createTextNode(` ${valueAccessor()}`)),
    update: (element, valueAccessor) => element.childNodes.forEach(selectedNode => selectedNode = ` ${valueAccessor()}`)
  };

  ko.applyBindings(viewModel, document.getElementById("htmldoc"));

  if (typeof initPage === 'function') initPage();
});