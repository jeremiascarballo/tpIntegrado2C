from flask import Flask, render_template, jsonify, request
import requests, json
from datetime import datetime
from dateutil import parser 
from dolar import Casa

app = Flask(__name__)

data_historico_completo = None

@app.route('/datos_cotizacion/')
def datos_cotizacion():
    url = "https://dolarapi.com/v1/dolares"
    response = requests.get(url)
    
    if response.status_code == 200:
        datos = response.json()
        info_dolar = []

        for item in datos:
            fecha_original = "2024-11-15T15:05:00.000Z"
            fecha_formateada = datetime.strptime(fecha_original, '%Y-%m-%dT%H:%M:%S.%fZ').strftime('%Y/%m/%d %H:%M')
            Dolar = Casa(
                nombre_dolar=item.get('moneda'),
                nombre=item.get('nombre'),
                compra=item.get('compra'),
                venta=item.get('venta'),
                fecha=fecha_formateada
            )
            info_dolar.append({
                'moneda': Dolar.mostrar_dolar(),
                'nombre': Dolar.mostrar_nombre(),
                'compra': Dolar.mostrar_compra(),
                'venta': Dolar.mostrar_venta(),
                'fecha': Dolar.mostrar_fecha()
            })
        return jsonify(info_dolar), 200
    else:
        return jsonify({'error': 'No se pudieron obtener las cotizaciones'}), 500

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/historico', methods=['GET'])
def historico():
    global data_historico_completo
    fecha_cotizacion = request.args.get('fecha_cotizacion')
    tipo_dolar = request.args.get('dolar_historico', 'oficial')
    
    if fecha_cotizacion:
        try:
            fecha_cotizacion = datetime.strptime(fecha_cotizacion, '%Y-%m-%d').strftime('%Y/%m/%d')
            url = f"https://api.argentinadatos.com/v1/cotizaciones/dolares/{tipo_dolar}/{fecha_cotizacion}"
        except ValueError:
            return render_template('historico.html', error="El formato de la fecha no es válido.")
    else:
        url = f"https://api.argentinadatos.com/v1/cotizaciones/dolares/{tipo_dolar}"

    response = requests.get(url)
    
    if response.status_code == 200:
        data_historico_completo = response.json()
        return render_template('historico.html', data_historico_completo=data_historico_completo)
    else:
        return render_template('historico.html', error="No se pudo obtener la información histórica.")

@app.route('/datos_cotizacion_historico/')
def datos_cotizacion_historico():
    return jsonify(data_historico_completo)

@app.route('/usuario', methods=['POST'])
def mail():
    name_user = request.form.get('nombre_usuario')
    mail_user = request.form.get('mail')

    url = "https://dolarapi.com/v1/dolares"
    response = requests.get(url)

    if response.status_code == 200:
        datos = response.json()
        body = (
             f'Hola! {name_user}, estas son las cotizaciones en su última actualización:\n\n')
        Dolar = None
        for item in datos:
            fecha_original = "2024-11-15T15:05:00.000Z"
            fecha_formateada = datetime.strptime(fecha_original, '%Y-%m-%dT%H:%M:%S.%fZ').strftime('%Y/%m/%d %H:%M')
            Dolar = Casa(
                nombre_dolar=item.get('moneda'),
                nombre=item.get('nombre'),
                compra=item.get('compra'),
                venta=item.get('venta'),
                fecha=fecha_formateada
            )
            body += (

                f'Nombre: {Dolar.mostrar_nombre()}\n'
                f'Compra: {Dolar.mostrar_compra()}\n'
                f'Venta: {Dolar.mostrar_venta()}\n'
                f'Fecha: {Dolar.mostrar_fecha()}\n\n'
            )

        data_mail = {
            'service_id': 'service_zg20zgo',
            'template_id': 'cotizacion',
            'user_id': 'TJvm6_Vmduhh7oBpA',
            'accessToken': 'PKmB7KvFf1Bt3XOxeNnUW',
            'template_params': {
                'user_mail': mail_user,
                'from_name': 'CotizacionesUtn',  
                'to_name': name_user,
                'message': body
            }
        }

        headers = {
            'Content-Type': 'application/json',
            'user-agent': 'mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-language': 'en-US,en;q=0.9',
            'Origin': 'https://127.0.0.1:5000/',
            'Referer': 'https://127.0.0.1:5000/'
        }

        try:
            response = requests.post(
                'https://api.emailjs.com/api/v1.0/email/send',
                data=json.dumps(data_mail), 
                headers=headers
            )
            response.raise_for_status()
            print('Su mail ha sido enviado!')
            return "Correo enviado con éxito", 200
        except requests.exceptions.RequestException as e:
            print(f'Error al enviar el correo: {e}')
            return f"Error al enviar el correo: {e}", 500  

if __name__ == '__main__':
    app.run(debug=True)
