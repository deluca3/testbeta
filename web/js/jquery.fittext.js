/*global jQuery */
/*!
* FitText.js 1.1
*
* Copyright 2011, Dave Rupert http://daverupert.com
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
*
* Date: Thu May 05 14:23:00 2011 -0600
*/

(function( $ ){

  $.fn.fitText = function( kompressor, options ) {

    // Setup options
    var compressor = kompressor || 1,
        settings = $.extend({
          'minFontSize' : Number.NEGATIVE_INFINITY,
          'maxFontSize' : Number.POSITIVE_INFINITY
        }, options);

    return this.each(function(){

      // Store the object
      var $this = $(this);

      // Resizer() resizes items based on the object width divided by the compressor * 10
      var resizer = function () {
          var minFontSize = settings.minFontSize,
              maxFontSize = settings.maxFontSize;

          var attrMinFontSize = $this.attr("data-fontMinSize"),
              attrMaxFontSize = $this.attr("data-fontMaxSize");

          if(attrMinFontSize != undefined) {
              minFontSize = attrMinFontSize;
          }

          if(attrMaxFontSize != undefined) {
              maxFontSize = attrMaxFontSize;
          }

          $this.css('font-size', Math.max(Math.min($this.width() / (compressor*10), parseFloat(maxFontSize)), parseFloat(minFontSize)));
      };

      // Call once to set.
      resizer();

      // Call on resize. Opera debounces their resize by default.
      $(window).on('resize.fittext orientationchange.fittext', resizer);

    });

  };

})( jQuery );
