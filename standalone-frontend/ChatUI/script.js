const chatContainer= document.getElementById('chat-body');
const userInput= document.getElementById('user-input');
const sendBtn = document.getElementById('send');

function addMessage(content,isUser=false){
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser? 'input-text' :'reply-text';

    if(isUser){
        messageDiv.innerHTML=`

        <p>${content}</p>
        `;
    }else{
        messageDiv.innerHTML=`
        <img src="./Finn.png">

        <p>${content}</p>

        `;

    }
    chatContainer.appendChild(messageDiv);
    const textElement = messageDiv.querySelector('p');
    typeText(textElement, content);
    chatContainer.scrollTop = chatContainer.scrollHeight;


}
function typeText(element, text) {
    let index = 0;
    element.innerHTML = '';
    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            chatContainer.scrollTop = chatContainer.scrollHeight;
            setTimeout(type, 10); 
        }
    }
    type();
}
function addLoader(){
    const loaderDiv = document.createElement('div');
    loaderDiv.className='reply-text';
    loaderDiv.innerHTML = `
                <img src="./Finn.png">
                <div class="loader">
                    <div class="circle">
                        <div class="dot"></div>
                        <div class="outline"></div>
                    </div>
                    <div class="circle">
                        <div class="dot"></div>
                        <div class="outline"></div>
                    </div>
                    <div class="circle">
                        <div class="dot"></div>
                        <div class="outline"></div>
                    </div>
                    <div class="circle">
                        <div class="dot"></div>
                        <div class="outline"></div>
                    </div>
                </div>`;

        chatContainer.appendChild(loaderDiv)
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return loaderDiv;
    
}

function removeLoader(loaderElement) {
    chatContainer.removeChild(loaderElement);
}


function removeLoader(loaderElement) {
    chatContainer.removeChild(loaderElement);
}



async function generateReply(message) {
    try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: message }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error('Error:', error);
        return "Sorry, I couldn't generate a reply due to a technical issue.";
    }
}


sendBtn.addEventListener('click',async () =>{
    const message = userInput.value.trim();
    if (message){
        addMessage(message,true);
        userInput.value='';

        const loader=addLoader();

        try{
            const reply =await generateReply(message);
            removeLoader(loader);
            addMessage(reply);

        }
        catch(e){
            removeLoader(loader);
            addMessage("Sorry, I couldn't generate a reply.");
        }
    }
   

})


userInput.addEventListener('keypress',(e)=>{
    if(e.key==='Enter'){
        sendBtn.click();
    }
});



document.addEventListener("DOMContentLoaded", function () {
    const gsap = window.gsap;

    gsap.set(".input-container", { autoAlpha: 0, y: 50 });

    const typeText = () => {
        return new Promise((resolve) => {
            const text = "Chat with Finn-AI";
            const textElement = document.querySelector(".landing p");
            let index = 0;

            const typeInterval = setInterval(() => {
                textElement.textContent = text.slice(0, index + 1);
                index += 1;
                if (index === text.length) {
                    clearInterval(typeInterval);
                    resolve();
                }
            }, 50); 
        });
    };

    typeText().then(() => {
        gsap.to(".input-container", { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" });
    });
});