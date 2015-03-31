
$(function() {
    var $content = $('.articleContent');

    var self = this;    
    var museum;
    var settings = {
        language: 'en',
    };
    var menu = new TocMenu();
    var articleControls = new ArticleControls();
    var articleBar = new ArticleBar();
    var textSize = new TextSize();
    var loader = new Loader(menu);
    var idling = false;
    var idleTimeout;
    
    init();
    
    function init() {
        museum = window.museum;
        
        articleBar.init(loader, museum);
        
        if (!localStorage.noIdle) {
            idleTimeout = setTimeout(startIdle, 2000);
        }

        // Set viewport meta tag
        $(window).on('resize', setMetaTag);
        setMetaTag();
        function setMetaTag() {
            $('meta#viewport').attr('content', 'width=' + $(window).width() + ', initial-scale=1');
        }
        
        FastClick.attach(document.body);
        
        $(document).on('touchstart keydown', stopIdle);
        
        $('.articleBar .article').eq(32).click();
    }
    
    function startIdle() {
        if (!idling) {
            console.log('start-idle');
            $(document).trigger('start-idle');
            idling = true;
        }
    }
    
    function stopIdle() {
        if (idling) {
            console.log('stop-idle');
            $(document).trigger('stop-idle');
            idling = false;
        }
        clearTimeout(idleTimeout);
        if (!localStorage.noIdle) {
            idleTimeout = setTimeout(startIdle, 2 * 60 * 1000);
        }
    }
});
