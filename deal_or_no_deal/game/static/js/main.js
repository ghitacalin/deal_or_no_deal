function sendSelectedBriefcase(id, number) {
    fetch('select-briefcase/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ briefcase_id: id, briefcase_number: number})
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("A aparut o problema la trimiterea datelor.");
        }
    })
    .then(data => {
        console.log("Raspuns backend:", data);
    })
    .catch(error => {
        console.error("Eroare:", error);
    });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !=='') {
        const cookies = document.cookie.split(';');
        for (let i=0; i< cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}