
function getAllTopics() {
    $.get( "/getAllTopics", function(data) {
        topics = data;
        $("#stations").empty();
        for(topic of topics) {
            console.log("Topics", topic);
            $("#stations").append(`<option value=${topic[0]}>${topic[1]} --- [Station Code: ${topic[0]}]</option>`);
        }
    });
}

function publish() {
    $.post("/publish",
        {
            topicId: $("#stations").val(),
            message: $("#message").val()
        },
        function(data) {
            
        }
    );
}

function advertise() {
    $.post("/advertise",
        {
            advertisement: $("#add").val(),
        },
        function(data) {
            
        }
    );
}

function notify() {

}

/* getAllTopics(); */