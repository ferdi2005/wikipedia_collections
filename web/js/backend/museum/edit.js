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

    $articles.hide();

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
            var form = preview.data('articleForm');
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

        $previews.on('click', '.btn.pickImage', function() {
            var preview = $(this).closest('.articlePreview');
            var img = preview.find('img');
            var article = preview.data('article');

            var $articleForm = preview.data('articleForm');
            var imageTitle = $articleForm.find('[id$=imageTitle]');
            var smallImage = $articleForm.find('[id$=smallImage]');
            var largeImage = $articleForm.find('[id$=largeImage]');

            wikiImagePicker(article.language, article.title, function(imgData) {
                if (imgData) {
                    img.attr('src', imgData.image_small);
                    imageTitle.val(imgData.title);
                    smallImage.val(imgData.image_small);
                    largeImage.val(imgData.image_large);
                }
            });
        });

        showArticles();
        updatePositions();

        if (localStorage.debug) {
            // $search.val('Schoonhoven').trigger('keyup');
            // addArticle('nl', 'Doopvont');
            // $previews.find('.pickImage').eq(0).trigger('click');
        }
    }

    function updatePositions() {
        $previews.children().each(function(i) {
            $(this).data('articleForm').find('[id$=position]').val(i + 1);
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
        var articleTitle = Date.now();
        var $article = Form.clonePrototype($articles, $articles, [articleTitle]);
        var $translations = $article.find('.translations');

        $submitBtn.attr('disabled', 'disabled');
        
        wikipedia.getArticle(language, title,
            function(language, article) {
                fillForm($article, article);

                window.articles.push(article);
                showArticle(article, $article);

                updatePositions();
                
                $submitBtn.removeAttr('disabled');
            },
            function() {
                $submitBtn.removeAttr('disabled');
                $article.remove();
                alert('Er is een fout opgetreden bij het toevoegen van het artikel.');
            }
        );
    }

    function fillForm($article, article) {
        $article.find('[id$=plainContent]').val(article.plainContent);
        $article.find('[id$=pageId]').val(article.pageId);
        $article.find('[id$=title]').val(article.title);
        $article.find('[id$=language]').val(article.language);
    }

    function showArticles() {
        $articles.children().each(function() {
            var $articleForm = $(this);
            showArticle(window.articles[$articleForm.index()], $articleForm);
        });
    }

    function showArticle(article, $articleForm) {
        $('#articlePreview-tpl')
            .twig({ article: article })
            .appendTo($previews)
            .data('article', article)
            .data('articleForm', $articleForm)
        ;
    }

})