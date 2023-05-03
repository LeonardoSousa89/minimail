const doc=document

const obj={
    sendbox: doc.querySelector('.sendbox'),
    inbox: doc.querySelector('.inbox'),
    home: doc.querySelector('.home'),
    Url_sendedMail: (id, senderEmail, size, page)=> `http://127.0.0.1:34568/sendbox/${id}/user?sender=${senderEmail}&size=${size}&page=${page}`
}

obj.inbox.addEventListener('click', function(e){
    e.preventDefault()

    doc.location.href='../inbox/index.html'
})

obj.home.addEventListener('click', function(e){
    e.preventDefault()

    doc.location.href='../home/index.html'
})

function verifyRoute(){
    const data=localStorage.getItem('data')

    if(!data){
        doc.location.href='../index.html'
    }
}

verifyRoute()

function sendedMail(){
    const credentials=localStorage.getItem('data')
    const client=JSON.parse(credentials)
    
    let id=client.client.id
    let email=client.client.email    
    let token=client.token

    const url=obj.Url_sendedMail(id, email, 10, 1)
    
    fetch(url, {
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        }
    })
    .then(response=>{

        if(response.status === 200 ){
            console.log(response.json())
        }
        if(response.status != 200 ){
            
            response.json().then(response=>{
                Object.keys(response).map(e=>{

                    if(response[e] === 'token invalid'){

                        doc.location.href='../index.html'
                    }else{

                        const card=doc.createElement('div')
                        const h2=doc.createElement('h2')
                        
                        h2.append(response[e])
                        
                        card.append(h2)
                        card.setAttribute('class', 'response_area')
    
                        obj.sendbox.append(card)
                    }

                })
            })
        }

    })
}

sendedMail()
