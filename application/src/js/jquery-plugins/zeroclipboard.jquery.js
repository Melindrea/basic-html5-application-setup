/**
 * jQuery ZeroClipboard Plugin v2.0
 * Created by DudeAmI <dudeami0@gmail.com>
 * Homepage: http://dudeami.com/
 *
 * Licensing
 * ---------
 *
 *	This program is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU General Public License as published by
 *	the Free Software Foundation, either version 3 of the License, or
 *	(at your option) any later version.
 *
 *	This program is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *	GNU General Public License for more details.
 *
 *	You should have received a copy of the GNU General Public License
 *	along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
var ZeroClipboard;
(function ($) {
	"use strict";
	var events, $this;
	/**
	* Stores all the event functions we'll be using.
	*/
	events = {
		elemouseenter : function (event) {
			$this = $(this);
			// If not loaded, skip this
			if (!ZeroClipboard.loadCheck()) {
				// console.debug("Zeroclipboard is not loaded, please wait...");
				setTimeout(function () {
					$this.trigger('mouseenter.zeroclipboard');
				}, ZeroClipboard.pollingInterval);
				return;
			}
			// console.debug("Zeroclipboard is loaded!");

			$('#zeroclipboard').data('activeele', $this);
			var options = $this.data('zeroclipboard');
			// Position the zeroclipboard element over this element
			var position = $this.offset();
			var width;
			var height;
			var paddingLeft = parseInt($this.css('padding-left').replace('px', ''), 10);
			var paddingTop = parseInt($this.css('padding-top').replace('px', ''), 10);
			var marginLeft = parseInt($this.css('margin-left').replace('px', ''), 10);
			var marginTop = parseInt($this.css('margin-top').replace('px', ''), 10);
			var borderLeft = parseInt($this.css('border-left-width').replace('px', ''), 10);
			var borderTop = parseInt($this.css('border-top-width').replace('px', ''), 10);
			switch (options.sizeMethod){
				case 'outer':
					width = $this.outerWidth(true);
					height = $this.outerHeight(true);
					position.left -= marginLeft;
					position.top -= marginTop;
					break;
				case 'inner':
					width = $this.innerWidth();
					height = $this.innerHeight();
					position.left += borderLeft;
					position.top += borderTop;
					break;
				default:
					width = $this.width();
					height = $this.height();
					position.left += borderLeft + paddingLeft;
					position.top += borderTop + paddingTop;
					break;
			}
			var css = {
				'marginLeft': position.left,
				'marginTop'	: position.top,
				'width'		: width,
				'height'	: height
			};
			$('#zeroclipboard').css(css);
			$('#zeroclipboard-flash').css({
				'width' : width,
				'height': height
			}).attr({
				'width' : width,
				'height': height
			});
			
			$this.zeroclipboard('update');
		},
		elemouseleave : function (event) {
		},
		eleremove	: function (event) {
			// Check if the element being removed was the active element
			$(this).zeroclipboard('destroy');
		}
	};

	// Setup our functions
	var methods = {
		/**
		* Initiates the object to support a zeroclipboard, and creates the new flash instance if required.
		*
		* @param	newoptions	The options to set to this element.
		*/
		init: function (newoptions) {
			var $this = $(this);
			var options = $this.data('zeroclipboard');
			// console.debug(newoptions);
			if (typeof options === 'undefined') {
				if (typeof newoptions === 'undefined') {
					newoptions = {};
				}
				options = $.merge(newoptions, {
					sizeMethod : 'outer',
					text		: 'Copy me!',
					hand		: false
				});
			} else {
				options = $.merge(newoptions, options);
			}
			// console.debug(options);
			// Check if a ZeroClipboard object has been initiated.
			if (!ZeroClipboard.initiated) {
				// console.debug("Initiating zeroclipboard object.");
				// Not initiated, create an object
				$('<div id="zeroclipboard" style="position: absolute; left: 0; right: 0; z-index: 60000;"><div id="zeroclipboard-flash"></div></div>')
					.prependTo('body');
				$('#zeroclipboard')
					.data('activeele', false);
				// Now, check if swfobject is installed
				if (typeof swfobject !== 'undefined') {
					var swfoptions = {
						wmode			: 'transparent',
						bgcolor			: '#ffffff',
						quality			: 'best',
						loop			: 'false',
						allowscriptaccess: 'always',
						allowfullscreen	: 'false'
					};
					swfobject.embedSWF(
						ZeroClipboard.moviepath,
						'zeroclipboard-flash',
						"100", "100", "9.0.0", "",
						{
							'id': 'notneeded',
							'width': 100,
							'height': 100
						},
						swfoptions
					);
					ZeroClipboard.initiated = true;
					// Start polling the elements
					setInterval(function () {
						var $zeroclipboard = $('#zeroclipboard');
						if ($zeroclipboard.data('activeele') !== false) {
							var $activeele = $zeroclipboard.data('activeele');
							if (!$activeele.is(':visible')) {
								$activeele.trigger('mouseleave.zeroclipboard');
							}
						}
					}, ZeroClipboard.pollingInterval);
					// console.debug("Setup of zeroclipboard is complete.");
				}
			}
			// Check if the element has already been added
			if (typeof $this.data('zeroclipboard') === 'undefined') {
				// Start binding our events to this element
				$this
					.bind('remove.zeroclipboard',	events.eleremove)
					.bind('mouseenter.zeroclipboard', events.elemouseenter)
					.bind('mouseleave.zeroclipboard', events.elemouseleave);
				// Run an update... Maybe? TODO: Check without running.
				$this.zeroclipboard('update');
				// console.debug("Done initiating this element");
			}
			$this.data('zeroclipboard', options);
			$this.zeroclipboard('update');
		},

		/**
		* Destroys the element
		*
		*/
		destroy: function () {
			var $activeele = $('#zeroclipboard').data('activeele');
			if ($(this).get(0) === $activeele.get(0)) {
				// Just hide the zeroclipboard
				$('#zeroclipboard').css({
					marginLeft : '-100%',
					marginTop : '-100%'
				});
				$('#zeroclipboard').data('activeele', false);
			}
			$(this).unbind('.zeroclipboard');
		},

		/**
		* Updates the zeroclipboard
		*
		*/
		update: function () {
			// console.debug("Update was called on the element.");
			var $zeroclipboard = $('#zeroclipboard');
			var $activeele = $zeroclipboard.data('activeele');
			if (ZeroClipboard.loaded && $activeele !== false) {
				var $zeroclipboardflash = document.getElementById('zeroclipboard-flash');
				var options = $activeele.data('zeroclipboard');
				// update the text for this elements text
				// console.debug(options.text);
				$zeroclipboardflash.setText(options.text);
				// and update the if the cursor should be shown
				$zeroclipboardflash.setHandCursor(options.hand);
			}
		}
	};

	$.fn.zeroclipboard = function(method) {
		// Method calling logic
		if ( methods[method] ) {
			methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' + method + ' does not exist on jQuery.tooltip' );
		}
		return $(this);
	};

}(jQuery));

// This is how the flash object will communicate with our JS
ZeroClipboard = {

	moviepath		: 'scripts/ZeroClipboard.swf',
	pollingInterval : 500,
	
	// Our states
	initiated	: false,
	loaded		: false,
	disableEvents : false,

	loadCheck: function () {
		"use strict";
		var $zeroclipboardflash = $('#zeroclipboard-flash');
		var $activeele = $('#zeroclipboard').data('activeele');
		var movie = $zeroclipboardflash.get(0);
		if (!movie) {
			setTimeout( function() {ZeroClipboard.dispatch('', 'load', null);}, 1 );
		} else if (!ZeroClipboard.loaded && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
			setTimeout( function() {ZeroClipboard.dispatch('', 'load', null);}, 100 );
			ZeroClipboard.loaded = true;
		} else {
			ZeroClipboard.loaded = true;
		}
		if (ZeroClipboard.loaded) {
			if ($activeele !== false) {
				$activeele.zeroclipboard('update');
			}
		}
		return ZeroClipboard.loaded;
	},

	// And this is where we communicate with the flash to the JS.
	dispatch: function (id, eventName, args) {
		"use strict";
		eventName = eventName.toString().toLowerCase().replace(/^on/, '');
		var $zeroclipboard = $('#zeroclipboard');
		var $zeroclipboardflash = $('#zeroclipboard-flash');
		var $activeele = $zeroclipboard.data('activeele');
		// console.log("Dispatch happened. string is " + eventName);
		switch (eventName) {
			case 'load':
				// console.debug("Loaded was called...");
				ZeroClipboard.loadCheck();
				break;
			case 'complete':
				$activeele.trigger('complete');
				break;
			case 'mouseover':
				$activeele
					.trigger('mouseover')
					.trigger('mouseenter');
				break;
			case 'mouseout':
				$activeele
					.trigger('mouseout')
					.trigger('mouseleave');
				ZeroClipboard.loaded = false;
				// This is to cover up the bug of dragging the mouse out of the flash.
				// Mainly used when reseting css
				if ($activeele.data('zeroclipboard_downfix')) {
					$activeele.trigger('mouseup');
				}
				break;
			case 'mouseup':
				$activeele.trigger('mouseup');
				$activeele.data('zeroclipboard_downfix', false);
				break;
			case 'mousedown':
				$activeele.data('zeroclipboard_downfix', true);
				$activeele.trigger('mousedown');
				break;
		}
	},
	update: function (id) {
		// Not really needed anymore :p
	}
};

// Code borrowed from
// http://stackoverflow.com/questions/2200494/jquery-trigger-event-when-an-element-is-removed-from-the-dom
(function ($) {
	"use strict";
	var ev = new $.Event('remove'),
	orig = $.fn.remove;
	$.fn.remove = function() {
		$(this).trigger(ev);
		orig.apply(this, arguments);
	};
}(jQuery));
