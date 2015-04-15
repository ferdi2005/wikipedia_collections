function Tracker() {
    var tracker = Piwik.getTracker('http://analytics.frontwise.com/piwik.php', 3);
    var idling = false;
    var currentArticle;
    
    $(document).on('start-idle', function() {
        idling = true;
    });
    
    $(document).on('stop-idle', function() {
        idling = false;
    });
    
    $(document).on('article-selected', function(e, article) {
        track('/show_article/' + article.language + '/' + article.title, article.title);
        currentArticle = article;
    });
    
    $(document).on('related-selected', function(e, article) {
        track('/show_related/' + article.language + '/' + article.title, article.title);
    });
    
    $(document).on('open-toc', function(e) {
        track('/open-toc/' + currentArticle.language + '/' + currentArticle.title, currentArticle.title);
    });
    
    $(document).on('returntotop-toc', function(e) {
        track('/return_to_top/toc', 'Return to top');
    });
    
    $(document).on('returntotop-article', function(e) {
        track('/return_to_top/article_bottom', 'Return to top');
    });
    
    $(document).on('language-selected', function(e, language) {
        track('/switch_language/' + language, window.app.allLanguages[language]);
    });
    
    $(document).on('image-opened', function(e, title) {
        track('/open_image/' + currentArticle.language + '/' + title, 'Open image');
    });
    
    $(document).on('search-result-selected', function(e, article, query) {
        track('/search?s=' + query, 'search');
    });
    
    $(document).on('textsize-selected', function(e, size) {
        track('/change_textsize/' + labels[size], 'Change text size');
    });
    
    function track(actionUrl, title) {
        if (idling) { return; }
        tracker.setCustomUrl('/' + window.app.museum.name + actionUrl);
        tracker.trackPageView(title);
    }
}