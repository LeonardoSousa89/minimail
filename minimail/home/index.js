const doc=document

const obj={
    name: doc.getElementById('name'),
    email: doc.getElementById('email'),
    sendbox: doc.getElementById('sendbox'),
    inbox: doc.getElementById('inbox'),
    send: doc.getElementById('send'),
    logout: doc.getElementById('logout'),
    url_logout: 'http://127.0.0.1:34568/signout',
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

obj.send.addEventListener('click', function(e){
    e.preventDefault()

    doc.location.href='../send/index.html'
})

obj.logout.addEventListener('click', function(e){
    e.preventDefault()

    fetch(obj.url_logout, 
        { method: 'POST', 
          headers: { 
            'Content-Type': 'application/json' 
        }
    }).then(response=>{

        if(response.status === 201){

            notAuthorized()
        }
        if(response.status !== 201){

            console.log("i'm sorry there's an error with server")
        }

    })

})

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

function cardHome(){

    const credentials=getUserCredentials()
    
    obj.name.append(credentials.client.client.name)
    obj.email.append(credentials.client.client.email)
}

cardHome()

