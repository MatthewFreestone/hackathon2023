from flask import Flask, request
from flask_cors import CORS
from db import Assignment, User, set_db_test_data
from sms import text
from token_auth import encode, decode
from openai_responses import get_congrats_message, get_encourage_message
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask("")
CORS(app)

@app.route("/")
def home():
    return "hello world"


@app.route("/login")
def login():
    args = request.args
    if not User.is_valid(args.get("username"), args.get("password")):
        return {"error": "Invalid username/password"}
    return {"token": encode(args.get("username"))}


@app.route("/resetdb")
def reset_db():
    set_db_test_data()
    return "db has been reset"


@app.route("/loaddata", methods=["GET"])
def load_data():
    args = request.args
    valid, username = decode(args.get("token"))
    if not valid:
        return {"error": "Invalid token"}
    user = User.find(username)
    if user is None:
        return {"error": "Unknown user"}
    return {"user": user.json(), "assignments": [a.json() for a in Assignment.find_all(user.username)]}


@app.route("/setdifficulty", methods=["POST"])
def set_difficulty():
    args = request.args
    valid, username = decode(args.get("token"))
    if not valid:
        return {"error": "Invalid token"}
    assignment = Assignment.find(args.get("id"), username)
    if assignment is None:
        return {"error": "Invalid id"}
    assignment.difficulty = int(args.get("difficulty"))
    assignment.save()
    return assignment.json()


@app.route("/setpercentages", methods=["POST"])
def set_percentage():
    args = request.args
    valid, username = decode(args.get("token"))
    if not valid:
        return {"error": "Invalid token"}
    user = User.find(username)
    if user is None:
        return {"error": "Unknown user"}

    user.percents = list(map(int, args.get("percentages").split(",")))
    user.save()
    return user.json()


@app.route("/setcalendar", methods=["POST"])
def set_calendar():
    args = request.args
    valid, username = decode(args.get("token"))
    if not valid:
        return {"error": "Invalid token"}
    user = User.find(username)
    if user is None:
        return {"error": "Unknown user"}

    user.set_calendar(args.get("anchor"), int(args.get("work_days")), int(args.get("vacation_days")))
    user.save()
    return user.json()


@app.route("/getrecschedule", methods=["GET"])
def get_recommended_schedule():
    args = request.args
    return "Getting schedule for {username} with the token {token}".format(username=args.get("username"),
                                                                           token=args.get("token"))


app.run(host='0.0.0.0', port=int(os.environ["PORT"]))
