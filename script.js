document.addEventListener('DOMContentLoaded', function () {
    console.log("Script loaded");

    const popUp = document.querySelector("#pop-up");
    const chatContainer = document.querySelector("#chat-container");

    popUp.addEventListener('click', () => {
        if (chatContainer.classList.contains("visible-pop-up")) {
            chatContainer.classList.remove("visible-pop-up")
            chatContainer.classList.add("hide-pop-up");
        } else {
            chatContainer.classList.remove("hide-pop-up")
            chatContainer.classList.add("visible-pop-up");
        }
    });
});
