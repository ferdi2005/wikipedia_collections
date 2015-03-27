function Loader(menu) {
    var $wrap = $('.articleBarWrap');
    var $bar = $wrap.find('.articleBar');
    var $content = $('.articleContent');
    
    init();
    
    function init() {
        $(document).on('article-selected', function(e, article) {
            render(article);
        });
    }
    
    function render(article) {
        $content.velocity({ opacity: 0 });
        
        loadArticle(article, function(html) {
            var $article = $(html);
            $content.empty().append($article).velocity({ opacity: 1 });
            cleanArticle($content);
            addExtras(article, $content);
            menu.extractToc(article, $content);
        });
    }
    
    function cleanArticle($article) {
        /* Infobox: Set extra classes based on inline style */
        $article.find('.infobox th[style~="background-color:"]').addClass('header');
        $article.find('.infobox td[style~="font-size:"]').addClass('subscript');
        /* Remove "External links" section */
        var index = $article.find('#External_links').closest('h2').index();
        $article.children().slice(index).remove();
        $('#toc').find('a[href="#External_links"]').closest('li').remove()
    }
    
    function addExtras(article, $article) {
        /* Article header */
        var tpl = twig({ data: $('#articleHeader-tpl').html() });
        $article.prepend(tpl.render({article: article}));
    }
    
    function loadArticle(article, callback) {
        var result = null;
        $.ajax({
            url: 'https://' + article.language + '.wikipedia.org/w/api.php',
            dataType: 'jsonp',
            cache: true,
            data: {
                action: 'query',
                prop: 'revisions',
                format: 'json',
                rvprop: 'content',
                rvparse: 'rvparse',
                'continue': '',
                titles: article.title,
            },
            success: function(data) {
                $.each(data.query.pages, function(pageId, page) {
                    result = page.revisions[0]['*'];
                });
                callback(result);
            },
            error: function(a,b,c) {
                console.log('error retrieving article', a,b,c);
                callback(null);
            }
        });
    }
    
    this.render = render;
}