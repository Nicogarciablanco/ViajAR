$(document).ready(function (){
    $window = $(window);
    $('#intro').height($window.height());
    $window.scroll(function (){
        $('div.background').each(function (index, item) {
            var $scroll = $(item);
            var ypos = -($window.scrollTop() / $scroll.data('speed'));
            var coords = '50%' + ypos + 'px';
            $scroll.css({ backgroundPosition: coords });
        });
    });
});