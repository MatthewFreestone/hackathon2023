class Assignment:
    def __init__(self, name, course, due_date, difficulty = 1):
        self.name = name
        self.course = course
        self.difficulty = difficulty
        self.due_date = due_date

class User:
    def __init__(self, name, anchor, work, vacation):
        self.name = name
        self.anchor = anchor
        self.work = work
        self.vacation = vacation
        self.assignments = []

