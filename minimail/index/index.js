const doc=document

const obj={
    email: doc.getElementById('email'),
    password: doc.getElementById('password'),
    login: doc.getElementById('login'),
    dont_have_account: doc.getElementById('dont_have_account'),
    alert_error: doc.getElementById('alert_error'),
    loading: doc.getElementById('loading'),
    url_login: 'http://170.84.38.173:34568/login'
}

obj.login.addEventListener('click', function(e){
    e.preventDefault()

    const data={
        email: obj.email.value,
        password: obj.password.value
    }

    fetch(obj.url_login,{
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json'}
    })
    .then(response=>{
        
        if(response.status === 200) {

            response.json()
                    .then(response=>{
                        
                        const data={
                            client: response.client,
                            auth: response.auth,
                            token: response.token
                        }

                        localStorage.setItem('data', JSON.stringify(data))
                        
                        obj.loading.style='display: flex'
                        doc.location.href='./home/index.html'
                    })
        }

        if(response.status != 200){
            response.json()
                    .then(response=>{
                        const erro=Object.keys(response).map(e=>{

                            obj.alert_error.style='display: flex'
                            obj.alert_error.append(response[e])

                            setInterval(function(){ 
                                doc.location.reload() 
                            },1200)
                })
            })
        }

    })
    .catch(e=>console.log(e))

})

obj.dont_have_account.addEventListener('click', function(e){
    e.preventDefault()

   doc.location.href='./signup/index.html'
})


