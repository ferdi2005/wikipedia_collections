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
    
    museum.findArticleById = function(id) {
        var result = null;
        museum.articles.forEach(function(article) {
            if (article.id == id) { result = article; }
            article.translations.forEach(function(translation) {
                if (translation.id == id) { result = translation; }
            });
        });
        return result;
    }
    
    function getTranslation(language) {
        if (this.language == language) { return this; }
        for (var i = 0; i < this.translations.length; i++) {
            if (this.translations[i].language == language) { return this.translations[i]; }
        }
        if (this.translationOf) {
            if (this.translationOf.language == language) {
                return this.translationOf;
            }
            for (var i = 0; i < this.translationOf.translations.length; i++) {
                if (this.translationOf.translations[i].language == language) { return this.translationOf.translations[i]; }
            }
        }
        return null;
    }
    
    function isTranslationOf(article) {
        if (this == article) { return true; }
        for (var i = 0; i < this.translations.length; i++) {
            if (this.translations[i] == article) { return true }
        }
        if (this.translationOf) {
            if (this.translationOf == article) { return true; }
            for (var i = 0; i < this.translationOf.translations.length; i++) {
                console.log(article);
                if (this.translationOf.translations[i] == article) { return true; }
            }
        }
        return false;
    }
    
    museum.articles.forEach(function(article) {
        article.getTranslation = getTranslation;
        article.isTranslationOf = isTranslationOf;
        
        article.translations.forEach(function(translation) {
            translation.translationOf = article;
            translation.getTranslation = getTranslation;
            translation.isTranslationOf = isTranslationOf;
        });
    });
    
    return museum;
}