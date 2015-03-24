/**
 * Symfony form helper functions.
 */
var Form = {
    clonePrototype: function (prototype, target, names) {
        var target = $(target);
        var protoString = $(prototype).data('prototype');
        
        protoString = Form.insertNames(protoString, names);
        
        // Append to target list
        target.append('<div>' + protoString + '</div>');
    },
    
    insertNames: function(protoString, names) {
        if (names == undefined) {
            names = [new Date().getTime()];
        }

        // Search for combined __name__ instances, replace with provided names
        var searchRegEx = '="(\\S+)';
        var nameParts = [];
        for(var i in names) {
            nameParts.push('__name__')
        }
        searchRegEx += nameParts.join('(\\S+)');
        searchRegEx += '(\\S+)"';
        // console.log(searchRegEx);

        var replaceString = '="$1';
        for (var i = 0; i < names.length; i++) {
            replaceString += names[i];
            replaceString += '$' + (i+2);
        }
        replaceString += '"';
        // console.log(replaceString);

        protoString = protoString.replace(new RegExp(searchRegEx, 'g'), replaceString);

        // Search for standalone __name__label__ instance, replace with last name
        protoString = protoString.replace(/__name__label__/g, names[names.length - 1]);

        // Search for standalone __name__ instance, replace with last name
        protoString = protoString.replace(/__name__/g, names[names.length - 1]);
        
        return protoString;
    },
    
};