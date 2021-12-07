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