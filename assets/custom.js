/**
 * serializing form for ajax requests
 */
(function ($) {
  $.fn.serializeFormJSON = function () {

    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
      if (o[this.name]) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };
})(jQuery);

/*$(document).on('submit', 'form', function(event) {

  if (event.isDefaultPrevented()) {
    return false;
  }

  var data = $(this).serializeFormJSON();
  console.log(data);

  $('#item-submit,.item-submit').text('Updating..');
  var url = $(this).attr('action')

  $.ajax({
    url: url,
    method: 'POST',
    data: $(this).serialize(),
    success: function(data) {
      console.log(data);
    },
    error: function() {
      alert('An error occured.')
      $('#item-submit,.item-submit').text('Submit');
    }
  });

  return false;
});*/
