
$(function() {
    var $content = $('.articleContent');

    var self = this;    
    var museum = Museum(window.app.museum);
    var menu = new TocMenu();
    var articleControls = new ArticleControls();
    var articleBar = new ArticleBar(window.app.museum);
    var textSize = new TextSize();
    var loader = new Loader(menu);
    var languagePicker = new LanguagePicker(window.app.museum);
    var idling = false;
    var idleTimeout;
    var museumUpdatedAt;
    
    init();
    
    function init() {
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
        
        $('.articleBar .article').eq(0).click();
    }
    
    function startIdle() {
        if (!idling) {
            console.log('start-idle');
            idling = true;
            $(document).trigger('start-idle');
            
            // Check if reload is needed
            $.ajax({
                url: Routing.generate('museum_updated_at', {id: window.museum.id}),
                cache: false,
                success: function(updatedAt) {
                    if (museumUpdatedAt && museumUpdatedAt != updatedAt) {
                        console.log('New version detected, reloading');
                        document.location.reload();
                    }
                    museumUpdatedAt = updatedAt;
                }
            });
        }
    }
    
    function stopIdle(e) {
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
