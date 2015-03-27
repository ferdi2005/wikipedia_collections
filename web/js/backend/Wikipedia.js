function Wikipedia() {
    
    function search(language, query, success, error) {
        executeQuery(language, {
            action: 'query',
            list: 'search',
            format: 'json',
            srsearch: query,
            srprop: 'snippet|titlesnippet',
            srlimit: '10',
            indexpageids: true,
            redirects: true,
        }, success, error);
    }
    
    function getArticle(language, title, success, error) {
        executeQuery(language, {
            action: 'query',
            prop: 'revisions',
            format: 'json',
            rvprop: 'content',
            rvparse: 'rvparse',
            titles: title,
        }, function(language, data) {
            var page = data.query.pages[Object.keys(data.query.pages)[0]];
            var article = {
                title: page.title,
                pageId: page.pageid,
                language: language,
            };
            
            article.plainContent = $('<div>' + page.revisions[0]['*'] + '</div>')
                .text()
                .replace(/\t/g, ' ')
                .replace(/ +/g, ' ')
                .replace(/\n( )+\n/g, '\n')
                .replace(/\n+/g, '\n')
            ;
            
            success(language, article);
        }, error);
    }
    
    function getImages(language, title, success, error) {
        executeQuery(language, {
            action: 'query',
            prop: 'images',
            format: 'json',
            titles: title,
        }, success, error);
    }
    
    function executeQuery(language, data, success, error) {
        data['continue'] = data['continue'] || '';
        
        $.ajax({
            url: 'http://' + language + '.wikipedia.org/w/api.php',
            dataType: 'jsonp',
            cache: true,
            data: data,
            success: function(data) {
                success(language, data);
            },
            error: error
        });
    }
    
    this.search = search;
    this.getArticle = getArticle;
}

window.wikipedia = new Wikipedia();