$(function() {
    var btn = $('<a class="btn btn-primary">Blaat</a>').appendTo('body');
    var articles = $('.articles');
    
    btn.on('click', function() {
        Form.clonePrototype(articles, articles);
    });
    
    
    
})