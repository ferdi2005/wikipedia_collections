
$(function() {
    var $wrap = $('.articleBarWrap');
    var $bar = $wrap.find('.articleBar');
    var $content = $('.articleContent');

    var self = this;    
    var museum;
    var settings = {
        language: 'en',
    };
    var menu = new TocMenu();
    var articleControls = new ArticleControls();
    var articleBar = new ArticleBar();
    var loader = new Loader(menu);
    
    init();
    
    function init() {
        // Download article list
        $.ajax({
            url: Routing.generate('museum_articles'),
            success: function (data) {
                console.log(data);
                museum = data;
                
                // Test: duplicate articles
                for (var i = 0; i < 4; i++) {
                    data.articles.forEach(function(article) {
                        data.articles.push(article);
                    });
                }
                
                articleBar.init(loader, museum)
            },
            error: function(a,b,c) {
                console.log('Error getting data', a,b,c);
                $('body').empty().html('Er is iets mis gegaan bij het downloaden van de lijst met artikelen, we proberen het over 5 seconden opnieuw...');
                setTimeout(function() { document.location.reload(); }, 5000);
            }
        });

        // Set viewport meta tag
        $(window).on('resize', setMetaTag);
        setMetaTag();
        function setMetaTag() {
            $('meta#viewport').attr('content', 'width=' + $(window).width() + ', initial-scale=1');
        }
        
        FastClick.attach(document.body);
    }
});
