from flask import Flask, request
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

print(os.environ["TEST"])
#db = MongoClient()
app=Flask("")

@app.route("/")
def home():
    return "hello world"

@app.route("/loaddata", methods=["GET"])
def load_data():
    args = request.args
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


#app.run(host='0.0.0.0', port=80)	

