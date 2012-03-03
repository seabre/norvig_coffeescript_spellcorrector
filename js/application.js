$(document).ready(function() {

  $(function() {
    var content = $('#spellinput').val();

    $('#spellinput').keyup(function() { 
        if ($('#spellinput').val() != content) {
            content = $('#spellinput').val();
            if (content == "")
             { $("#output").html("");}
            else 
              { 
               correction = correct(content);
               if (correction == content)
             { $("#output").html("");}
               else {
               $("#output").html("Did you mean <em>"+ correct(content) +"</em>?");}

              }
        }
    });
});

});
