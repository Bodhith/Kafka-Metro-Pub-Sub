const ws = new WebSocket(`ws://${location.hostname}:5001`);

ws.addEventListener("open", function() {
    console.log("Connected to Subscribe Server");
});

ws.addEventListener("message", function(e) {
    var data = JSON.parse(e.data);
    console.log("Message recieved from Server", data);
    if("alert" in data) {
        $("#alerts").append("<li>"+data.alert+"</li>")
    }
    else if("updateTopics" in data) {
        getSubTopics();
    }
});


function getSubTopics() {
    $.get(`/getSubTopics${window.location.pathname}`, function(data) {
        topics = data;
        $("#subbedTopics").empty();
        $.each(topics, function(topicId, topicName) {
            console.log("Subbed Topics", topicId, topic);
            $("#subbedTopics").append(`<li>${topicName}</li>`);
            $.get(`/getOldFeedAlerts/${topicId}`, function(data) {
                console.log(topicId, data);
                $("#oldAlerts").append(`<li>${topicName}=>${data[0]}=>${data[1]}</li>`);
            });
        });
    });
}

function subscribe() {
    ws.send(JSON.stringify({
        subscribe: {
            userId: window.location.pathname.substr(1),
            topicId: $("#topic").val()
        }
    }));
}

function unSubscribe() {
    ws.send(JSON.stringify({
        unsubscribe: {
            userId: window.location.pathname.substr(1),
            topicId: $("#topic").val()
        }
    }));
}

getSubTopics();