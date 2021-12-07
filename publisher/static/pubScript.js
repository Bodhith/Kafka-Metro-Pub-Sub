
function getAllTopics() {
    $.get( "/getAllTopics", function(data) {
        topics = data;
        $("#stations").empty();
        for(topic of topics) {
            console.log("Topics", topic);
            $("#stations").append("<option value="+topic[0]+">"+topic[1]+" --- [Station Code:"+topic[0]+"]</option>");
        }
    });
}

function publish() {

}

function advertise() {

}

function notify() {

}

getAllTopics();