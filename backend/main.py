from flask import Flask, request
from db import Assignment, User, set_db_test_data
from sms import text
from dotenv import load_dotenv
import os

load_dotenv()
app=Flask("")

@app.route("/")
def home():
    #text(2567443336, "this is a test message.")
    return "hello world"

@app.route("/resetdb")
def reset_db():
    set_db_test_data()
    return "db has been reset"

@app.route("/loaddata", methods=["GET"])
def load_data():
    args = request.args
    user = User.find(args.get("username"))
    print(user)
    return {"user": user.json(), "assignments": [a.json() for a in Assignment.find_all(user.name)]}


@app.route("/setdifficulty", methods=["POST"])
def set_difficulty():
    args = request.args
    return "Set difficultly of id: " + str(args.get("id")) + " to difficulty: " + str(args.get("difficulty"))


@app.route("/setpercentage", methods=["POST"])
def set_percentage():
    args = request.args
    return "Set day: " + str(args.get("day")) + " to percentage: " + str(args.get("percentage"))


@app.route("/setcalendar", methods=["POST"])
def set_calendar():
    args = request.args
    return """Set anchor: {anchor} with num of work days as: {work_days} and
            num of vacation days as: {vac_days}""".format(anchor=args.get("anchor"),
                                                              work_days=args.get("workdays"),
                                                              vac_days=args.get("vacdays"))


@app.route("/getrecschedule", methods=["GET"])
def get_recommended_schedule():
    args = request.args
    return "Getting schedule for {username} with the token {token}".format(username=args.get("username"),
                                                                           token=args.get("token"))

app.run(host='0.0.0.0', port=int(os.environ["PORT"]))
