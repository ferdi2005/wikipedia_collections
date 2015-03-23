
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
    var menu = new TocMenu();
    menu.show();
    
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

        // Set viewport meta tag
        $(window).on('resize', setMetaTag);
        setMetaTag();
        function setMetaTag() {
            $('meta#viewport').attr('content', 'width=' + $(window).width() + ', initial-scale=1');
        }
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

function TocMenu() {
    
    var $content = $('.articleContent');
    var $menu = $('.tocMenu');
    var $topBar = $('.topBar');
    var $window = $(window);
    var windowHeight = $window.height();
    var items = [];
    var data;
    var curIndex = -1;
    
    init();
    
    function init() {
        $menu.on('click', 'a', function(e) {
            e.preventDefault();
            var pos = $content.find($(this).attr('href')).position();
            $("html").velocity("scroll", { offset: (pos.top - $topBar.height()) + 'px', mobileHA: false });
            hide();
        });
        
        $window.on('resize', function() {
            windowHeight = $window.height();
        });
        
        $window.on('scroll', onScroll);
    }
    
    function onScroll() {
        var center = window.scrollY + windowHeight/2;
        // Find closest header above center
        var i = items.length - 1
        for (; i >= 0; i--) {
            if (items[i].pos.top < center) { break; }
        }
        console.log(i);
        if (i != curIndex) {
            $menu.find('.active').removeClass('active');
            items[i].elem.addClass('active');
            curIndex = i;
        }
    }
    
    function extractToc(articleData, $article) {
        data = articleData;
        $menu.empty();
        items = [];
        
        var toc = $article.find('#toc');
        if (!toc.length) { return; }
        toc.detach().appendTo($menu);
        
        $('<h2 class="articleTitle" />').text(data.humanTitle).insertAfter($menu.find('#toctitle'));
        
        $menu.css('background-image', 'linear-gradient(rgba(0, 0, 0, 0.5) 0%, rgb(0, 0, 0) 40%), url(' + articleData.image + ')');
        
        toc.find('ul li a').each(function(i) {
            var a = $(this);
            items.push({
                text: a.text(),
                position: {left: 0, top: 0},
                elem: a,
                href: a.attr('href'),
            });
        });
        
        findHeaderPositions();
        $content.waitForImages(findHeaderPositions);
    }
    
    function findHeaderPositions() {
        items.forEach(function(item) {
            item.pos = $content.find(item.href).position();
        });
    }
    
    function show() {
        $menu.velocity({translateX: $menu.outerWidth(), translateZ: 0});
    }
    
    function hide() {
        $menu.velocity({translateX: 0, translateZ: 0});
    }
    
    return {
        extractToc: extractToc,
        findHeaderPositions: findHeaderPositions,
        show: show,
        hide: hide,
    };
}
//# sourceMappingURL=frontend.js.map