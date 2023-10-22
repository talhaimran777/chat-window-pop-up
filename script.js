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
    document.head.appendChild(style);
}

const chatContainerHTML = `
    <div id="chat-container">
        <div class="form-header">
            <h2 class="heading">Message Us</h2>
            <p class="paragraph">Send us a message and we will get back to you shortly by text message.</p>
        </div>
        <form class="form">
            ${['Name', 'Email', 'Phone', 'Message'].map(name => `
                <div class="form-group">
                    <label class="required">${name}</label>
                    <input type="${name === 'Email' ? 'email' : 'text'}" name="${name.toLowerCase()}" class="form-input" required>
                </div>
            `).join('')}
            <div class="form-btn-wrapper">
                <button type="submit" class="form-btn">Send</button>
            </div>
        </form>
    </div>
`;

const popUpHTML = `<div id="pop-up"></div>`;


(function () {
    const chatContainer = document.createRange().createContextualFragment(chatContainerHTML).firstChild.nextElementSibling;
    const popUp = document.createRange().createContextualFragment(popUpHTML).firstChild;

    const formDiv = chatContainer.querySelector('.form');
    const formHeader = chatContainer.querySelector('.form-header');
    const button = formDiv.querySelector('.form-btn')

    const heading = formHeader.querySelector('.heading');
    const paragraph = formHeader.querySelector('.paragraph');

    const resetForm = () => {
        formDiv.style.display = 'block';
        heading.textContent = 'Message Us';
        paragraph.textContent = 'Send us a message and we will get back to you shortly by text message.';
        formDiv.reset();
    }

    const successForm = () => {
        heading.textContent = 'Message sent successfully!';
        paragraph.textContent = 'Our team will contact you shortly!';
    }

    const errorForm = () => {
        heading.textContent = 'Error sending message';
        paragraph.textContent = 'Please try again';
    }

    const sendMessage = async (data) => {
        try {
            button.textContent = '...';

            const response = await fetch('http://localhost:8000/api/message/receive/script', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            formDiv.style.display = 'none';
            formDiv.reset();

            if (response.ok) {
                successForm();
            } else {
                errorForm();
            }
        } catch (error) {
            errorForm();
        } finally {
            button.textContent = 'Send';
        }
    }

    formDiv.addEventListener('submit', async (e) => {
        e.preventDefault();

        const companyId = document.querySelector('.tcb-chat-window-pop-up')?.id;
        const data = {
            companyId
        };

        new FormData(formDiv).forEach((value, key) => {
            if (key === "message") {
                data["messageBody"] = value;
            } else {
                data[key] = value;
            }
        });

        sendMessage(data);
    });

    popUp.addEventListener('click', () => {
        if (chatContainer.classList.contains("visible-pop-up")) {
            chatContainer.classList.remove("visible-pop-up")
            chatContainer.classList.add("hide-pop-up");
            setTimeout(resetForm, 400);
        } else {
            chatContainer.classList.remove("hide-pop-up")
            chatContainer.classList.add("visible-pop-up");
        }
    });

    createStyles(styles);

    document.body.appendChild(chatContainer);
    document.body.appendChild(popUp);
})();
