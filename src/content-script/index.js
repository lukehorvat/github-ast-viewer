import "babelify/polyfill";
import esprima from "esprima";
import estraverse from "estraverse";
import ghInjection from "github-injection";
import ghPageType from "github-page-type";
import $ from "jquery";

ghInjection(window, (err) => {
  if (err) {
    return;
  }

  // Is the current GitHub page a file in a repository?
  if (!ghPageType(window.location.href, ghPageType.REPOSITORY_BLOB)) {
    return;
  }

  // Is the file written in a supported language?
  let file = $(".final-path").text();
  if (!file.endsWith(".js")) {
    return;
  }

  // Is the AST button already injected for this file?
  let astButton = $("#view-ast");
  if (astButton.length > 0) {
    return;
  }

  // Inject the AST button into the page!
  let rawButton = $("#raw-url");
  astButton = rawButton
  .clone()
  .text("AST")
  .attr("href", "#")
  .attr("id", "view-ast")
  .insertBefore(rawButton)
  .click(() => {
    $.get(rawButton.attr("href"))
    .done(data => {
      let ast = esprima.parse(data);
      let containerElement = $("<div />", { id: "ast" }).appendTo($(".blob-wrapper").empty());
      renderAST(ast, containerElement);
    })
    .fail((jqXHR, textStatus) => {
      console.log("error", jqXHR, textStatus);
    });
  });
});

function renderAST(ast, containerElement) {
  let nodeElements = new Map();

  estraverse.traverse(ast, {
    enter: (node, parent) => {
      let parentContainerElement = parent ? nodeElements.get(parent).children(".children") : containerElement;

      let nodeElement = $("<div />", { class: "node" }).appendTo(parentContainerElement);
      let typeElement = $("<div />", { class: "type", text: node.type }).appendTo(nodeElement);
      let childrenElement = $("<div />", { class: "children" }).hide().appendTo(nodeElement);
      typeElement.click(() => childrenElement.fadeToggle("fast"));

      nodeElements.set(node, nodeElement);
      console.log(node, parent);
    }
  });
};
