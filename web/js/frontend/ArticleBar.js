function ArticleBar(museum) {
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
    var currentLanguage = museum.defaultLanguage;
    var currentArticle;
    
    attachHandlers();
    init();
    
    function attachHandlers() {
        $bar.on('click', '.article', function() {
            var $article = $(this);
            $bar.find('.active').removeClass('active');
            $article.addClass('active');
            currentArticle = $article.data('article').getTranslation(currentLanguage);
            $article.trigger('article-selected', currentArticle);
        });
        
        $(document).on('start-idle', function() {
            idling = true;
            idle();
        });
        
        $(document).on('stop-idle', function() {
            idling = false;
            $wrap.stop();
        });
        
        $(document).on('language-selected', function(e, language) {
            currentLanguage = language;
            var count = 0;
            $articles.each(function(index) {
                var $article = $(this);
                var article = $article.data('article');
                var translation = article.getTranslation(language);
                if (translation) {
                    $article.show().find('h4').text(translation.title);
                    count++;
                } else if ($article.is('.active')) {
                    // Keep $article, to lessen confusion
                    count++;
                } else {
                    $article.hide();
                }
            });
            $bar.width(Math.ceil(count/2) * blockWidth);
            if (currentArticle) {
                $wrap.prop('scrollLeft', getScrollAmount($articles.filter('.active')));
            }
        });
        
        $(document).on('search-result-selected', function(e, selectedArticle) {
            $articles.each(function() {
                var $article = $(this);
                var article = $article.data('article');
                if (article.isTranslationOf(selectedArticle)) {
                    $wrap.prop('scrollLeft', getScrollAmount($article));
                    $article.trigger('click');
                }
            })
        });
    }
    
    function init(language) {
        var articles = museum.articles;
        
        // Render article bar
        $bar.html($('#articleBar-tpl').twig({articles: articles, language: language}));
        $articles = $bar.find('.article');
        
        // Link model museum
        $articles.each(function(index) {
            $(this).data('article', articles[index]);
        });
    }
    
    function idle() {
        if (!idling) { return; }
        
        // Select article at random, scroll to it, click it.
        var $article = $articles.eq(Math.round( Math.random() * $articles.length ));
        var scrollLeft = getScrollAmount($article);
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
    
    function getScrollAmount($article) {
        return wrapElem.scrollLeft + $article.position().left  + $article.width()/2 - $(window).width()/2
    }
    
    this.init = init;
}