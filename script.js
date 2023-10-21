const styles = `
    #pop-up {
        height: 60px;
        width: 60px;
        background-color: #061647;
        position: fixed;
        bottom: 20px;
        right: 20px;
        border-radius: 50%;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 5px 40px;
        cursor: pointer;
    }

    #chat-container {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 330px;
        height: min-content;
        max-height: 500px;
        overflow: auto;
        background-color: white;
        border-radius: 5px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 5px 40px;
        opacity: 0;
        transition: opacity 0.3s ease 0s;
        visibility: hidden;
        display: block;
        padding: 30px 20px;
    }

    .visible-pop-up {
        opacity: 1 !important;
        visibility: visible !important;
    }

    .hide-pop-up {
        visibility: hidden !important;
        opacity: 0 !important;
        transition: opacity 0.3s ease 0s, visibility 0s ease 0.3s !important;
    }

    #chat-container > .form-header {
        text-align: center;
        margin-bottom: 40px;
        color: #061647;
    }

    .required::after {
        content: ' *';
        color: red;
    }

    .form-header > h2 {
        margin-bottom: 10px;
        font-weight: bold;
    }

    .form-header > p {
        color: #0000009a;
    }

    .form > :not(:nth-child(5)) {
        margin-bottom: 30px;
    }

    .form > .form-group > label {
        font-weight: bold;
        color: #061647;
    }

    .form-input {
        width: 100%;
        outline: none;
        border: none;
        border-bottom: 2px solid #00000050;
        padding: 10px 0px;
        color: #0000009a;
    }

    .form-input:focus-visible {
        border-bottom: 2px solid #061647;
    }

    .form-btn {
        background-color: #061647;
        padding: 10px 20px;
        color: white;
        font-weight: bold;
        border: none;
        border-radius: 5px;
        margin-top: 10px;
        cursor: pointer;
    }

    .form-btn-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
    }

`;

function createStyles(styles) {
    const style = document.createElement('style');
    style.id = 'tcb-pop-up-stylesheet';
    style.innerHTML = styles;
    document.getElementsByTagName('head')[0].appendChild(style);
}

(function () {
    // Create div element with id "chat-container"
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chat-container';

    // Create div element with class "form-header"
    const formHeader = document.createElement('div');
    formHeader.className = 'form-header';

    // Create h2 element
    const heading = document.createElement('h2');
    heading.textContent = 'Message Us';

    // Create p element
    const paragraph = document.createElement('p');
    paragraph.textContent = 'Send us a message and we will get back to you shortly by text message.';

    // Append heading and paragraph to formHeader
    formHeader.appendChild(heading);
    formHeader.appendChild(paragraph);

    // Append formHeader to chatContainer
    chatContainer.appendChild(formHeader);

    // Create div element with class "form"
    const formDiv = document.createElement('form');
    formDiv.className = 'form';

    // Array of form input names
    const inputNames = ['Name', 'Email', 'Phone', 'Message'];

    // Iterate through inputNames to create form groups and inputs
    inputNames.forEach(name => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const label = document.createElement('label');
        label.className = 'required';
        label.textContent = name;

        const input = document.createElement('input');
        input.type = name === 'Email' ? 'email' : 'text';
        input.name = name.toLowerCase();
        input.className = 'form-input';

        // Append label and input to formGroup
        formGroup.appendChild(label);
        formGroup.appendChild(input);

        // Append formGroup to formDiv
        formDiv.appendChild(formGroup);
    });

    // Create button element with class "form-btn"
    const button = document.createElement('button');
    button.className = 'form-btn';
    button.textContent = 'Send';

    // Create div element with class "form-btn-wrapper" and append the button
    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'form-btn-wrapper';
    buttonWrapper.appendChild(button);

    // Append buttonWrapper to formDiv
    formDiv.appendChild(buttonWrapper);

    formDiv.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = formDiv.querySelector('input[name="name"]').value;
        const email = formDiv.querySelector('input[name="email"]').value;
        const phone = formDiv.querySelector('input[name="phone"]').value;
        const messageBody = formDiv.querySelector('input[name="message"]').value;
        const companyId = document.getElementsByClassName("tcb-chat-window-pop-up")?.item(0)?.id;

        const data = {
            companyId,
            name,
            email,
            phone,
            messageBody
        };

        // Send a POST request to the Node.js backend
        fetch('http://localhost:8000/api/message/receive/script', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Form submitted successfully');
                    formDiv.reset();
                } else {
                    console.log('Form submission failed');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });

    // Append formDiv to chatContainer
    chatContainer.appendChild(formDiv);

    // Create div element with id "pop-up"
    const popUp = document.createElement('div');
    popUp.id = 'pop-up';

    // Adding event handler
    popUp.addEventListener('click', () => {
        if (chatContainer.classList.contains("visible-pop-up")) {
            chatContainer.classList.remove("visible-pop-up")
            chatContainer.classList.add("hide-pop-up");
        } else {
            chatContainer.classList.remove("hide-pop-up")
            chatContainer.classList.add("visible-pop-up");
        }
    });

    // Injecting styles
    createStyles(styles);

    // Append chatContainer and popUp to the body of the document
    document.body.appendChild(chatContainer);
    document.body.appendChild(popUp);
})();