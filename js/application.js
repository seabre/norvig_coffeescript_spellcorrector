$(document).ready(function() {
  return $(function() {
    var content;
    content = $("#spellinput").val();
    return $("#spellinput").keyup(function() {
      var correction;
      if ($("#spellinput").val() !== content) {
        content = $("#spellinput").val();
        if (content === "") {
          return $("#output").html("");
        } else {
          correction = correct(content);
          if (correction === content) {
            return $("#output").html("");
          } else {
            return $("#output").html("Did you mean <em>" + correct(content) + "</em>?");
          }
        }
      }
    });
  });
});
