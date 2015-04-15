function ArticleExtras() {

    var $content = $('.articleContent');
    
    var $imageOverlay = $('.imageOverlay');
    var $imageImage = $imageOverlay.find('.image');
    var $imageExtras = $imageOverlay.find('.extras');
    var $imageArtist = $imageOverlay.find('.artist');
    var $imageCredit = $imageOverlay.find('.credit');
    var $imageLicence = $imageOverlay.find('.licence .value');
    var $imageSpinner = $imageOverlay.find('.spinner');
    
    var $scrollReminder = $('.scrollReminder');
    var currentLanguage = window.app.museum.defaultLanguage;

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
        
        $(document).on('language-selected', function(e, language) {
            currentLanguage = language;
        });
        
        $content.on('click', 'a', function(e) {
            e.preventDefault();
            var a = $(this);
            
            if (a.is('.image')) {
                $imageOverlay.show();
                $imageSpinner.show();
                
                var title = wikipedia.getTitleFromUrl(a.attr('href'));
                wikipedia.getImageInfo(currentLanguage, [title], 1536, 2048, function(data) {
                    var imgInfo = data[0].imageinfo[0];
                    
                    console.log(data);
                    console.log(imgInfo.thumburl);
                    console.log(imgInfo.extmetadata.Artist.value);
                    console.log(imgInfo.extmetadata.LicenseShortName.value);
                    
                    // Preload img
                    var img = new Image();
                    img.onload = function() {
                        $imageSpinner.hide();
                        $imageImage.css({
                            'background-image': 'url(' + imgInfo.thumburl + ')',
                            'bottom': $imageExtras.outerHeight(),
                        });
                    };
                    img.src = imgInfo.thumburl;
                    
                    $imageExtras.show();
                    
                    if (imgInfo.extmetadata.Artist) {
                        $imageArtist.html($(imgInfo.extmetadata.Artist.value).text());
                    } else {
                        $imageArtist.html('');
                    }
                    if (imgInfo.extmetadata.Credit) {
                        $imageCredit.html(
                            ($imageArtist.text() ? ' - ' : '') + $(imgInfo.extmetadata.Credit.value).text()
                        );
                    } else {
                        $imageCredit.html('');
                    }
                    if (imgInfo.extmetadata.LicenseShortName) {
                        $imageLicence.html(imgInfo.extmetadata.LicenseShortName.value);
                    } else {
                        $imageLicence.html('');
                    }
                }, function() {
                    $imageOverlay.hide();
                });
                
                a.trigger('image-opened', [title]);
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
            $imageOverlay.hide();
            $imageImage.css('background-image', '');
            $imageExtras.hide();
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