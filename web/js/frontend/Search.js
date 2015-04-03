function Search(museum) {
    var $topBar = $('.topBar');
    var $button = $topBar.find('.searchButton');
    var $overlay = $('.searchOverlay');
    var $closeButton = $overlay.find('.close');
    var $input = $overlay.find('.search');
    var $searchResults = $overlay.find('.searchResults');
    var $h5 = $overlay.find('> h5');
    
    var open = false;
    var timeout;
    var currentLanguage = museum.defaultLanguage;
    
    init();
    
    function init() {
        $overlay.hide();
        
        $button.on('click', toggle);
        $closeButton.on('click', toggle);
        $(document).on('touchstart', function(e) {
            if (!open) { return; }
            if ($(e.target).closest('.searchButton, .searchOverlay').length === 0) {
                toggle();
            }
        });
        
        $(document).on('start-idle', function() {
            if (open) { toggle(); }
        });
        
        $(document).on('language-selected', function(e, language) {
            currentLanguage = language;
        });
        
        $input.on('keyup', function() {
            var query = $input.val();
            if (!query) { 
                $searchResults.empty();
                $h5.css('visibility', 'hidden');
                return; 
            }
            clearTimeout(timeout);
            timeout = setTimeout(search, 300);
        });
    }
    
    function search() {
        var query = $input.val();
        if (query.length <= 3) { return; }
        
        $.ajax({
            url: Routing.generate('article_search', {museumId: museum.id, language: currentLanguage, query: query}),
            success: function(articleIds) {
                $searchResults.empty();
                $h5.css('visibility', 'visible').find('.numResults').text(articleIds.length);
                
                articleIds.forEach(function(id) {
                    var article = museum.findArticleById(id);
                    if (!article) { return; }
                    
                    $overlay.find('.articleExample')
                        .clone()
                        .removeClass('articleExample')
                        .addClass('article')
                        .find('.img').css('background-image', 'url(' + article.smallImage + ')').end()
                        .find('.label').text(article.title).end()
                        .show()
                        .on('click', function() {
                            $(this).trigger('search-result-selected', article);
                            toggle();
                            $searchResults.empty();
                        })
                        .appendTo($searchResults)
                    ;
                })
            },
            error: function() {
                console.log('Error searching');
            }
        });
    }
    
    function toggle() {
        open = !open;
        $overlay.toggle();
        $button.toggleClass('active');
        if (open) {
            $(window).scrollTop(0);
            $overlay.css('min-height', $(document).height());
            $input.val('').focus();
            $searchResults.empty();
            $h5.css('visibility', 'hidden');
        } else {
            $input.blur();
        }
    }
    
}