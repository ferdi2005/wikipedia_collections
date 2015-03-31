function TocMenu() {
    
    var $content = $('.articleContent');
    var $menu = $('.tocMenu');
    var $topBar = $('.topBar');
    var topBarHeight = $topBar.height();
    var $menuButton = $topBar.find('.menuButton');
    var $carousel = $topBar.find('.carousel');
    var $window = $(window);
    var $document = $(document);
    var windowHeight = $window.height();
    var documentHeight = $document.height();
    var items = [];
    var data;
    var curIndex = -1;
    var carousel = new TocCarousel();
    var visible = false;
    var contentScale = 0.5;
        
    init();
    
    function init() {
        $menu.on('click', 'a', function(e) {
            e.preventDefault();
            var a = $(this);
            var pos = findHeader(a.attr('href')).position();
            carousel.showIndex(a.data('index'), items);
            carousel.enabled = false;
            $('html').velocity('scroll', { 
                offset: (pos.top - topBarHeight) + 'px', 
                mobileHA: false,
                complete: function() {
                    carousel.enabled = true;
                },
            });
        });
        
        $menuButton.velocity({rotateX: -91}, {duration: 0});
        $menuButton.add($carousel).on('click', function() {
            if (visible) { hide(); } else { show(); }
        });
        $content.on('click', function() {
            if (visible) { hide(); }
        });
        
        $window.on('resize', function() {
            windowHeight = $window.height();
            findHeaderPositions();
        });
        
        $document.on('content-resized', function() {
            findHeaderPositions();
        });
        
        $window.on('scroll', onScroll);
    }
    
    function onScroll() {
        var line = window.scrollY + topBarHeight + (visible ? contentScale : 1 ) * 100;
        //DEBUG $('.line').css({position: 'absolute', borderTop: '1px solid red', width: '100%', top: line});
        
        // Find closest header above line
        var i = items.length - 1;
        for (; i >= 0; i--) {
            if (items[i].pos && items[i].pos.top < line) { break; }
        }
        if (i != curIndex) {
            $menu.find('.active').removeClass('active');
            if (i >= 0) {
                items[i].elem.addClass('active');
            }
            curIndex = i;
            
            carousel.showIndex(curIndex, items);
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
            a.data('index', i);
            items.push({
                text: a.text(),
                position: {left: 0, top: 0},
                elem: a,
                href: a.attr('href'),
            });
        });
        
        carousel.showIndex(-1, items);
        findHeaderPositions();
        $content.waitForImages(findHeaderPositions);
        onScroll();
    }
    
    function findHeaderPositions() {
        items.forEach(function(item) {
            var target = findHeader(item.href);
            if (target.length) {
                item.pos = target.position();
            }
        });
        
        documentHeight = $document.height();
    }
    
    function findHeader(id) {
        var target = $();
        
        // jQuery fails for strange id's, prefer  native function
        if (id[0] === '#') {
            target = $(document.getElementById(id.substr(1)));
        }
        
        if (target.length === 0) {
            target = $content.find(id);
        }
        
        return target;
    }
    
    function show() {
        visible = true;
        
        var offsetContent = window.scrollY - $content.position().top + topBarHeight;
        offsetContent = Math.max(0, offsetContent);
        $content.css('transform-origin', 'right ' + offsetContent + 'px');
        
        requestAnimationFrame(function() {
            $content.velocity({ scale: contentScale, translateZ: 0 }, {
                complete: function() {
                    $content.css('transform-origin', 'right top');
                    requestAnimationFrame(function() {
                        window.scrollTo(window.scrollX, window.scrollY - (1 - contentScale) * offsetContent);
                        findHeaderPositions();
                    });
                }
            });
            $menu.velocity({ translateX: $menu.outerWidth(), translateZ: 0 });
        });
    }
    
    function hide() {
        visible = false;
        
        var offsetContent = window.scrollY - $content.position().top + topBarHeight;
        offsetContent = Math.max(0, offsetContent);
        $content.css('transform-origin', 'right ' + ((1/contentScale) * offsetContent) + 'px');
        
        requestAnimationFrame(function() {
            window.scrollTo(window.scrollX, window.scrollY - offsetContent + (1/contentScale) * offsetContent);
            
            $content.velocity({ scale: 1, translateZ: 0 }, {
                complete: function() {
                    findHeaderPositions();
                }
            });
            $menu.velocity({ translateX: -1, translateZ: 0 });
        });
    }
    
    return {
        extractToc: extractToc,
        findHeaderPositions: findHeaderPositions,
        show: show,
        hide: hide,
    };
}

function TocCarousel() {
    var $topBar = $('.topBar');
    var $carousel = $topBar.find('.carousel');
    var $sides = $carousel.find('.side');
    var $menuButton = $topBar.find('.menuButton');
    
    var self = this;
    self.enabled = true;
    var curIndex = -1;
    var targetIndex = -1;
    var curSideIndex = 1;
    var rotation = 0;
    var items = [];
    var animating = false;
    var carouselHeight = 40;
    
    function showIndex(index, newItems) {
        if (!self.enabled) { return; }
        targetIndex = index;
        items = newItems;
        animate();
    }
    
    function animate() {
        if (curIndex == targetIndex) { return; }
        if (animating) { return; }
        
        var newSideIndex;
        var addRotation;
        var label;
        
        if (targetIndex > curIndex) {
            newSideIndex = (curSideIndex + 1) % 4;
            addRotation = 90;
        } else {
            newSideIndex = curSideIndex - 1;
            if (newSideIndex < 0) { newSideIndex += 4; }
            addRotation = -90;
        }
        
        if (targetIndex == -1) {
            label = '<img src="' + Routing.getWebPath() + '/img/logo.png" alt="Wikipedia Collections" height="40px">';
            $menuButton.velocity({rotateX: -91, scale: 0.6}, {duration: 200});
        } else {
            label = '<span class="header">' + items[targetIndex].text + '</span>';
            $menuButton.velocity({rotateX: 0, scale: 1}, {duration: 200});
        }
        
        $sides.eq(newSideIndex).html(label);
        curSideIndex = newSideIndex;
        curIndex = targetIndex;
        rotation += addRotation;
        
        animating = true;
        $carousel.velocity({translateZ: -carouselHeight/2, rotateX: rotation}, {duration: 200, complete: function() {
            animating = false;
            animate();
        }});
    }
    
    
    self.showIndex = showIndex;
    return self;
}
