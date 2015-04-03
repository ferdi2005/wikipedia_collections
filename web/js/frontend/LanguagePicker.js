function LanguagePicker(museum) {
    var $topBar = $('.topBar');
    var $button = $topBar.find('.languageButton');
    var $overlay = $('.languageOverlay');
    var $closeButton = $overlay.find('.close');
    var $languages = $overlay.find('.language');
    var $search = $overlay.find('.search');
    var $searchResults = $overlay.find('.searchResults');
    
    var open = false;
    var currentLanguage = museum.defaultLanguage;
    
    init();
    
    function init() {
        $overlay.hide();
        
        $button.on('click', toggle);
        $closeButton.on('click', toggle);
        $(document).on('touchstart', function(e) {
            if (!open) { return; }
            if ($(e.target).closest('.languageButton, .languageOverlay').length === 0) {
                toggle();
            }
        });
        
        $languages.eq(currentLanguage).addClass('active');
        $overlay.on('click', '.language', function() {
            pickLanguage($(this).data('language'));
            toggle();
        });
        
        $(document).on('start-idle', function() {
            pickLanguage(museum.defaultLanguage);
        });
        
        $search.on('keyup', function() {
            $searchResults.empty();
            var val = $search.val();
            if (!val) { return; }
            var count = 0;
            $.each(window.app.allLanguages, function(language, name) {
                if (count > 10) { return; }
                if (name.indexOf(val) != -1 || name.toLowerCase().indexOf(val.toLowerCase()) != -1) {
                    var $language = $languages.eq(0)
                        .clone()
                        .data('language', language)
                    ;
                    $language.find('img').remove();
                    $language.find('.label').text(name);
                    $searchResults.append($language);
                    count++;
                }
            });
        });
        
        pickLanguage(currentLanguage);
    }
    
    function toggle() {
        open = !open;
        $overlay.toggle();
    }
    
    function pickLanguage(language) {
        if (app.defaultLanguages[language]) {
            $button.css('background-image', 'url(' + Routing.getWebPath() + '/img/flags/' + language + '.png)');
        } else {
            $button.css('background-image', '').text(language);
        }
        $overlay.trigger('language-selected', language);
    }
    
}