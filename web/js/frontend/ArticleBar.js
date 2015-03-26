function ArticleBar() {
    var $bar = $('.articleBar');
    
    var blockWidth = 256;
    var blockHeight = 216;
    var museum;
    
    function init(loader, _museum) {
        museum = _museum;
        $bar.width(Math.ceil(museum.articles.length/2) * blockWidth);
        
        // Render article bar
        var tpl = twig({ data: $('#articleBar-tpl').html() });
        $bar.html(tpl.render(museum));
        
        // Link model museum
        $bar.find('.article').each(function(index) {
            $(this).data('article', museum.articles[index]);
        });
        
        $bar.on('click', '.article', function() {
            var $article = $(this);
            $bar.find('.active').removeClass('active');
            $article.addClass('active');
            $article.trigger('article-selected', $article.data('article'));
        });
        
        $bar.find('.article').eq(0).click();
    }
    
    this.init = init;
}