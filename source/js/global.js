function GlobalViewModel() {
  pageViewModel(this);
};

$(() => {
  viewModel = new GlobalViewModel();

  ko.bindingHandlers.insertText = {
    init: (element, valueAccessor) => {
      element.appendChild(document.createTextNode(` ${valueAccessor()}`));
    },
    update: (element, valueAccessor) => {
      element.childNodes.forEach(selectedNode => {
        selectedNode = ` ${valueAccessor()}`;
      });
    }
  };

  ko.applyBindings(viewModel, document.getElementById("htmldoc"));
  if (typeof initPage === 'function') initPage();
});
