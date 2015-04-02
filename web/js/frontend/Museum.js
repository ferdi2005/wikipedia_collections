function Museum(museum) {
    // Make {language: article map}
    museum.articles.forEach(function(article) {
        article.lang2article = {};
        article.translations.forEach(function(translation) {
            article.lang2article[translation.language] = translation;
        });
        article.lang2article[article.language] = article;
    });
    museum.getArticles = function(language) {
        var result = [];
        this.articles.forEach(function(article) {
            var translation = article.lang2article[language];
            if (translation) {
                result.push(translation);
            }
        });
        return result;
    }
    return museum;
}