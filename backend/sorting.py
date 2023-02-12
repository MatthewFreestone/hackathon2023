from db import Assignment, User
from collections import defaultdict

def sortAssignments(assignments, datePercents):
    targetPercents = [(x, i) for (i, x) in enumerate(datePercents)]
    targetPercents.sort(key=lambda x: x[0])

    assignDifficulties = [(x.difficulty, x.due_date, i) for (i, x) in enumerate(assignments)]
    assignDifficulties.sort(key = lambda x: x[0], reverse=True)

    currentValue = [0 for _ in range(len(datePercents))]

    dailyAssignments = defaultdict(list)
    total = sum([x[0] for x in assignDifficulties]) * 1.33
    
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

def newSortAssignments(assignments, percents):
    total_diff = sum(a.difficulty for a in assignments)
    target_diffs = [total_diff*p/100 for p in percents]
    answer = {i:[] for i in range(len(percents))}

    for a in filter(lambda x:not x.splittable, assignments):
        i = max((i for i in range(min(a.max_day+1, len(target_diffs)))), key=lambda i:target_diffs[i])
        answer[i].append(f'{a.name} ({a.course})')
        target_diffs[i] -= a.difficulty

    tasks = list(filter(lambda x:x.splittable, assignments))
    day, task = 0, 0
    while task<len(tasks):
        while day<len(target_diffs)-1 and target_diffs[day]<0 and day<tasks[task].max_day:
            day += 1
        if day==tasks[task].max_day or day==len(target_diffs)-1: #gotta put it all here
            if tasks[task].left<5: #percentage
                answer[day].append(f'{20*tasks[task].left}% of {tasks[task].name} ({tasks[task].course})')
                target_diffs[day]-=tasks[task].difficulty*tasks[task].left/5
            else: #whole task
                answer[day].append(f'{tasks[task].name} ({tasks[task].course})')
                target_diffs[day]-=tasks[task].difficulty
            task+=1
        else: #can put part of it if needed
            fifths = min(closest_fifth(tasks[task].difficulty, target_diffs[day]), tasks[task].left)
            if fifths==0: #no room
                day += 1
            elif fifths<5: #percentage
                answer[day].append(f'{20*fifths}% of {tasks[task].name} ({tasks[task].course})')
                target_diffs[day]-=tasks[task].difficulty*fifths/5
                tasks[task].left -= fifths
                if tasks[task].left==0:
                    task += 1
                else:
                    day += 1
            else: #whole task
                answer[day].append(f'{tasks[task].name} ({tasks[task].course})')
                target_diffs[day]-=tasks[task].difficulty
                task += 1

    return answer

LEGAL_RATIOS = [0, 1, 2, 3, 4, 5]  #out of 5
def closest_fifth(difficulty, target):
    return min(LEGAL_RATIOS, key=lambda x:abs(x*difficulty/5 - target))

if __name__=="__main__":
    tasks = [
        Assignment("david", "Small Quiz", "COMP", "2023-02-16", 1, False),
        Assignment("david", "Coding", "COMP", "2023-02-17", 5),
        Assignment("david", "Big Paper", "ENGL", "2023-02-18", 10),
        Assignment("david", "Essay Quiz", "ENGL", "2023-02-18", 3, False),
        Assignment("david", "Problem Set", "MATH", "2023-02-15", 10)
    ]
    tasks.sort(key=lambda x:x.due_date)
    percents = [30, 30, 20, 10, 10]
    anchor = "2023-02-13"
    for a in tasks:
        a.day(anchor)
    print(newSortAssignments(tasks, percents))
