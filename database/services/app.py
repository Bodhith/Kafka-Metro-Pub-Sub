import os
import json
import requests
import mysql.connector
from trail import *
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

@app.route('/broker/getTopics', methods=['GET'])
def getBrokerTopics():
    brokerId = os.environ['BROKER_ID']
    return (json.dumps(brokerTopicsHash[brokerId]), 200)

@app.route('/broker/getBrokerAddresses/<topicId>', methods=['GET'])
def getTopicBrokerAddresses(topicId):
    for brokerTopicId, topics in brokerTopicsHash.items():
        if topicId in topics:
            return (brokerTopicId, 200)
    return ('', 204)

@app.route('/getAlertsFromTopic/<topicId>', methods=['GET'])
def getAlertsFromTopic(topicId):
    topicId = int(topicId)
    alerts = get_messages(topicId)
    return (json.dumps(alerts), 200)    

@app.route('/getSubTopics/<subId>', methods=['GET'])
def getSubTopics(subId):
    subId = int(subId)

    topicNames = getAllTopics()

    topics = subscribed_topics(subId)
    topics.append(addTopicId)
    topicsHash = {}
    for topic in topicNames:
        topicsHash[topic[0]] = topic[1]
    
    subTopics = {}
    
    for topic in topics:
        subTopics[topic] = topicsHash[topic]

    return (json.dumps(subTopics), 200)

@app.route('/getAllTopics/<userType>', methods=['GET'])
def fetchAllTopics(userType):
    topics = getAllTopics()
    if userType == "pub":
        for topic in topics:
            if topic[0] == addTopicId:
                topics.remove(topic)
                break
    return (json.dumps(topics), 200)

@app.route('/subscribe', methods=['POST'])
def subscription():
    try:
        data = json.loads(request.data.decode("utf-8"))
        subId = int(data["subId"])
        topicId = int(data["topicId"])
        subscribe(subId, topicId)
        return('', 200)
    except:
        return('', 400)

@app.route('/unsubscribe', methods=['POST'])
def unSubscribe():
    try:
        data = json.loads(request.data.decode("utf-8"))
        subId = int(data["subId"])
        topicId = int(data["topicId"])
        unsubscribe(subId, topicId)
        return('', 200)
    except:
        return('', 400)

@app.route('/publish', methods=['POST'])
def publishMessage():
    try:
        data = json.loads(request.data.decode("utf-8"))
        topicId = int(data["topicId"])
        message = str(data["message"])
        publish_newmessage(topicId, message)
        return('', 200)
    except:
        return('', 400)

@app.route('/advertise', methods=['POST'])
def advertiseMessage():
    try:
        data = json.loads(request.data.decode("utf-8"))
        advertisement = str(data["advertisement"])
        advertise_newmessage(advertisement)
        return('', 200)
    except:
        return('', 400)

@app.route('/notify', methods=['POST'])
def notifyMessage():
    try:
        data = json.loads(request.data.decode("utf-8"))
        topicId = int(data["topicId"])
        message = str(data["message"])
        notify_newmessage(topicId, message)
        return('', 200)
    except:
        return('', 400)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port="4000")