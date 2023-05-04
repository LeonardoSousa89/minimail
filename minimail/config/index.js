const doc=document

const obj={
    url_client: (id)=>`http://127.0.0.1:34568/user/${id}`
}

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

function getClientId(){
    const id=localStorage.getItem('client_id')
    alert(id)
}

getClientId()