import "babelify/polyfill";
import esprima from "esprima";
import estraverse from "estraverse";
import gitHubInjection from "github-injection";
import githubPageType from "github-page-type";
import $ from "jquery";

gitHubInjection(window, (err) => {
  if (err) {
    return;
  }

  // Is the current GitHub page a file in a repository?
  if (!githubPageType(window.location.href, githubPageType.REPOSITORY_BLOB)) {
    return;
  }

  // Is the file written in a supported language?
  let file = $(".final-path").text();
  if (!file.endsWith(".js")) {
    return;
  }

  // Is the AST button already injected for this file?
  let astButton = $("#ast");
  if (astButton.length > 0) {
    return;
  }

  // Inject the AST button into the page!
  let rawButton = $("#raw-url");
  astButton = rawButton
  .clone()
  .text("AST")
  .attr("href", "#")
  .attr("id", "ast")
  .insertBefore(rawButton)
  .click(() => {
    $.get(rawButton.attr("href"))
    .done(data => {
      let ast = esprima.parse(data);
      let container = $(".blob-wrapper").empty();
      renderAST(ast, container);
    })
    .fail((jqXHR, textStatus) => {
      console.log("error", jqXHR, textStatus);
    });
  });
});

function renderAST(ast, container) {
  estraverse.traverse(ast, {
    enter: (node, parent) => {
      $("<div />", { text: node.type }).appendTo(container);
    }
  });
};
