const doc=document

const obj={
    name: doc.getElementById('name'),
    email: doc.getElementById('email'),
    sendbox: doc.getElementById('sendbox'),
    inbox: doc.getElementById('inbox'),
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

obj.logout.addEventListener('click', function(e){
    e.preventDefault()

    fetch(obj.url_logout, 
        { method: 'POST', 
          headers: { 
            'Content-Type': 'application/json' 
        }
    }).then(response=>{

        if(response.status === 201){

            localStorage.removeItem('data')
            doc.location.href='../index.html'
        }
        if(response.status !== 201){

            alert("i'm sorry there's an error with server")
        }

    })

})

function verifyRoute(){
    const data=localStorage.getItem('data')

    if(!data){
        doc.location.href='../index.html'
    }
}

/*
 a cada 1 minuto ele envia requisição para api verificando se
 o token ainda é válido, se não for ele limpa o localstorage.  
*/
function verifyToken(){
    
    const credentials=getUserCredentials()

    
    setInterval(function(){
        const url=obj.url_client(credentials.id)

        fetch(url,{
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
    },60000)
    
    let token=false
    
    setInterval(function(){
        if(token){

            cleanStorage()
        }else{

            console.log('verificando...')
        }
    },60000)
}

verifyToken()

function cleanStorage(){

    localStorage.removeItem('data')
}

function getUserCredentials(){
    const credentials=localStorage.getItem('data')
    const client=JSON.parse(credentials)

    return { client }
}

function cardHome(){

    const credentials=getUserCredentials()
    
    obj.name.append(credentials.name)
    obj.email.append(credentials.email)
}

cardHome()

