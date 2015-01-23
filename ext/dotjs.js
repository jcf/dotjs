(function($) {
  'use strict';

  function getURL(s) {
    return 'https://localhost:3131/' + s + '.js';
  }

  $.ajax({
    url: getURL(location.hostname.replace(/^www\./, '')),
    dataType: 'text',
    success: function (data) {
      $(function () { eval(data); });
    },
    error: function () {
      console.error('No dotjs server found at https://localhost:3131.');
    }
  });
})(jQuery);
