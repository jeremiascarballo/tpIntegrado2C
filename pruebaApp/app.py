from flask import Flask, render_template, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)
# Ruta para obtener datos de la API externa
def obtener_datos_cotizacion(cotizacion="dolar"):
    url = "https://dolarapi.com/v1/dolares"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return None

@app.route('/datos_cotizacion/<cotizacion>')
def datos_cotizacion(cotizacion):
    datos = obtener_datos_cotizacion(cotizacion)
    if datos:
        return jsonify(datos)
    else:
        return jsonify({"error": "No se pudieron obtener los datos"}), 500



@app.route('/')
def index():
    return render_template('index.html')

@app.route('/historico')
def historico():
    return render_template('historico.html')

if __name__ == '__main__':
    app.run(debug=True)
