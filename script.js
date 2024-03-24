var leftimg=document.getElementsByClassName('left')[0];
var centerimg=document.getElementsByClassName('center')[0];
var rightimg=document.getElementsByClassName('right')[0];
var fileaccess=document.getElementById('file');
var dropper=document.getElementsByClassName('dropzone')[0];
var browse=document.getElementById('browse');
var progresscontainer=document.getElementsByClassName('progress-container')[0];
var progressfluid=document.getElementsByClassName('progress-fluid')[0];
var progressbar=document.getElementsByClassName('progress-bar')[0];
var uploadpercent=document.getElementsByClassName('upload-percent')[0];
var showshare=document.getElementsByClassName('show-share')[0];
var copyicon=document.getElementById('copy');
var input=document.querySelector('.show-link input');
var senderinput=document.getElementById('sender-input');
var recieverinput=document.getElementById('reciever-input');
var emailform=document.getElementById('email-form');
var sendbtn=document.getElementById('send-btn')
// const uploadlink="http://localhost:3000/api/files";
// const sendlink="http://localhost:3000/api/files/send";
const uploadlink="https://file-sharing-backend-1.onrender.com/api/files";
const sendlink="https://file-sharing-backend-1.onrender.com/api/files/send";
dropper.addEventListener('dragover',(e)=>{
    e.preventDefault();
    console.log('aaa');
    if(!leftimg.classList.contains('shift2'))
    {
        leftimg.classList.add('shift2');
        rightimg.classList.add('shift1');
        centerimg.classList.add('shift3');
    }
})
dropper.addEventListener('dragleave',(e)=>{
    if(leftimg.classList.contains('shift2'))
    {
        leftimg.classList.remove('shift2');
        rightimg.classList.remove('shift1');
        centerimg.classList.remove('shift3');
    }
  
})
dropper.addEventListener('drop',(e)=>{
    e.preventDefault();
    if(leftimg.classList.contains('shift2'))
    {
        leftimg.classList.remove('shift2');
        rightimg.classList.remove('shift1');
        centerimg.classList.remove('shift3');
    }
    const files=e.dataTransfer.files;
    console.log(files);
    if(files.length!=0){
        fileaccess.files=files;
        uploadFile();
    }
})
browse.addEventListener('click',()=>{
    fileaccess.click();
})
fileaccess.addEventListener('change',()=>{
    uploadFile();
})
copyicon.addEventListener('click',()=>{
    input.select();
    document.execCommand('copy');
})







const uploadFile=()=>{
    console.log('uploading')
    progresscontainer.style.display='block';
    const file=fileaccess.files[0];
    const formData= new FormData();
    formData.append('myfile',file);
    const xhrRequest=new  XMLHttpRequest();
    //called when req is completed successfully
    xhrRequest.onload=()=>{
        console.log(xhrRequest.response);
        showlink(JSON.parse(xhrRequest.response));
    };
    xhrRequest.upload.onprogress=updateprogress;
    xhrRequest.open('POST',uploadlink);
    xhrRequest.send(formData);
}





const updateprogress=(e)=>{
    const percentloaded=Math.round((e.loaded/e.total)*100);
    console.log(e);
    console.log(percentloaded);
    progressfluid.style.width=`${percentloaded}%`;
    progressbar.style.transform=`scale(${percentloaded/100})`;
    uploadpercent.innerHTML=`${percentloaded}%`;
}






var a=0;
const showlink=({file})=>{
   progresscontainer.style.display='none'; 
   showshare.style.display='block';
   const percentloaded=0;
   progressfluid.style.width=`${percentloaded}%`;
   uploadpercent.innerHTML=`${percentloaded}%`;
   progressbar.style.width=0;
   input.value=file;
   console.log('file',file);
   const sendfunc=()=>{
        console.log('senenenene');
        const sender=senderinput.value;
        const reciever=recieverinput.value;
        const uuid=file.split('/')[4]
        const data={
            uuid,
            reciever,
            sender
        };
        fetch(sendlink,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        }).then((res)=>{
            return res.json()
        })
        .then((info)=>{
            console.log(info)//{success: true}
            if(info.success){
                showshare.style.display='none';
                alert("File sent successfully");
            }
            sendbtn.removeEventListener('click',sendfunc);
            a--;
        })
   }
   console.log('a',a)
   if(a==1){
        console.log('inn')
        var new_element = sendbtn.cloneNode(true);
        sendbtn.parentNode.replaceChild(new_element, sendbtn);
        sendbtn=new_element;
        a--; 
   }
   console.log('a',a)
   sendbtn.addEventListener('click',sendfunc);
   a++;
   
   console.log('a',a);
}