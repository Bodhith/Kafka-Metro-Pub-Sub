(function() {
    const ws = new WebSocket(`ws://${location.hostname}:5001`);

    ws.addEventListener("open", function() {
        console.log("Connected to Subscribe Server");
    });

    ws.addEventListener("message", function(e) {
        console.log("Message recieved from Server", e.data);
        $("#alerts").append("<li>"+e.data+"</li>")
    });
})();

function getSubTopics() {
    $.get(`/getSubTopics${window.location.pathname}`, function(data) {
        topics = data;
        $("#subbedTopics").empty();
        $.each(topics, function(topicId, topicName) {
            console.log("Subbed Topics", topicId, topic);
            $("#subbedTopics").append(`<li>${topicName}</li>`);
        });
    });
}

function subscribe() {
}


function unSubscribe() {
}

getSubTopics();