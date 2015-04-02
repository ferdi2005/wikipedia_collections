function TextSize() {
    var $topBar = $('.topBar');
    var $button = $topBar.find('.textSizeButton');
    var $overlay = $('.textSizeOverlay');
    var $sizes = $overlay.find('.size');
    var $closeButton = $overlay.find('.close');
    var $html = $('html');
    
    var open = false;
    var currentSize = 0;
    var fontSizes = [10,14,18];
    
    init();
    
    function init() {
        $overlay.hide();
        
        $button.on('click', toggle);
        $closeButton.on('click', toggle);
        $(document).on('touchstart', function(e) {
            if (!open) { return; }
            if ($(e.target).closest('.textSizeButton, .textSizeOverlay').length === 0) {
                toggle();
            }
        });
        
        $sizes.eq(currentSize).addClass('active');
        $sizes.on('click', function() {
            setSize($(this).index());
            toggle();
        });
        
        $(document).on('start-idle', function() {
            setSize(0);
        });
    }
    
    function toggle() {
        open = !open;
        $overlay.toggle();
    }
    
    function setSize(index) {
        currentSize = index;
        $sizes.removeClass('active').eq(currentSize).addClass('active');
        $html.css('font-size', fontSizes[currentSize]);
    }
}