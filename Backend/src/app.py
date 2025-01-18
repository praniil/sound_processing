import flask
from flask import jsonify, request
from flask_cors import CORS
import database_conn as db

# Database connection
print("Connected to the database")
cursor = db.connection.cursor()

app = flask.Flask(__name__)
app.config["DEBUG"] = True
CORS(app)
@app.route('/upload-audio', methods=['POST'])
def upload_audio():
    print("inside upload")
    data = request.get_json()
    print(data)
    
# Run the Flask app
if __name__ == '__main__':
    app.run()

# Close the database connection after the server stops
db.connection.close()
