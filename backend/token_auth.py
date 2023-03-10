import jwt
from uuid import uuid4

from jwt import InvalidTokenError

key = uuid4().hex


def encode(username: str):
    return jwt.encode({"username": username}, key, algorithm="HS256")


def decode(token_in: str):
    try:
        username = jwt.decode(token_in, key, algorithms=["HS256"])["username"]
        return True, username
    except InvalidTokenError:
        return False, None
