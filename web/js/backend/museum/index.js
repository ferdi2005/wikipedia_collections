$(function() {
    var $form = $('form');
    var $submitBtn = $form.find('button[type=submit]');
    var $articles = $('.articles');
    var $previews = $('.articlePreviews');
    var $searchBar = $('.searchBar');
    var $search = $searchBar.find('#search');
    var $searchLang = $searchBar.find('#searchLang');
    var $searchBtn = $searchBar.find('button');
    var $searchResults = $searchBar.find('.searchResults').hide();
    var searchTimeout;
    
    var languages = [
        { code: 'nl', label: 'Nederlands' },
        { code: 'en', label: 'Engels' },
        { code: 'de', label: 'Duits' },
    ];
    
    // $articles.hide();
    
    init();
    
    function init() {
        $searchBar.insertAfter($articles);
        $previews.insertAfter($articles);
        
        languages.forEach(function(lang) {
            $('<option />').attr('value', lang.code).text(lang.label + 'e Wikipedia').appendTo($searchLang);
        });
        
        $searchBtn.on('click', search);
        $search.on('keyup', function() {
            if ($search.val().length > 4) {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(search, 400);
            } else {
                $searchResults.hide();
            }
        });
        
        $previews.on('click', '.btn.remove', function() {
            var preview = $(this).closest('.articlePreview');
            var form = preview.data('form');
            window.articles.splice(form.index());
            form.remove();
            preview.remove();
            updatePositions();
        });
        
        $previews.on('click', '.btn.up', function() {
            var preview = $(this).closest('.articlePreview');
            preview.insertBefore(preview.prev());
            updatePositions();
        });
        
        $previews.on('click', '.btn.down', function() {
            var preview = $(this).closest('.articlePreview');
            console.log(preview);
            preview.insertAfter(preview.next());
            updatePositions();
        });
        
        showArticles();
        updatePositions();
        
        if (localStorage.debug) { 
            // $search.val('Schoonhoven').trigger('keyup'); 
            // addArticle('nl', 'Schoonhoven');
        }
    }
    
    function updatePositions() {
        $previews.children().each(function(i) {
            $(this).data('form').find('[id$=position]').val(i + 1);
        });
    }
    
    function search() {
        wikipedia.search($searchLang.val(), $search.val(), 
            showSearchResult,
            function() {
                alert('Er is een fout opgetreden bij het doorzoeken van wikipedia.');
            }
        );
    }
    
    function showSearchResult(language, data) {
        $searchResults.empty().show();
        data.query.search.forEach(function(result) {
            var $result = $('#searchResult-tpl').twig({language: language, result: result}).appendTo($searchResults);
            $result.find('button.add').on('click', function(e) {
                e.preventDefault();
                $searchResults.hide().empty();
                addArticle(language, result.title);
            });
        });
    }
    
    function addArticle(language, title) {
        $submitBtn.attr('disabled', 'disabled');
        $article = Form.clonePrototype($articles, $articles);
        
        wikipedia.getArticle(language, title, 
            function(language, article) {
                $submitBtn.removeAttr('disabled');
                
                $article.find('[id$=plainContent]').val(article.plainContent);
                $article.find('[id$=pageId]').val(article.pageId);
                $article.find('[id$=title]').val(article.title);
                $article.find('[id$=language]').val(article.language);
                
                window.articles.push(article);
                showArticle(article);
                
                updatePositions();
            }, 
            function() {
                $submitBtn.removeAttr('disabled');
                $article.remove();
                alert('Er is een fout opgetreden bij het toevoegen van het artikel.');
            }
        );
    }
    
    function showArticles() {
        $articles.children().each(function() {
            var $form = $(this);
            showArticle(window.articles[$form.index()]);
        });
    }
    
    function showArticle(article) {
        $('#articlePreview-tpl')
            .twig({ article: article })
            .appendTo($previews)
            .data('form', $form)
        ;
    }
    
})