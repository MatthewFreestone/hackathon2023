import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()

account_sid = "AC9ffa5193036b9810de8cefd826deba4d"
auth_token = os.environ['TWILIO']
client = Client(account_sid, auth_token)


def text(phone_number: int, message: str):
    message = client.messages \
        .create(
        body=message,
        from_='+18555051821',
        to="+1" + str(phone_number)
    )
