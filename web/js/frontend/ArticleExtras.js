function ArticleExtras() {

    var $content = $('.articleContent');
    var $imageOverlay = $('.imageOverlay');
    var $imageSpinner = $imageOverlay.find('.spinner');
    var $scrollReminder = $('.scrollReminder');

    init();

    function init() {
        $content.on('click', '.articleHeader', function() {
            var $articleHeader = $(this).closest('.articleHeader');
            var $img = $articleHeader.find('img');

            var height = $articleHeader.is('.fullscreen') ? 400 : $img.height();
            $articleHeader
                .toggleClass('fullscreen')
                .velocity({ maxHeight: height }, function() {
                    $img.trigger('content-resized');
                })
            ;
        });
        
        $content.on('click', 'a', function(e) {
            e.preventDefault();
            var a = $(this);
            
            if (a.is('.image')) {
                $imageOverlay.show();
                $imageSpinner.show();
                
                var titles = [a.attr('href')].map(wikipedia.getTitleFromUrl).map(wikipedia.cleanImageTitle);
                wikipedia.getThumbs(titles, '1536x2048', function(urls) {
                    // Preload img
                    var img = new Image();
                    img.onload = function() {
                        $imageSpinner.hide();
                        $imageOverlay.css('background-image', 'url(' + urls[0].image + ')');
                    };
                    img.src = urls[0].image;
                }, function() {
                    $imageOverlay.hide();
                });
            }
        });
        
        $content.on('click', '.returnToTop', function(e) {
            e.preventDefault();
            $('html').velocity('scroll', {offset: '0px', mobileHA: false, duration: Math.max(400, $(document).height()/10) });
            $(this).trigger('returntotop-article');
        });
        
        $content.on('click', '.related .article', function(e) {
            $content.velocity('scroll');
            $(this).trigger('related-selected', window.app.museum.findArticleById($(this).data('id')));
        });
        
        $imageOverlay.on('click', function() {
            $imageOverlay.hide().css('background-image', '');
        });

        $(document).on('start-idle', function() {
            $('html').velocity('scroll', {offset: '0px', mobileHA: false });
            $scrollReminder.velocity({opacity: 1}, {display: 'block'});
        });
        
        $(document).on('stop-idle', function() {
            $scrollReminder.hide().css('opacity', 0);
        });
    }
}