import "babel-polyfill";
import esprima from "esprima";
import estraverse from "estraverse";
import ghInjection from "github-injection";
import ghPageType from "github-page-type";
import $ from "jquery";

ghInjection(window, err => {
  !err &&

  // Is the current GitHub page a file in a repository?
  ghPageType(window.location.href, ghPageType.REPOSITORY_BLOB) &&

  // Is the file written in a supported language?
  $(".final-path").text().endsWith(".js") &&

  // Is the toggle button already injected on the page for this file?
  $("#toggle-ast").length <= 0 &&

  renderToggleButton();
});

function renderToggleButton() {
  let fileElement = $(".file");
  let astElement = $("<div />", { id: "ast" }).hide().appendTo(fileElement);
  let codeElement = fileElement.find(".blob-wrapper");
  let rawButton = fileElement.find("#raw-url");
  let toggleButton = rawButton
  .clone()
  .text("AST")
  .attr("href", "#")
  .attr("id", "toggle-ast")
  .insertBefore(rawButton)
  .click(() => {
    if (toggleButton.text() === "AST") {
      codeElement.hide();
      astElement.show();
      toggleButton.text("Code");

      // Has the file's AST been rendered yet? If not, do it now.
      if (astElement.children().length <= 0) {
        $("<p />", { class: "load-in-progress" }).appendTo(astElement);

        $.get(rawButton.attr("href"))
        .always(() => astElement.empty())
        .then(data => {
          let deferred = $.Deferred();

          // JavaScript has a different grammar depending on the source type,
          // and each one requires a separate parsing approach. Since we don't
          // know the source type, just attempt all of them.
          try { deferred.resolve(esprima.parse(data, { sourceType: "module" })) }
          catch (err) {
            try { deferred.resolve(esprima.parse(data, { sourceType: "script" })) }
            catch (err) { deferred.reject(err) }
          }

          return deferred.promise();
        })
        .done(ast => renderAST(ast, astElement))
        .fail(() => $("<p />", { class: "load-failed" }).appendTo(astElement));
      }
    }
    else {
      astElement.hide();
      codeElement.show();
      toggleButton.text("AST");
    }
  });
}

function renderAST(ast, astElement) {
  let nodeElements = new Map();

  estraverse.traverse(ast, {
    enter: (node, parent) => {
      let parentElement = parent ? nodeElements.get(parent).children(".children") : astElement;
      let nodeElement = $("<div />", { class: "node" }).appendTo(parentElement);
      let typeElement = $("<div />", { class: "type", text: node.type }).appendTo(nodeElement);

      switch (node.type) {
        case "Literal":
          $("<span />", { class: "value", text: node.value }).appendTo(typeElement);
          typeElement.addClass("leaf");
          break;
        case "Identifier":
          $("<span />", { class: "name", text: node.name }).appendTo(typeElement);
          typeElement.addClass("leaf");
          break;
        default:
          let childrenElement = $("<div />", { class: "children" }).hide().appendTo(nodeElement);
          typeElement.addClass("branch").click(() => childrenElement.fadeToggle("fast"));
          nodeElements.set(node, nodeElement);
      }
    }
  });
}
