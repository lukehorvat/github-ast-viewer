import "babelify/polyfill";
import $ from "jquery";

$(() => {
  let file = $(".final-path").text();

  if (file.endsWith(".js")) {
    let rawButton = $("#raw-url");
    let astButton = rawButton.clone()
      .text("AST")
      .attr("id", "ast-url")
      .attr("href", "#")
      .insertBefore(rawButton)
      .click(() => {
        $.get(rawButton.attr("href"))
        .done(data => {
          console.log("success", data);
        })
        .fail((jqXHR, textStatus) => {
          console.log("error", jqXHR, textStatus);
        });
      });
  }
});
