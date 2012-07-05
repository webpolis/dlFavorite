/**
 * dl Favorite
 * 
 * author: Nicolas Iglesias <nico@webpolis.com.ar>
 */
;
(function($){
 
    $.fn.extend({ 
         
        dlFavorite: function(opts) {
            var self = this;
            
            var defaults = {
                imgStateDisabled: '/images/icons/star_grey.png',
                imgStateEnable: '/images/icons/star.png',
                ajax: undefined,
                onChange: function(ret, state, el){
                    
                }
            };
            
            var methods = {
                init : function(a, opts){
                    if($(self).is(':checked')){
                        $(a).find('img').attr('src',opts.imgStateEnable);
                    }else{
                        $(a).find('img').attr('src',opts.imgStateDisabled);
                    }
                },
                toggle : function(a, opts){
                    $(self).attr('checked', !$(self).is(':checked'));
                    methods['init'](a,opts);
                    $(self).trigger('change');
                }
            }
            
            if(!$(self).is('input[type=checkbox], input[type=radio]')){
                throw 'dlFavorite: element is not radio/checkbox.';
                return this;
            }
            
            if ( methods[opts] ) {
                return methods[opts].apply(this, Array.prototype.slice.call(arguments, 1));
            }else{
                var opts = $.extend(defaults, opts);
                return this.each(function(i,e) {
                    $(e).button('destroy');
                    
                    var a = $('<a />').attr({
                        href:'javascript:void(0)',
                        style:$(e).attr('style'),
                        'class': $(e).attr('class')
                    });
                    var img = $('<img />');
                    img.attr({
                        src: opts.enabled ? opts.imgStateEnable : opts.imgStateDisabled
                    }).addClass('dlFavorite-'+(opts.enabled ? 'enabled':'disabled'));
                    $(a).html(img);
                    $(e).hide().after(a);
                    $(a).click(function(ev){
                        ev.stopPropagation();
                        methods['toggle'](a, opts);
                    });
                    
                    methods['init'](a, opts);
                    
                    $(e).bind('change', function(ev){
                        if(opts.ajax !== undefined){
                            var i = $(e).is(':checked') ? 1 : 0;
                            $.ajax({
                                url: opts.ajax,
                                type:'POST',
                                data:$(e).attr('name')+'='+i,
                                dataType: 'json',
                                success: function(ret){
                                    opts.onChange(ret, $(e).is(':checked'), e);
                                },
                                error: function(){
                                    opts.onChange(undefined, $(e).is(':checked'), e);
                                }
                            });
                        }else{
                            opts.onChange(undefined, $(e).is(':checked'), e);
                        }
                    });
                });
            }
        }
    });
     
})(jQuery);
