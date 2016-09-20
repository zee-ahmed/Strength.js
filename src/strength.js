/*!
 * strength.js
 * Original author: @aaronlumsden
 * Further changes, comments: @aaronlumsden
 * Licensed under the MIT license
 */
;(function ( $, window, document, undefined ) {

    var pluginName = "strength",
        defaults = {
            strengthClass: 'strength',
            strengthMeterClass: 'strength_meter',
            strengthButtonClass: 'button_strength',
            strengthButtonText: 'Show Password',
            strengthButtonTextToggle: 'Hide Password'
        };

       // $('<style>body { background-color: red; color: white; }</style>').appendTo('head');

    function Plugin( element, options ) {
        this.element = element;
        this.$elem = $(this.element);
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {

        init: function() {


            var characters = 0;
            var capitalletters = 0;
            var loweletters = 0;
            var number = 0;
            var special = 0;

            var upperCase= new RegExp('[A-Z]');
            var lowerCase= new RegExp('[a-z]');
            var numbers = new RegExp('[0-9]');
            var specialchars = new RegExp('([!,%,&,@,#,$,^,*,?,_,~])');

            function GetPercentage(a, b) {
                    return ((b / a) * 100);
            }

            function check_strength(thisval,thisid){
                if (thisval.length >= 8) { characters = 1; } else { characters = -1; };
                if (thisval.match(upperCase)) { capitalletters = 1} else { capitalletters = 0; };
                if (thisval.match(lowerCase)) { loweletters = 1}  else { loweletters = 0; };
                if (thisval.match(numbers)) { number = 1 } else { number = 0; };
                if (thisval.match(specialchars)) { special = 1; } else { special = 0; }

                var total = characters + capitalletters + loweletters + number + special;
                var totalpercent = GetPercentage(7, total).toFixed(0);

                if (!thisval.length) {total = -1;}

                get_total(total,thisid);
            }

            function get_total(total,thisid){

                var tooshort = $('p[class="tooshort"]');
                var thismeter = $('div[data-meter="' + thisid + '"]');

                if (total <= 1) {
                    tooshort.remove();
                    thismeter.removeClass().empty();
                    $(".strength_meter").append("<p class='tooshort'>Password too short</p>");
                } else if (total == 2) {
                    tooshort.remove();
                    thismeter.removeClass().empty();
                    thismeter.addClass('weak').html('<p>Weak</p>');
                } else if (total == 3) {
                    tooshort.remove();
                    thismeter.removeClass().empty();
                    thismeter.addClass('weak').html('<p>Weak</p>');
                } else if (total == 4) {
                    tooshort.remove();
                    thismeter.removeClass().empty();
                    thismeter.addClass('medium').html('<p>Medium</p>');
                } else {
                    tooshort.remove();
                    thismeter.removeClass().empty();
                    thismeter.addClass('strong').html('<p>Strong</p>');
                }

                if (total == -1) {
                    tooshort.remove();
                    thismeter.removeClass().html('');
                }
            }


            var isShown = false;
            var strengthButtonText = this.options.strengthButtonText;
            var strengthButtonTextToggle = this.options.strengthButtonTextToggle;


            thisid = this.$elem.attr('id');

            this.$elem.addClass(this.options.strengthClass).attr('data-password',thisid).after('<label class="password_strength_label">Password strength</label><div class="'+this.options.strengthMeterClass+'"><p class="tooshort"></p><div data-meter="'+thisid+'"></div></div>');

            this.$elem.bind('keyup keydown', function(event) {
                var thisval = $('#'+thisid).val();
                $('input[type="text"][data-password="'+thisid+'"]').val(thisval);
                check_strength(thisval,thisid);

            });

             $('input[type="text"][data-password="'+thisid+'"]').bind('keyup keydown', function(event) {
                var thisval = $('input[type="text"][data-password="'+thisid+'"]').val();
                $('input[type="password"][data-password="'+thisid+'"]').val(thisval);
                check_strength(thisval,thisid);

            });



            $(document.body).on('click', '.'+this.options.strengthButtonClass, function(e) {
                e.preventDefault();

               var thisclass = 'hide_'+$(this).attr('class');

                if (isShown) {
                    $('input[type="text"][data-password="'+thisid+'"]').hide();
                    $('input[type="password"][data-password="'+thisid+'"]').show().focus();
                    $('a[data-password-button="'+thisid+'"]').removeClass(thisclass).html(strengthButtonText);
                    isShown = false;

                } else {
                    $('input[type="text"][data-password="'+thisid+'"]').show().focus();
                    $('input[type="password"][data-password="'+thisid+'"]').hide();
                    $('a[data-password-button="'+thisid+'"]').addClass(thisclass).html(strengthButtonTextToggle);
                    isShown = true;

                }



            });




        },

        yourOtherFunction: function(el, options) {
            // some logic
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );
