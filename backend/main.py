from flask import Flask, request, render_template, send_from_directory
from flask_cors import CORS
from db import Assignment, User, set_db_test_data
from sms import text
from token_auth import encode, decode
from openai_responses import get_congrats_message, get_encourage_message
from sorting import newSortAssignments
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__, static_folder="out/", static_url_path="", template_folder="out/")
CORS(app)

@app.route("/")
def home():
    #return "hello world"
    return render_template("index.html")
    return send_from_directory(app.static_folder, "index.html")

@app.route("/admin")
def admin():
    return render_template("admin.html")

@app.route("/login", methods=["GET", "POST"])
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


@app.route("/setassignments", methods=["POST"])
def set_assignments():
    args = request.args
    valid, username = decode(args.get("token"))
    if not valid:
        return {"error": "Invalid token"}
    ids = args.get("ids").split(",")
    difficulties = list(map(int, args.get("difficulties").split(",")))
    splittables = list(map(lambda x:x=="true", args.get("splittables").split(",")))
    
    for i in range(len(ids)):
        assignment = Assignment.find(ids[i], username)
        assignment.difficulty = difficulties[i]
        assignment.splittable = splittables[i]
        assignment.save()
    return {"success": True}


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


@app.route("/getschedule", methods=["GET"])
def get_recommended_schedule():
    args = request.args
    valid, username = decode(args.get("token"))
    if not valid:
        return {"error": "Invalid token"}
    user = User.find(username)
    if user is None:
        return {"error": "Unknown user"}

    assignments = Assignment.find_all(username)
    for a in assignments:
        a.day(user.anchor)
    return newSortAssignments(assignments, user.percents)


@app.route("/sendmorningmessage", methods=["GET"])
def send_morning_message():
    args = request.args
    valid, user = decode(args.get("token"))
    if not valid:
        return {"error": "Invalid token"}
    cur_user = User.find(user)
    text(cur_user.phone, get_encourage_message())
    return "Success"

@app.route("/sendeveningmessage", methods=["GET"])
def send_evening_message():
    args = request.args
    valid, user = decode(args.get("token"))
    if not valid:
        return {"error": "Invalid token"}
    cur_user = User.find(user)
    text(cur_user.phone, get_congrats_message())
    return "Success"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 8080)))
