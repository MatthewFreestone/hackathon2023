import random

import openai
import os

openai.api_key = os.getenv("OPENAI")


def get_encourage_message():
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt="Give me a short encouraging message about getting my homework done today",
        max_tokens=70,
        temperature=random.random() * 2
    )
    return response["choices"][0]["text"]


def get_congrats_message():
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt="Give me a short congratulatory message about getting my homework done today",
        max_tokens=70,
        temperature=random.random() * 2
    )
    return response["choices"][0]["text"]
