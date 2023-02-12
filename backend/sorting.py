from db import Assignment, User
from collections import defaultdict
import random

def sortAssignments(assignments, datePercents):
    targetPercents = [(x, i) for (i, x) in enumerate(datePercents)]
    targetPercents.sort(key=lambda x: x[0])

    assignDifficulties = [(x.difficulty, x.due_date, i) for (i, x) in enumerate(assignments)]
    assignDifficulties.sort(key = lambda x: x[0], reverse=True)

    currentValue = [0 for _ in range(len(datePercents))]

    dailyAssignments = defaultdict(list)
    total = sum([x[0] for x in assignDifficulties])
    
    for assign in assignDifficulties:
        dif = assign[0]
        due = assign[1]
        selectedDate = targetPercents[-1][1]
        for (percent, index) in targetPercents:
            if index > due:
                continue
            
            if ((currentValue[index] + dif) * 100.0 / total) < percent:
                selectedDate = index
                break
            
        currentValue[selectedDate] += dif
        dailyAssignments[selectedDate].append(assign)

    return (currentValue, total, dailyAssignments)

if __name__ == "__main__":
    datePercents = [10, 50, 0, 25, 15]
    assignments = []
    for i in range(10):
        assignments.append(Assignment(str(i), "test", random.randint(1, 8), random.randint(1,100)))

    (dailyTotals, total, dailyAssignments) = sortAssignments(assignments, datePercents)
    print(datePercents)
    print(str([i * 100 / total for i in dailyTotals]))
    print(dailyAssignments)
