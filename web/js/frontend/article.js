function ArticleControls() {
    
    var $content = $('.articleContent');
    
    init();
    
    function init() {
        $content.on('click', '.articleHeader .showFullscreen', function() {
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
    }
}