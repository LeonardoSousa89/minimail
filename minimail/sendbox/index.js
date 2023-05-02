const doc=document

const obj={}

function verifyRoute(){
    const data=localStorage.getItem('data')

    if(!data){
        doc.location.href='../index.html'
    }
}

verifyRoute()