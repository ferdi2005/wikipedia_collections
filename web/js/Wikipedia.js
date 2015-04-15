function Wikipedia() {
    
    /* Public API: */
    this.search = search;
    this.getArticle = getArticle;
    this.getImages = getImages;
    this.getDefaultThumbs = getDefaultThumbs;
    this.getThumbs = getThumbs;
    this.getTitleFromUrl = getTitleFromUrl;
    this.cleanImageTitle = cleanImageTitle;
    this.getLangLinks = getLangLinks;
    this.getImageInfo = getImageInfo;
    this.allLanguages = window.app ? window.app.allLanguages : [];
    
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
    
    function getLangLinks(language, title, success, error) {
        executeQuery(language, {
            action: 'query',
            prop: 'langlinks',
            format: 'json',
            titles: title,
            lllimit: 200,
        }, function(language, data) {
            var page = data.query.pages[Object.keys(data.query.pages)[0]];
            success(language, page.langlinks);
        }, error);
    }
    
    function getArticle(language, title, success, error, complete) {
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
        }, error, complete);
    }
    
    function getImages(language, title, success, error) {
        executeQuery(language, {
            action: 'query',
            prop: 'images',
            format: 'json',
            imlimit: 200,
            titles: title,
        }, function(language, data) {
            var page = data.query.pages[Object.keys(data.query.pages)[0]];
            var images = page.images;
            images.forEach(function(img) {
                img.cleanedTitle = cleanImageTitle(img.title);
            });
            success(language, images);
        }, error);
    }
    
    function getTitleFromUrl(url) {
        return url.replace('/wiki/', '');
    }
    
    /* Translate image page title to english to work on commons.wikipedia. */
    function cleanImageTitle(title) {
        var cleanedTitle = title;
        var index = cleanedTitle.indexOf(':');
        if (index !== -1) {
            cleanedTitle = 'File' + cleanedTitle.substr(index);
        }
        return cleanedTitle;
    }
    
    /* Get thumbs in two default sizes */
    function getDefaultThumbs(titles, callback) {
        var count = 0;
        var result = {};
        
        [
            {size: 'small', pithumbsize: '512x512'}, 
            {size: 'large', pithumbsize: '1536x2048'}, 
        ].forEach(function(params) {
            executeQuery('commons', {
                action: 'query',
                prop: 'pageimages',
                format: 'json',
                piprop: 'thumbnail',
                pilimit: 200,
                pithumbsize: params.pithumbsize,
                titles: titles.join('|'),
            }, function(language, data) {
                count++;
                
                $.each(data.query.pages, function(i, page) {
                    if (!result[page.title]) {
                        result[page.title] = { title: page.title };
                    }
                    result[page.title]['image_' + params.size] = page.thumbnail.source;
                });
                
                if (count == 2) { callback(result); }
            }, function() {
                count++;
                
                if (count == 2) { callback(result); }
            });
        });
    }
    
    function getThumbs(titles, thumbSize, success, error) {
        titles = titles.map(cleanImageTitle);
        executeQuery('commons', {
            action: 'query',
            prop: 'pageimages',
            format: 'json',
            piprop: 'thumbnail',
            pilimit: 200,
            pithumbsize: thumbSize,
            titles: titles.join('|'),
        }, function(language, data) {
            var result = [];
            
            $.each(data.query.pages, function(i, page) {
                result.push({ 
                    title: page.title,
                    image: page.thumbnail.source
                });
            });
            
            success(result);
        }, error);
    }
    
    function getImageInfo(language, titles, thumbWidth, thumbHeight, success, error) {
        executeQuery(language, {
            action: 'query',
            prop: 'imageinfo',
            format: 'json',
            iiprop: 'extmetadata|url',
            iiurlwidth: thumbWidth,
            iiurlheight: thumbHeight,
            titles: titles.join('|'),
        }, function(language, data) {
            console.log(data);
            success($.map(data.query.pages, function(val, key) { return val; }));
        }, error);
    }
    
    function executeQuery(language, data, success, error, complete) {
        data['continue'] = data['continue'] || '';
        
        $.ajax({
            url: 'http://' + language + '.wikipedia.org/w/api.php',
            dataType: 'jsonp',
            cache: true,
            data: data,
            success: function(data) {
                success(language, data);
            },
            error: error,
            complete: complete
        });
    }
}

window.wikipedia = new Wikipedia();