let userBriefcase = null;
let userBriefcaseId= null;

function selectUserBriefcase(id, number) {
    if (userBriefcase === null) {
        userBriefcase = number;
        userBriefcaseId = id;

        document.getElementById("user_briefcase_title").style.display = "block";
        
        const userBriefcaseButton = document.createElement("button");
        userBriefcaseButton.innerText = number;
        userBriefcaseButton.style.width = "80px";
        userBriefcaseButton.style.height = "50px";
        userBriefcaseButton.style.margin = "5px";
        userBriefcaseButton.disabled = true;

        document.getElementById("user_briefcase_container").appendChild(userBriefcaseButton);

        document.getElementById("briefcase-" + number).remove();
        alert("Ai selectat cutia " + number + " ca fiind cutia ta!");

        sendSelectedBriefcase(id, number);

    } else {
        alert("Cutia ta este deja selectata: Cutia " + userBriefcase);
    }
}

function openBriefcase(id, number) {
    if (userBriefcase !== null) {
        fetch('select-briefcase/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({briefcase_id: id, briefcase_number: number})
        })
        .then(response => response.json())
        .then(data => {
            console.log("Răspuns backend:", data);
            if (data.error) {
                alert(data.error);
                return;
            }

            let button = document.getElementById(`briefcase-${number}`);
            if (button) { 
                button.innerText = `${data.amount} ${data.unit_measure}`;
                button.disabled = true;
                button.style.backgroundColor = '#d3d3d3';
            } else {
                console.error(`Eroare: Butonul briefcase-${number} nu a fost găsit.`);
            }

            let roundTitle = document.getElementById('game_round_title');
            if (roundTitle) {
                if (data.current_round < 8) {
                    roundTitle.textContent = `Runda ${data.current_round} - ${data.opened_count}/${data.boxes_to_open} Cutii Deschise`
                }
            }

            if (data.bank_offer) {
                showBankOffer(data);
            }
        })
        .catch(error => console.error("Eroare:", error));
    } else {
        alert('Mai întâi selectează-ți propria cutie');
    }
}

function showBankOffer(data) {
    let roundTitle = document.getElementById('game_round_title');

    if (roundTitle) {
        if (data.current_round < 8) {
            roundTitle.textContent = "Se așteaptă decizia jucătorului";
        } else {
            roundTitle.textContent = "Runda Finala - Jucatorul Va Confirma Oferta Bancii Sau Va Ramane Cu Valoarea Din Cutia Proprie";
        }
    }

    let overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    document.body.appendChild(overlay);

    let modal = document.createElement("div");
    modal.id = "offerModal";
    modal.style.backgroundColor = "white";
    modal.style.padding = "20px";
    modal.style.borderRadius = "10px";
    modal.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
    modal.style.textAlign = "center";

    let message = document.createElement("p");
    message.innerText = `Banca iti ofera: ${data.bank_offer} RON`;

    let acceptBtn = document.createElement("button");
    acceptBtn.innerText = "Accepta";
    acceptBtn.style.margin = "10px";
    acceptBtn.onclick = function() {
        endGame(data.bank_offer);
    };

    let rejectBtn = document.createElement('button');
    rejectBtn.innerText = "Refuza";
    rejectBtn.style.margin = "10px";
    rejectBtn.onclick = function() {
        document.body.removeChild(overlay);
        
        if (roundTitle) {
            if (data.current_round < 8) {
                roundTitle.textContent = `Runda ${data.current_round} - ${data.opened_count}/${data.boxes_to_open} Cutii Deschise`;
            } else {
                let userBriefcaseContainer = document.getElementById("user_briefcase_container");
                let briefcaseContainer = document.getElementById("briefcase-container");
                
                if (userBriefcaseContainer) {
                    let userBriefcaseButton = userBriefcaseContainer.querySelector('button');

                    if (userBriefcaseButton) {
                        userBriefcaseButton.innerText = `${data.amount} ${data.unit_measure}`;
                        roundTitle.textContent = `Jocul s-a terminat! Ai câștigat ${data.amount} RON!`

                        if (briefcaseContainer) {
                            let lastBriefcaseButton = briefcaseContainer.querySelector("button[disabled]");

                            if (lastBriefcaseButton) {
                                lastBriefcaseButton.innerText = `${data.amount} ${data.unit_measure}`;
                            }
                        }
                    }
                }
            }
        }
    };

    modal.appendChild(message)
    modal.appendChild(acceptBtn)
    modal.appendChild(rejectBtn)
    overlay.appendChild(modal);
}

function endGame(offer) {
    document.getElementById("game_round_title").textContent = `Jocul s-a terminat! Ai câștigat ${offer} RON!`
    document.querySelectorAll("button").forEach(btn=>btn.disabled = true);

    let overlay = document.getElementById("overlay");
    if (overlay) {
        document.body.removeChild(overlay);
    }
}