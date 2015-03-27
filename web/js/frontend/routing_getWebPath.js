Routing.getWebPath = function() {
    var url = Routing.getBaseUrl();
    if (url.indexOf('.php') !== -1) {
        parts = url.split('/');
        parts.pop();
        url = parts.join('/');
    }
    return url;
}