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
        })
        .catch(error => console.error("Eroare:", error));
    } else {
        alert('Mai întâi selectează-ți propria cutie');
    }
}