import requests


def send_request():
    base_url = 'https://auburn.instructure.com'
    access_token = input("Enter access token: ")
    db_name = input("enter db name: ")
    headers = {"Authorization": "Bearer " + access_token}
    enrollments = requests.get(base_url + "/api/v1/users/self/enrollments", headers=headers)
    assignment_list = []
    for i in range(len(enrollments.json())):
        course_id = enrollments.json()[i]["course_id"]
        course = requests.get(base_url + "/api/v1/courses/{course_id}".format(course_id=course_id), headers=headers)
        named = course.json()["name"]
        assignments = requests.get(
            base_url + "/api/v1/users/self/courses/{course_id}/assignments".format(course_id=course_id),
            headers=headers)

        for j in range(len(assignments.json())):
            due_dates = str(" " + assignments.json()[j]["due_at"][:10]).replace("-", "/")
            name = str(" " + assignments.json()[j]["name"])
            course_name = name
            assignment_list.append((due_dates, named, course_name))

    assignment_list.sort()
    code_list = ""
    for assignment in assignment_list:
        code_list += f"Assignment('{db_name}','{assignment[1]}','{assignment[2]}','{assignment[0]}').save()\n"
    return code_list


if __name__ == "__main__":
    print(send_request())