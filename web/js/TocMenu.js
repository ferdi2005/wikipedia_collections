function TocMenu($menu) {
    
    var items = [];
    var data;
    
    
    function extractToc(articleData, $article) {
        data = articleData;
        $menu.empty();
        
        var toc = $article.find('#toc');
        if (!toc.length) { return; }
        toc.detach().appendTo($menu);
        
        $('<h2 class="articleTitle" />').text(data.humanTitle).insertAfter($menu.find('#toctitle'));
    }
    
    function findHeaderPositions() {
        
    }
    
    return {
        extractToc: extractToc,
        findHeaderPositions: findHeaderPositions,
    };
}