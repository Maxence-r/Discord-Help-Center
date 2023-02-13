document.querySelectorAll('.elements > li').forEach(function (li) {
    li.addEventListener('click', function (e) {
        let diff = document.querySelector('.selector').offsetLeft;
        const position = li.getBoundingClientRect();
        document.querySelector('.selector-active').style.width = (li.offsetWidth + 40) + 'px';
        document.querySelector('.selector-active').style.transform = 'translateX(' + (position.left - diff - 20) + 'px)';
    });
});
