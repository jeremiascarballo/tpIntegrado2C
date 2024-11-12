from flask import Flask, render_template, jsonify
import requests

app = Flask(__name__)

@app.route('/index', methods=['GET'])
def home():
    try:
        response_dolares = requests.get('https://dolarapi.com/v1/dolares')
        
        if response_dolares.status_code == 200:
            cotizaciones = response_dolares.json()

            print(f"-"*80)
            print(f"Moneda: \tNombre: \tCompra: \tVenta: \t")
            print(f"-"*80)

            for tipo_cambio in cotizaciones:
                moneda = tipo_cambio.get('moneda')
                casa = tipo_cambio.get('casa')
                compra = tipo_cambio.get('compra')
                venta = tipo_cambio.get('venta')
                fecha_actualizacion = tipo_cambio.get('fecha_actualizacion')
                print(f"{moneda}\t\t{casa}\t\t{compra}\t\t{venta}\t\n")
            
            print(f"-"*80)
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


if __name__ == '__main__':
    app.run(debug=True)