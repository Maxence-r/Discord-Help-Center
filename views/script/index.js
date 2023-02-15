let GSvideos = ['https://www.youtube.com/embed/hVF2rc_F64s', 'https://www.youtube.com/embed/UaIpOTVTDEs', 'https://www.youtube.com/embed/WXIk5gXV5FY', 'https://www.youtube.com/embed/9BaVBpUhJPw', 'https://www.youtube.com/embed/DS813fca36I', 'https://www.youtube.com/embed/nmxcjAuM4Us', 'https://www.youtube.com/embed/6TMgSfpZcSY']
if (!localStorage.getItem('progress')) localStorage.setItem('progress', 0)


function refresh() {
    document.querySelectorAll('.step').forEach(function (step, index) {
        if (index == localStorage.getItem('progress')) {
            step.classList.add('active')
        } else {
            step.classList.remove('active')
        }
        if (index < localStorage.getItem('progress')) {
            step.classList.add('done')
        } else {
            console.log('index')
            step.classList.remove('done')
        }
    })
}

document.querySelectorAll('.step').forEach(function (step, index) {
    step.addEventListener('click', function (e) {
        localStorage.setItem('progress', index)
        getActual()
    })
})

function getActual() {
    document.getElementById('get-started-id').src = GSvideos[localStorage.getItem('progress')]
    refresh()
}

document.querySelector('.tuto-continue').addEventListener('click', function () {
    if (localStorage.getItem('progress') < GSvideos.length - 1) {
        localStorage.setItem('progress', parseInt(localStorage.getItem('progress')) + 1)
        getActual()
    }
})


function toggleGetStarted() {
    getActual()
    document.querySelector('.get-started-popup').classList.toggle('open-modal')
}

let Boolean = false
function toggleLateral() {
    Boolean = !Boolean
    let angle = Boolean ? 180 : 0
    console.log(angle)
    document.querySelector('.open-icon').style.transform = `rotate(${angle}deg)`;
    document.querySelector('.lateral-menu').classList.toggle('open-lateral')
}


    
