function Loader(menu) {
    var $wrap = $('.articleBarWrap');
    var $bar = $wrap.find('.articleBar');
    var $content = $('.articleContent');
    var $spinner = $('.articleSpinner');
    var currentArticle;
    var currentLanguage;
    
    init();
    
    function init() {
        $(document).on('article-selected', function(e, article) {
            if (article) {
                render(article);
                currentArticle = article;
            } else {
                renderNotAvailable(currentLanguage);
            }
        });
        $(document).on('language-selected', function(e, language) {
            currentLanguage = language;
            
            if (currentArticle) {
                var translation = currentArticle.getTranslation(language);
                if (translation) {
                    currentArticle = translation;
                    render(translation);
                } else {
                    renderNotAvailable(language);
                }
            }
        });
    }
    
    function render(article) {
        $spinner.css('opacity', 0);
        $content.velocity({ opacity: 0 }, function() {
            $spinner.velocity({ opacity: 1 });
        });
        
        loadArticle(article, function(html) {
            $content.promise().done(function() {
                var $article = $(html);
                $content.empty().append($article);
                cleanArticle($content);
                addExtras(article, $content);
                $content.velocity({ opacity: 1 });
                menu.extractToc(article, $content);
                
                $spinner.velocity('stop').velocity({ opacity: 0 });
            });
        });
    }
    
    function renderNotAvailable(languages) {
        $content.empty().append('<h1>Unfortunately, this article isn\'t available in your language</h1>');
        $spinner.css('opacity', 0);
    }
    
    function loadArticle(article, callback) {
        var result = null;
        $.ajax({
            url: 'https://' + article.language + '.wikipedia.org/w/api.php',
            dataType: 'jsonp',
            cache: true,
            data: {
                action: 'query',
                prop: 'revisions',
                format: 'json',
                rvprop: 'content',
                rvparse: 'rvparse',
                'continue': '',
                titles: article.title,
            },
            success: function(data) {
                $.each(data.query.pages, function(pageId, page) {
                    result = page.revisions[0]['*'];
                });
                callback(result);
            },
            error: function(a,b,c) {
                console.log('error retrieving article', a,b,c);
                callback(null);
            }
        });
    }
    
    function cleanArticle($article) {
        /* Infobox: Set extra classes based on inline style */
        $article.find('.infobox th[style*="background-color"]').addClass('header');
        $article.find('.infobox td[style*="background-color"]').addClass('header');
        $article.find('.infobox td[style*="font-size"]').addClass('subscript');
        $article.find('.infobox img').each(function() {
            var img = $(this);
            if (img.attr('width') > 200) {
                img.addClass('fullWidth');
            }
        });
        
        /* Remove "External links" section */
        ['#External_links', '#Externe_links', '#Externe_link'].forEach(function(externalLinks) {
            var a = $article.find(externalLinks);
            if (!a.length) { return; }
            var index = a.closest('h2').index();
            $article.children().slice(index).remove();
            $('#toc').find('a[href="' + externalLinks + '"]').closest('li').remove()
        });
        
        /* Remove "part of a series" box */
        ['deel van de serie over', 'Deel van de serie over'].forEach(function(text) {
            $article
                .find('table.toccolours')
                .find('small:contains(' + text + ')')
                .closest('table.toccolours')
                .remove()
            ;
        });
        
        /* 
            Make thumb box as wide as the image. 
            Make large thumbs full screen width.
        */
        $article.find('.thumb img').each(function() {
            var img = $(this);
            var imgWidth = img.attr('width');
            var target = img;
            
            if (!imgWidth) { return; }
            if (img.closest('.gallery').length) { return; }
            if (imgWidth > 450) {
                img.closest('.thumb').addClass('fullScreen');
                return;
            }
            
            var count = 0;
            do {
                target = target.parent();
                if (target.is('[style*=width]')) {
                    target.css('width', imgWidth);
                    return;
                }
                count++;
            } while (!target.is('.thumb') && count < 10)
        });
        
        /* Remove audio recording of article */
        $article.find('audio').closest('.plainlinks').remove();
            
    }
    
    function addExtras(article, $article) {
        $article.prepend($('#articleHeader-tpl').twig({article: article}));
        $article.append($('#related-tpl').twig({article: article}));
    }
    
    this.render = render;
}