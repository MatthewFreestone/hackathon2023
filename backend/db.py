from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
db = MongoClient(os.environ["MONGODB"]).prod

class ABCDatabasable:
    def __init__(self, a, *args):
        if isinstance(a, dict):
            self._from_dict(a)
        else:
            self._from_scratch(a, *args)

    #builds the object from a database entry
    def _from_dict(self, db_entry):
        for k in db_entry:
            if k!="_id":
                self.__dict__[k] = db_entry[k]

    #up to the object- normal build for a new instance
    def _from_scratch(self, *args):
        raise NotImplementedError()

class User(ABCDatabasable):
    def _from_scratch(self, name, anchor, work, vacation):
        self.name = name
        self.anchor = anchor
        self.work = work
        self.vacation = vacation

    @classmethod
    def find(cls, username):
        db_entry = db.users.find_one({"name": username})
        return None if db_entry is None else cls(db_entry)

class Assignment(ABCDatabasable):
    def _from_scratch(self, user, name, course, due_date):
        self.user = user
        self.name = name
        self.course = course
        self.due_date = due_date
        self.difficulty = 1
