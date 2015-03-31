function ArticleBar() {
    var $wrap = $('.articleBarWrap');
    var wrapElem = $wrap.get(0);
    var $bar = $wrap.find('.articleBar');
    var $articles;
    
    var blockWidth = 256;
    var blockHeight = 216;
    var museum;
    var idling = true;
    var idleRight = true;
    var scrollLeft = 0;
    var timeout;
    
    function init(loader, _museum) {
        museum = _museum;
        $bar.width(Math.ceil(museum.articles.length/2) * blockWidth);
        
        // Render article bar
        var tpl = twig({ data: $('#articleBar-tpl').html() });
        $bar.html(tpl.render(museum));
        $articles = $bar.find('.article');
        
        // Link model museum
        $articles.each(function(index) {
            $(this).data('article', museum.articles[index]);
        });
        
        $bar.on('click', '.article', function() {
            var $article = $(this);
            $bar.find('.active').removeClass('active');
            $article.addClass('active');
            $article.trigger('article-selected', $article.data('article'));
        });
        
        $(document).on('start-idle', function() {
            idling = true;
            idle();
        });
        
        $(document).on('stop-idle', function() {
            $wrap.stop();
            idling = false;
        });
    }
    
    function idle() {
        if (!idling) { return; }
        
        // Select article at random, scroll to it, click it.
        var $article = $articles.eq(Math.round( Math.random() * $articles.length ));
        var scrollLeft = wrapElem.scrollLeft + $article.position().left  + $article.width()/2 - $(window).width()/2;
        scrollLeft = Math.max(0, scrollLeft);
        $wrap
            .animate({ scrollLeft: scrollLeft }, { duration: 200 + Math.abs(wrapElem.scrollLeft - scrollLeft) * 3.5 })
            .promise().done(function() {
                if (!idling) { return; }
                
                $article.trigger('click');
                
                clearTimeout(timeout);
                timeout = setTimeout(idle, 5000);
            })
        ;
        
        // requestAnimationFrame(idle);
        // // setTimeout(idle, 500);
    }
    
    this.init = init;
}