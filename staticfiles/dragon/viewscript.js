// scripts to set up view page and voting
document.addEventListener('DOMContentLoaded', () => {
    console.log("page loaded");
    // get CSRF for ajax
    function getCookie(name) {
        console.log("getCookie called");
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');
    // set up viewer with pattern
    viewer(JSON.parse(document.getElementById("explore_view").dataset.coords));
    // voting
    upbutton = document.getElementById('upvote_button');
    upbutton.onclick = () => {
        const data = {
            "voterid": document.getElementById("usernamespan").dataset.userid,
            "patternid": document.getElementById("explore_view").dataset.patternid, 
        }
        upbutton.disabled = true;
        const request = new XMLHttpRequest();
        request.open('POST', '/vote');
        request.setRequestHeader('X-CSRFToken', csrftoken);
        request.setRequestHeader('Content-Type', "application/json");
        request.onload = () => {
            // extract json
            const msg = request.responseText
            console.log("response from server:")
            console.log(msg);
            // return result
            document.getElementById("upvote_msg").innerHTML = msg;
        }
        request.send(JSON.stringify(data));
    }
});