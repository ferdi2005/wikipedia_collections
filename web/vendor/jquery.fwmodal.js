/**
 * Animate in modal window
 * v 1.2
 */
(function( $ ){

  $.fn.fwModal = function(options) {

		var $self = this;
		var offset = $self.offsetParent().offset();
		
		if (options !== undefined) {
			$self.data('options', options);
		} else {
			options = $self.data('options');
		}

		var settings = $.extend( {
			duration			: 'fast',			// Milliseconds scroll animation takes
			top					: undefined,		// Final top position for the modal, calculated automatically when undefined
			left				: undefined,		// Final left position for the modal, calculated automatically when undefined
			clickToClose		: true,				// Allow clicking the backdrop to close modal
			closed				: function() {},	// Callback when the modal has closed
			complete			: function() {}		// Callback that is called when the modal is completely shown
		}, (options ? options : {}));

		if ($self.is(':hidden')) {
			init();
		} else {
			remove();
		}

		function init() {

			var calculatedLeft = $(window).width() / 2 - $self.outerWidth() / 2;
			var left = settings.left !== undefined ? settings.left : calculatedLeft;

			$self.css({
				position: 'absolute',
				left: left - offset.left,
				top: $(window).scrollTop() - $self.outerHeight() - offset.top,
				zIndex: 1000,
				display: 'block'
			});

			$backdrop = $('<div class="backdrop shield" />');
			$backdrop.css({
				position: 'fixed',
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
				zIndex: 999,
				opacity: 0
			});
			$backdrop.insertBefore($self);
			$self.data('fw-modal-backdrop', $backdrop);
			if (settings.clickToClose) {
				$backdrop.click(remove);
			}

			$backdrop.animate({opacity: 1}, settings.duration, function() {

				var calculatedTop = Math.max(0, $(window).height() / 2 - $self.outerHeight() / 2);
				var top = settings.top !== undefined ? settings.top : calculatedTop;

				$self.animate({
					top: ($(window).scrollTop() + top) - offset.top
				}, settings.duration, settings.complete);
			});
		}

		function remove() {
			$backdrop = $self.data('fw-modal-backdrop');
			
			$self.animate(
				{ top: $(window).scrollTop() - $self.outerHeight() - offset.top },
				settings.duration,
				function() {
					$self.hide();
					settings.closed();
				}
			);

			if ($backdrop) {
				$backdrop.animate({ opacity: 0 }, settings.duration, function() {
					$backdrop.remove();
				});
			}
		}

	return $self;
	
  };
})( jQuery );