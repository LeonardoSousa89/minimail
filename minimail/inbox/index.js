const doc=document

const obj={
    sendbox: doc.querySelector('.sendbox'),
    inbox: doc.querySelector('.inbox'),
    send: doc.querySelector('.send'),
    home: doc.querySelector('.home'),
    delete_all: doc.querySelector('#delete_all'),
    alert_error: doc.querySelector('#alert_error'),
    info_area: doc.querySelector('.info_area'),
    Url_getMail: (id, email, size, page)=> `http://127.0.0.1:34568/inbox/${id}/user?email=${email}&size=${size}&page=${page}`,
    url_client: (id)=>`http://127.0.0.1:34568/user/${id}`,
    url_delete_By_id: (user_id, email_id)=>`http://127.0.0.1:34568/inbox/${user_id}/user/delete?id=${email_id}`,
    url_delete_all: (id, email)=>`http://127.0.0.1:34568/inbox/${id}/user/delete-all?mail_destination=${email}`
}

obj.sendbox.addEventListener('click', function(e){
    e.preventDefault()

    doc.location.href='../sendbox/index.html'
})

obj.send.addEventListener('click', function(e){
    e.preventDefault()

    doc.location.href='../send/index.html'
})

obj.home.addEventListener('click', function(e){
    e.preventDefault()

    doc.location.href='../home/index.html'
})

obj.delete_all.addEventListener('click', function(e){
    e.preventDefault()

    const credentials=getUserCredentials()
    
    const id=credentials.client.client.id
    const email=credentials.client.client.email    
    const token=credentials.client.token

    const url=obj.url_delete_all(id, email)
    
    fetch(url,{
        method: 'DELETE',
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response=>{

        if(response.status === 204){
            
            doc.location.reload()
        }
        if(response.status != 204){
            
            obj.alert_error.style='display: flex'
            obj.alert_error.append("i'm sorry there's an error with server")

            setInterval(function(){ 
                doc.location.reload() 
            },1200)
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

function getMail(){ 
    const credentials=getUserCredentials()
    
    const id=credentials.client.client.id
    const email=credentials.client.client.email    
    const token=credentials.client.token

    const url=obj.Url_getMail(id, email, 10, 1)

    fetch(url, {
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        }
    })
    .then(response=>{

        if(response.status === 200 ){
            
            obj.delete_all.style.display='flex'

            response.json()
                    .then(response=>{

                        response.data.map(e=>{
                            
                            //data API
                            const email_id=e.id
                            const topic=e.topic
                            const mail_msg=e.mail_msg.substring(0,50) + '...'
                            
                            //containers of data API
                            const panel_title=doc.createElement('p')
                            panel_title.setAttribute('id', 'title')

                            const panel_element=doc.createElement('strong')
                            panel_element.setAttribute('id', 'response_content')

                            //creation of icons 
                            const trash_icon=doc.createElement('span')
                            trash_icon.setAttribute('class', 'glyphicon glyphicon-trash')

                            const pencil_icon=doc.createElement('span')
                            pencil_icon.setAttribute('class', 'glyphicon glyphicon-pencil')

                            //Panel with heading bootstrap
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
                            panel_element.append(pencil_icon)
                            panel_element.append(trash_icon)

                            panel_body.append(panel_element)

                            //click event (only icon buttons)
                            pencil_icon.addEventListener('click', function(e){
                                e.preventDefault()

                                localStorage.setItem('client_id', email_id)
                                doc.location.href='../email/index.html'
                            })

                            //delete by id
                            trash_icon.addEventListener('click', function(e){
                                e.preventDefault()

                               const url=obj.url_delete_By_id(id, email_id)
                              
                                fetch(url,{
                                        method: 'DELETE',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}` 
                                        }
                                }).then(response=>{
                                    if(response.status === 204) {
                                        
                                        doc.location.reload()
                                    }
                                    if(response.status != 204) {
                                        
                                        obj.alert_error.style='display: flex'
                                        obj.alert_error.append("i'm sorry there's an error with server")
                            
                                        setInterval(function(){ 
                                            doc.location.reload() 
                                        },1200)
                                    }
                                })
                            })

                            //inbox area insert card from each email received
                            obj.info_area.append(panel)

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
    
                        obj.inbox.append(card)
                    }

                })
            })
        }

    })
    .catch(_=>{

        obj.inbox.style.display='flex'
        obj.inbox.style.alignItems='center'
        obj.inbox.style.justifyContent='center'

        obj.alert_error.style='display: flex'
        obj.alert_error.append("i'm sorry there's an error with server")
    })
}

getMail()




