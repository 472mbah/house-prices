from flask import Flask, request, jsonify
from flask_cors import CORS
import assistant
app = Flask(__name__)

CORS(app)
cors = CORS(app, resources={
	
	f'/*': {
		"origins":"*"
	}


})


@app.route('/hello')
def hello():
    return "wagwan!"

@app.route('/retrieve-meta', methods=['GET'])
def retrieve_meta_information ():
    data = assistant.return_meta_information()
    response = jsonify(data)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/predict_home_prices', methods=['POST'])
def predict():

    assistant.load_saved_artifacts()
    
    availability = float(request.form['availability']) 
    size = float(request.form['size']) 
    total_sqft = float(request.form['total_sqft']) 
    bath = float(request.form['bath']) 
    balcony = float(request.form['balcony']) 
    area = request.form['area']
    location = request.form['location']

    answer = assistant.make_prediction([ availability, size, total_sqft, bath, balcony, area, location])
    response = jsonify({ 'predicted_price': answer})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == '__main__':
    print('Python server has started')
    app.run()


