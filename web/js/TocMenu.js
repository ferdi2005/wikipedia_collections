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
        var i = items.length - 1;
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