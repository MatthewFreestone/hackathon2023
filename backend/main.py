from flask import Flask

app=Flask("")

@app.route("/")
def home():
	return "hello world"

app.run(host='0.0.0.0')	