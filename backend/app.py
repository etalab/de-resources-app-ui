#!flask/bin/python
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import random, string

app = Flask(__name__)

CORS(app)

df = pd.read_csv("./static/dep.csv",dtype=str)

@app.route('/')
def index():
    return "Hello, World!"


@app.route('/enrich', methods=['POST', 'GET'])
def enrich():
    if request.method == 'POST':
        body = request.json
        print(body)

        print(body['url'])

        df2 = pd.read_csv(body['url'], sep=";", dtype=str)

        print(df2.shape)

        for obj in body['dep']:
            if(obj['detect'] == True):
                print(obj['head'])

                df3 = df
                pivot = obj['head']
                df3 = df3.rename(columns={'code_departement': pivot})

        df4 = pd.merge(df2,df3,on=pivot,how='left')

        print(df4.shape)        
        
        x = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(16))

        df4.to_csv("./static/"+x+".csv",index=False)
        
        rep = {}
        rep['status'] = "All good"
        rep['new_url'] = x+".csv"
        return jsonify(rep)
    else:
        return "get"

if __name__ == '__main__':
    app.run(debug=True, port=5555)
