
$(function() {
    var $wrap = $('.articleBarWrap');
    var $bar = $wrap.find('.articleBar');
    var $content = $('.articleContent');
    
    var blockWidth = 256;
    var blockHeight = 216;
    var museum;
    var settings = {
        language: 'en',
    };
    var menu = new TocMenu($('.tocMenu'));
    
    init();
    
    function init() {
        $.ajax({
            url: "js/data.json",
            success: function (data) {
                museum = data;
                
                // Test: duplicate articles
                for (var i = 0; i < 4; i++) {
                    data.articles.forEach(function(article) {
                        data.articles.push(article);
                    });
                }
                
                $bar.width(Math.ceil(data.articles.length/2) * blockWidth);
                console.log($bar.get(0));
                
                // Render article bar
                var tpl = twig({ data: $('#articleBar-tpl').html() });
                $bar.html(tpl.render(data));
                
                // Link model data
                $bar.find('.article').each(function(index) {
                    $(this).data('article', museum.articles[index]);
                });
                
                $bar.on('click', '.article', function() {
                    render($(this).data('article'));
                });
                
                render(museum.articles[0]);
            },
            error: function(a,b,c) {
                console.log('Error getting data', a,b,c);
                $bar.html('Er is iets mis gegaan bij het downloaden van de lijst met artikelen, we proberen het over 5 seconden opnieuw...');
                setTimeout(document.location.reload, 5000);
            }
        });
    }
    
    function render(article) {
        loadArticle(article, function(html) {
            $article = $(html);
            $content.empty().append($article);
            cleanArticle($content);
            menu.extractToc(article, $content);
        });
    }
    
    function cleanArticle($article) {
        /* Set extra classes based on inline style */
        $article.find('.infobox th[style~="background-color:"]').addClass('header');
        $article.find('.infobox td[style~="font-size:"]').addClass('subscript');
    }
    
    function loadArticle(article, callback) {
        var url = 'http://' + article.language + '.wikipedia.org' +
            '/w/api.php?action=query&prop=revisions&format=json&rvprop=content&rvparse=&titles=' + article.title;
        
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
                    console.log(page);
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
});

function TocMenu($menu) {
    
    var items = [];
    var data;
    
    
    function extractToc(articleData, $article) {
        data = articleData;
        $menu.empty();
        
        var toc = $article.find('#toc');
        if (!toc.length) { return; }
        toc.detach().appendTo($menu);
        
        $('<h2 class="articleTitle" />').text(data.humanTitle).insertAfter($menu.find('#toctitle'));
    }
    
    function findHeaderPositions() {
        
    }
    
    return {
        extractToc: extractToc,
        findHeaderPositions: findHeaderPositions,
    };
}
//# sourceMappingURL=frontend.js.map