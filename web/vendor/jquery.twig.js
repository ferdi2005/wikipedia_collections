/**
 * Twig integration plugin for jQuery
 * 
 * Usage: $('#script_element_containing_twig_template').twig({the: 'parameters'})
 */
(function( $ ){
    
    var COMPILED_TWIG_TEMPLATE = 'compiled_twig_template';

    $.fn.twig = function( parameters ) {  
        
        var elem = this.eq(0);
        if (elem.length == 0 && console && console.error) {
            console.error('No elements passed to twig(). Maybe check the used selector?')
        }
        
        var template = elem.data(COMPILED_TWIG_TEMPLATE);
        if (!template) {
            template = twig({data: elem.html()});
            elem.data(COMPILED_TWIG_TEMPLATE, template);
        }
        
        return $(template.render(parameters));
    };
})( jQuery );