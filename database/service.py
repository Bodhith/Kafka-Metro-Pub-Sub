import mysql.connector
from datetime import datetime
import time

db = mysql.connector.connect(
    host = "database",
    user = "user",
    password = "password",
    database = "nfta_db",
    autocommit=True # just in case, missed somewhere
)

addTopicId = 1

def getAddTopicId():
    return addTopicId

def get_role(user_id):
    query = """SELECT role FROM users where userid = %d"""%(user_id)
    cursor = db.cursor(buffered=True)
    cursor.execute(query)
    l=[]
    for x in cursor:
        l.append(x)
    cursor.close()

def get_topicname(topic_id):
    query = """SELECT name FROM topics where topic_id = %d"""%(topic_id)
    cursor = db.cursor(buffered=True)
    cursor.execute(query)
    l=[]
    for x in cursor:
        l.append([x[0], x[1]])
    cursor.close()

def getAllTopics():
    query = """Select id, name from topics"""
    cursor = db.cursor(buffered=True)
    cursor.execute(query)
    l = []
    for x in cursor:
        l.append(x)
    cursor.close()
    return l

def get_messages(topic_id):
    query = """SELECT message,recorded_time FROM alerts where topic_id = %d order by recorded_time desc"""%(topic_id)
    cursor = db.cursor(buffered=True)
    cursor.execute(query)
    l=[]
    for x in cursor:
        l.append([x[0], x[1].strftime(" %H:%M:%S on %m-%d-%y")])
    cursor.close()
    return l

def publish_newmessage(topic_id, message):
    query = '''insert into alerts(topic_id, message) VALUES(%d, "%s")'''%(topic_id, message)
    cursor = db.cursor(buffered=True)
    cursor.execute(query)
    db.commit()
    cursor.close()

def advertise_newmessage(message):
    query = '''insert into alerts(topic_id, message) VALUES(%d, "%s")'''%(addTopicId, message)
    cursor = db.cursor(buffered=True)
    cursor.execute(query)
    db.commit()
    cursor.close()

def pub_topic(user_id):
    query = """SELECT topic_id FROM pub_topic where user_id = %d"""%(user_id)
    cursor = db.cursor(buffered=True)
    cursor.execute(query)
    l=[]
    for x in cursor:
        l.append(x)
    cursor.close()

# Get Subbed Topics
def subscribed_topics(user_id):
    query = """SELECT topic_id FROM user_subs where user_id = %d and status =1"""%(user_id)
    cursor = db.cursor(buffered=True)
    cursor.execute(query)
    l=[]
    for x in cursor:
        l.append(x[0])
    cursor.close()
    return l

def unsubscribe(user_id, topic_id):
    query = """UPDATE user_subs SET status=0 where user_id = %d and topic_id = %d"""%(user_id,topic_id)
    cursor = db.cursor(buffered=True)
    cursor.execute(query)
    db.commit()
    cursor.close()

def isempty(tableName, colName, value):
    query = '''SELECT * FROM %s WHERE %s=%d'''%(tableName, colName, value)
    cursor = db.cursor(buffered=True)
    cursor.execute(query)
    rows = cursor.fetchall()
    if len(rows):
        cursor.close()
        return False
    else:
        cursor.close()
        return True

def isempty_(tableName, colName, colName_, value, value_):
    query = '''SELECT * FROM %s WHERE %s=%d && %s=%d'''%(tableName, colName, value, colName_, value_)
    cursor = db.cursor(buffered=True)
    cursor.execute(query)
    rows = cursor.fetchall()
    if len(rows):
        cursor.close()
        return False
    else:
        cursor.close()
        return True

def subscribe(user_id, topic_id):
    try:
        if isempty_("user_subs", "user_id", "topic_id", user_id, topic_id):
            query = """INSERT into user_subs (user_id,topic_id,status) VALUES(%d,%d,1)"""%(user_id, topic_id)
        else:
            query = """UPDATE user_subs SET status=1 where user_id = %d and topic_id = %d"""%(user_id, topic_id)
            
        cursor = db.cursor(buffered=True)
        cursor.execute(query)
        db.commit()
        cursor.close()
        if isempty("users", "userid", user_id):
            query = """INSERT into users VALUES(%d,0)"""%(user_id)
            cursor = db.cursor(buffered=True)
            cursor.execute(query)
            db.commit()
            cursor.close()
    except:
        pass