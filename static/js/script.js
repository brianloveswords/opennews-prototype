function getHtml() {
  jQuery.get('/article', {url: $('input').val()}, function (data) {
    $('textarea').html(data.content);
  })
};


$('input').bind('keyup', function (event) {
  var $el = $(event.currentTarget);
  switch (event.keyCode) {
      // enter key, user wants to save
   case 13:
    $el.trigger('blur');
  }
});

$('input').bind('blur', getHtml);
