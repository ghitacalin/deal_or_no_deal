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

        sendSelectedBriefcase(number);

    } else {
        alert("Cutia ta este deja selectata: Cutia " + userBriefcase);
    }
    }