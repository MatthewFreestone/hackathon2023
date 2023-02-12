from flask import Flask, request
from db import Assignment, User, set_db_test_data
from sms import text
from token_auth import encode, decode
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask("")


@app.route("/")
def home():
    # For texting
    # text(2567443336, "this is a test message.")

    # For encoded and decoded tokens
    # args = request.args
    # username = args.get("username")
    # encoded = encode(username)
    # decoded = decode(encoded)
    #return str(encoded) + " : " + str(decoded)

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
    valid, user = decode(args.get("token"))
    if not valid:
        return {"error": "Invalid token"}
    assignment = Assignment.find(args.get("id"), user)
    if assignment is None:
        return {"error": "Invalid id"}
    assignment.difficulty = int(args.get("difficulty"))
    assignment.save()
    return assignment.json()


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
