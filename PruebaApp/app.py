from flask import Flask, render_template, jsonify
import requests

app = Flask(__name__)

@app.route('/index', methods=['GET'])
def home():
    try:
        response_dolares = requests.get('https://dolarapi.com/v1/dolares')
        
        if response_dolares.status_code == 200:
            cotizaciones = response_dolares.json()
        else:
            cotizaciones = {"error": "No se pudo obtener los datos. Código de error: " + str(response_dolares.status_code)}
    
    except requests.RequestException as e:
        cotizaciones = {"error": "Ocurrió un error al conectar con la API: " + str(e)}

    try:
        response_otros = requests.get('https://dolarapi.com/v1/cotizaciones')
        
        if response_otros.status_code == 200:
            cotizacionesOtros = response_otros.json()
        else:
            cotizacionesOtros = {"error": "No se pudo obtener los datos. Código de error: " + str(response_otros.status_code)}
    
    except requests.RequestException as e:
        cotizacionesOtros = {"error": "Ocurrió un error al conectar con la API: " + str(e)}

    return render_template('index.html',cotizaciones=cotizaciones, cotizacionesOtros=cotizacionesOtros)

@app.route('/historico', methods=['GET'])
def historico():
    try:
        response_historico_dolares = requests.get('https://api.argentinadatos.com/v1/cotizaciones/dolares/{casa}/{fecha}')
        
        if response_historico_dolares.status_code == 200:
            historico_cotizaciones = response_historico_dolares.json()
        else:
            historico_cotizaciones = {"error": "No se pudo obtener los datos. Código de error: " + str(response_historico_dolares.status_code)}
    
    except requests.RequestException as e:
        historico_cotizaciones = {"error": "Ocurrió un error al conectar con la API: " + str(e)}

    return render_template('historico.html', historico_cotizaciones=historico_cotizaciones)

if __name__ == '__main__':
    app.run(debug=True)