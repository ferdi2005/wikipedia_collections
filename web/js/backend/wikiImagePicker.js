function wikiImagePicker(language, title, callback) {
    var modal = $('<div class="fwModal wikiImagePicker" />').appendTo('body').hide().fwModal({
        closed: function() {
            modal.remove();
        }
    });
    
    modal.on('click', 'img', function() {
        var $img = $(this);
        var img = $img.data('img');
        modal.fwModal();
        callback(img);
    });
    
    wikipedia.getImages(language, title, function(language, images) {
        wikipedia.getThumbs(images.map(function(i) { return i.cleanedTitle; }), function(imgs) {
            $.each(imgs, function(_, img) {
                if (!img.image_small) { return; }
                
                $img = $('<img />')
                    .attr('src', img.image_small)
                    .data('img', img)
                    .appendTo(modal)
                ;
            });
        });
        // callback(result);
    }, function() {
        modal.fwModal();
        alert('Er is iets fout gegaan bij het ophalen van de afbeeldingenlijst');
        callback(null);
    });
}