const doc=document

const obj={
    send: doc.querySelector('.send'),
    sendbox: doc.querySelector('.sendbox'),
    inbox: doc.querySelector('.inbox'),
    home: doc.querySelector('.home'),
    sender: doc.querySelector('#sender'),
    mail_destination: doc.querySelector('#mail_destination'),
    topic: doc.querySelector('#topic'),
    mail_msg: doc.querySelector('#mail_msg'),
    btn: doc.querySelector('.btn'),
    alert_error: doc.querySelector('#alert_error'),
    Url_sendMail: (id)=> `http://127.0.0.1:34568/send/user/${id}`,
    url_client: (id)=>`http://127.0.0.1:34568/user/${id}`
}

obj.sendbox.addEventListener('click', function(e){
    e.preventDefault()

    doc.location.href='../sendbox/index.html'
})

obj.inbox.addEventListener('click', function(e){
    e.preventDefault()

    doc.location.href='../inbox/index.html'
})

obj.home.addEventListener('click', function(e){
    e.preventDefault()

    doc.location.href='../home/index.html'
})

obj.btn.addEventListener('click', function(e){
    e.preventDefault()

   const url=obj.Url_sendMail(getUserCredentials().client.client.id)
        
   const data={
        mail_destination: obj.mail_destination.value,
        topic: obj.topic.value,
        mail_msg: obj.mail_msg.value,
        sender: obj.sender.value
   }

   fetch(url,{
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${getUserCredentials().client.token}`
        }
   })
   .then(response=>{

        if(response.status === 201){
            doc.location.href='../sendbox/index.html'
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

function senderInput(){
    const sender=getUserCredentials()

    obj.sender.value=sender.client.client.email
}

senderInput()

function verifyRoute(){
    const data=localStorage.getItem('data')

    if(!data){
        notAuthorized()
    }
}

verifyRoute()

/*
 a cada 0.5 minuto ele envia requisição para api verificando se
 o token ainda é válido, se não for ele limpa o localstorage e
 redireciona o usuário para a página de login.  

 milisegundos: https://www.google.com/search?q=1+minuto+s%C3%A3o+quantos+msegundosili&rlz=1C1ISCS_pt-BRBR1055BR1055&oq=1+minuto+s%C3%A3o+quantos+msegundosili&aqs=chrome..69i57j33i10i160l2.10667j0j15&sourceid=chrome&ie=UTF-8
*/
function verifyToken(){
    
    const credentials=getUserCredentials()
    const token=credentials.client.token
    
    setInterval(function(){
        const url=obj.url_client(credentials.client.client.id)

        fetch(url,{
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response=>{

            if(response.status != 200){
                response.json()
                .then(response=>{
                    Object.keys(response).map(e=>{
                        if(response[e] === 'token invalid'){
                            
                            notAuthorized()
                        }

                    }) 
                })
            }

            if(response.status === 200){
                monitor('verifying token: token is valid...')
            }

        })
    },30000)
}

verifyToken()

function cleanStorage(){

    localStorage.removeItem('data')
    localStorage.removeItem('client_id')
}

function notAuthorized(){

    cleanStorage()
    doc.location.href='../index.html'
}

function getUserCredentials(){
    const credentials=localStorage.getItem('data')
    const client=JSON.parse(credentials)

    return { client: client }
}

function monitor(msg){
    console.log(msg)
}





