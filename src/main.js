import "babelify/polyfill";
import $ from "jquery";
import esprima from "esprima";

$(() => {
  let file = $(".final-path").text();

  if (file.endsWith(".js")) {
    let rawButton = $("#raw-url");
    let astButton = rawButton
      .clone()
      .text("AST")
      .attr("href", "#")
      .removeAttr("id")
      .insertBefore(rawButton)
      .click(() => {
        $.get(rawButton.attr("href"))
        .done(data => {
          let ast = esprima.parse(data);
          console.log(ast);
        })
        .fail((jqXHR, textStatus) => {
          console.log("error", jqXHR, textStatus);
        });
      });
  }
});
