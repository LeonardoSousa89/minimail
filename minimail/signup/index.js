const doc=document

const obj={
    name: doc.getElementById('name'),
    email: doc.getElementById('email'),
    password: doc.getElementById('password'),
    send: doc.getElementById('send'),
    have_account: doc.getElementById('have_account'),
    alert_error: doc.getElementById('alert_error'),
    loading: doc.getElementById('loading'),
    url_signup: 'http://127.0.0.1:34568/signup'
}

obj.send.addEventListener('click', function(e){
    e.preventDefault()

    const data={
        name: obj.name.value,
        email: obj.email.value,
        password: obj.password.value
    }

    fetch(obj.url_signup,{
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json'}
    })
    .then(response=>{
        
        if(response.status === 201) {

            obj.loading.style='display: flex'
            doc.location.href='../index.html'
        }

        if(response.status != 201){
            response.json()
                    .then(response=>{
                        Object.keys(response).map(e=>{

                            obj.alert_error.style='display: flex'
                            obj.alert_error.append(response[e])

                            setInterval(function(){ 
                                doc.location.reload() 
                            },1200)
                })
            })
        }

    })
    .catch(_=>{
        obj.alert_error.style='display: flex'
        obj.alert_error.append("i'm sorry there's an error with server")

        setInterval(function(){ 
            doc.location.reload() 
        },1200)
    })

})

obj.have_account.addEventListener('click', function(e){
    e.preventDefault()

   doc.location.href='../index.html'
})