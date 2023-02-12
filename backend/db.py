from pymongo import MongoClient
from dotenv import load_dotenv
import os
from hashlib import sha256

load_dotenv()
db = MongoClient(os.environ["MONGODB"]).prod

#overwrites anything currently in db and replaces with test data
def set_db_test_data():
    db.users.delete_many({})
    db.assignments.delete_many({})
    User("david", "ab6390fda83e002acd5fc06081305679a3b10cca6b983b7f86e1f9ff6db37b35", "2023/03/13", 5, 3).save()
    User("matthew", "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", "2023/03/13", 5, 3).save()
    User("joshua", "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", "2023/03/13", 5, 3).save()
    User("caden", "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", "2023/03/13", 5, 3).save()

    Assignment("matthew", "Cloud Quiz", "COMP5530", "2023/03/15").save()
    #Assignment("matthew", "Problem Set #2", "MATH", "2023/03/15")
    #Assignment("matthew", "Midterm Paper", "COMP5530", "2023/03/17")

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

class User(ABCDatabasable):
    def _from_scratch(self, username, passwordhash, anchor, work, vacation):
        self.username = username
        self.passwordhash = passwordhash
        self.anchor = anchor
        self.work = work
        self.vacation = vacation

    def json(self):
        json = self.__dict__.copy()
        if "_id" in self.json:
            del json["_id"]
        return json

    def save(self):
        if "_id" in self.__dict__:
            db.users.update_one({"user": self.username}, {"$set": self.json()})
        else:
            db.users.insert_one(self.__dict__)

    @classmethod
    def find(cls, username):
        db_entry = db.users.find_one({"username": username})
        return None if db_entry is None else cls(db_entry)

    @classmethod
    def is_valid(cls, username, password):
        user = cls.find(username)
        return user is not None and sha256(password.encode("utf-8")).hexdigest()==user.passwordhash

class Assignment(ABCDatabasable):
    def _from_scratch(self, user, name, course, due_date):
        self.user = user
        self.name = name
        self.course = course
        self.due_date = due_date
        self.difficulty = 1

    def json(self):
        return self.__dict__

    def save(self):
        db.assignments.insert_one(self.__dict__)

    @classmethod
    def find_all(cls, username):
        return list(map(db.assignments.find({"user": username})))

if __name__=="__main__":
    print(User.is_valid("matthew", "password"))
    #set_db_test_data()
    #print(Assignment.find_all("matthew"))