from pymongo import MongoClient
from bson.objectid import ObjectId
from dotenv import load_dotenv
import os
from hashlib import sha256

load_dotenv()
db = MongoClient(os.environ["MONGODB"]).prod

#overwrites anything currently in db and replaces with test data
def set_db_test_data():
    db.users.delete_many({})
    db.assignments.delete_many({})
    User("david", "ab6390fda83e002acd5fc06081305679a3b10cca6b983b7f86e1f9ff6db37b35",
        int(os.environ["DAVIDPHONE"]), "2023-02-13", 5, 3).save()
    User("MatthewFreestone", "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        int(os.environ["MATTHEWPHONE"]), "2023-02-13", 5, 3).save()
    User("caden", "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        int(os.environ["CADENPHONE"]), "2023-02-13", 5, 3).save()
    User("joshua", "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        int(os.environ["CADENPHONE"]), "2023-02-13", 5, 3).save()

    Assignment("MatthewFreestone", "Cloud Quiz", "COMP5530", "2023-02-15").save()
    Assignment("MatthewFreestone", "Problem Set #2", "STAT6660", "2023-02-18").save()
    Assignment("MatthewFreestone", "Midterm Paper", "ENGL2200", "2023-02-17").save()
    Assignment("MatthewFreestone", "Group Project #3", "COMP5530", "2023-02-19").save()
    Assignment("MatthewFreestone", "Midterm Exam - ProctorU", "COMP4320", "2023-02-16").save()
    Assignment("MatthewFreestone", "HW #2- TCP/IP", "COMP4320", "2023-02-15").save()
    Assignment("david", "Small Quiz", "COMP", "2023-02-16").save()
    Assignment("david", "Coding", "COMP", "2023-02-17").save()
    Assignment("david", "Big Paper", "ENGL", "2023-02-18").save()
    Assignment("david", "Essay Quiz", "ENGL", "2023-02-18").save()
    Assignment("david", "Problem Set", "MATH", "2023-02-15").save()

class ABCDatabasable:
    def __init__(self, a, *args):
        if isinstance(a, dict):
            self._from_dict(a)
        else:
            self._from_scratch(a, *args)

    #builds the object from a database entry
    def _from_dict(self, db_entry):
        for k in db_entry:
            self.__dict__[k] = db_entry[k]

    #up to the object- normal build for a new instance
    def _from_scratch(self, *args):
        raise NotImplementedError()

    def dict(self, include_id=True):
        d = self.__dict__
        if "_id" in d:
            if include_id:
                d["_id"] = str(d["_id"])
            else:
                del d["_id"]
        return d

    def json(self):
        return self.dict(self.id_in_json)

    def save(self):
        if "_id" in self.__dict__:
            db[self.collection_name].update_one({"_id": ObjectId(self._id)}, {"$set": self.dict(False)})
        else:
            db[self.collection_name].insert_one(self.__dict__)

class User(ABCDatabasable):
    collection_name = "users"
    id_in_json = False

    def _from_scratch(self, username, passwordhash, phone, anchor, work_days, vacation_days):
        self.username = username
        self.passwordhash = passwordhash
        self.phone = phone
        self.anchor = anchor
        self.work_days = work_days
        self.vacation_days = vacation_days
        self.set_percents(work_days)

    def set_percents(self, days):
        extra = 100%days
        self.percents = [100//days + (1 if i<extra else 0) for i in range(days)]

    def set_calendar(self, anchor, work_days, vacation_days):
        self.anchor = anchor
        self.vacation_days = vacation_days
        if self.work_days != work_days:
            self.set_percents(work_days)
            self.work_days = work_days

    @classmethod
    def find(cls, username):
        db_entry = db.users.find_one({"username": username})
        return None if db_entry is None else cls(db_entry)

    @classmethod
    def is_valid(cls, username, password):
        user = cls.find(username)
        return user is not None and sha256(password.encode("utf-8")).hexdigest()==user.passwordhash

class Assignment(ABCDatabasable):
    collection_name = "assignments"
    id_in_json = True
    
    def _from_scratch(self, user, name, course, due_date, difficulty=1, splittable=True):
        self.user = user
        self.name = name
        self.course = course
        self.due_date = due_date
        self.difficulty = difficulty
        self.splittable = splittable

    def day(self, anchor):
        _, m1, d1 = map(int, anchor.split("-"))
        _, m2, d2 = map(int, self.due_date.split("-"))
        self.max_day = d2 - d1 + (28 if m2>m1 else 0)
        if self.splittable:
            self.left = 5

    @classmethod
    def find(cls, ID, username):
        db_entry = db.assignments.find_one({"_id": ObjectId(ID), "user": username})
        return None if db_entry is None else cls(db_entry)

    @classmethod
    def find_all(cls, username):
        return sorted(list(map(cls, db.assignments.find({"user": username}))), key=lambda x:x.due_date)
