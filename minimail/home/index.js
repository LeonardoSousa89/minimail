const doc=document

const obj={
    logout: doc.getElementById('logout'),
    url_logout: ''
}

obj.logout.addEventListener('click', function(e){
    e.preventDefault()

    doc.location.href='../index.html'
})