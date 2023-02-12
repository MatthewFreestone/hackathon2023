from flask import Flask, request
from db import Assignment, User
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

@app.route("/loaddata", methods=["GET"])
def load_data():
    args = request.args
    user = User.find(args.get("username"))
    print(user)
    return "Loaded Data for " + args.get("username")


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


@app.route("/login", methods=["GET"])
def login():
    args = request.args
    username = args.get("username")
    password = args.get("password")
    # if User.is_valid(username, password):
    #   return encode(username)
    # else
    #   return {"username: "", "status": "invalid_credentials"}
    return "Loaded Data for " + args.get("username")


app.run(host='0.0.0.0', port=int(os.environ["PORT"]))
