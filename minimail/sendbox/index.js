const doc=document

const obj={
    sendbox: doc.querySelector('.sendbox'),
    inbox: doc.querySelector('.inbox'),
    home: doc.querySelector('.home'),
    Url_sendedMail: (id, senderEmail, size, page)=> `http://127.0.0.1:34568/sendbox/${id}/user?sender=${senderEmail}&size=${size}&page=${page}`,
    url_client: (id)=>`http://127.0.0.1:34568/user/${id}`
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
            
            response.json()
                    .then(response=>{

                        response.data.map(e=>{

                            const id=e.id
                            const topic=e.topic
                            const mail_msg=e.mail_msg.substring(0,50) + '...'

                            const panel_title=doc.createElement('p')
                            panel_title.setAttribute('id', 'title')

                            const panel_element=doc.createElement('strong')
                            panel_element.setAttribute('id', 'response_content')

                            //Panel with heading 
                            //link: https://getbootstrap.com/docs/3.3/components/
                            const panel=doc.createElement('div')
                            panel.setAttribute('class', 'panel panel-default')

                            const panel_heading=doc.createElement('div')
                            panel_heading.setAttribute('class', 'panel-heading')
                            
                            const panel_body=doc.createElement('div')
                            panel_body.setAttribute('class', 'panel-body')

                            //html node tree from creation card
                            panel.append(panel_heading)
                            panel.append(panel_body)

                            panel_heading.append(panel_title)

                            panel_title.append(topic)
                            
                            panel_element.append(mail_msg)

                            panel_body.append(panel_element)

                            //click event
                            panel.addEventListener('click', function(e){
                                e.preventDefault()

                                localStorage.setItem('client_id', id)
                                doc.location.href='../config/index.html'
                            })

                            //sendbox area insert card from each email sended
                            obj.sendbox.append(panel)

                        })
                    })
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




