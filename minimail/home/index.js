const doc=document

const obj={
    name: doc.getElementById('name'),
    email: doc.getElementById('email'),
    sendbox: doc.getElementById('sendbox'),
    inbox: doc.getElementById('inbox'),
    logout: doc.getElementById('logout'),
    url_logout: 'http://127.0.0.1:34568/signout'
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

//a fazer
function verifyToken(){}

function getUserCredentials(){
    const credentials=localStorage.getItem('data')
    const client=JSON.parse(credentials)

    obj.name.append(client.client.name)
    obj.email.append(client.client.email)
}

getUserCredentials()
