/**
 * Symfony form helper functions.
 */
var Form = {
    clonePrototype: function (prototype, target, names) {
        if (names == undefined) {
            names = [new Date().getTime()];
        }
        var target = $(target);
        var protoString = $(prototype).data('prototype');
        var $prototype = $('<div>' + protoString + '</div>');
        
        $.each(['id', 'for', 'name'], function(_, attrName) {
            $items = $prototype.find('[' + attrName + ']');
            $items.each(function() {
                var $item = $(this);
                var val = $item.attr(attrName);
                // Incrementally replace firs occurence of __name__
                $.each(names, function(_, name) {
                    val = val.replace(/__name__/, name);
                });
                $item.attr(attrName, val);
            });
        });
        
        $prototype.find('label:contains(\"__name__label__\")').text(names[names.length - 1]);
        
        // Append to target list
        return $prototype.appendTo(target);
    },
};