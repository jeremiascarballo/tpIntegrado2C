from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import requests, os, ssl, smtplib
from email.message import EmailMessage

app = Flask(__name__)
CORS(app)

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

@app.route('/historico', methods=['GET', 'POST'])
def historico():
    tipo_dolar = request.form.get('dolar_historico', 'oficial')  # Valor por defecto si no se selecciona
    url = f"https://api.argentinadatos.com/v1/cotizaciones/dolares/{tipo_dolar}"
    response = requests.get(url)
    
    if response.status_code == 200:
        data_historico = response.json()
        return render_template('historico.html', data_historico=data_historico)  # Enviar datos si se obtiene respuesta
    else:
        # En caso de error, pasar un mensaje a la plantilla
        return render_template('historico.html', error="No se pudo obtener la información histórica.")



@app.route('/usuario', methods=['POST'])
def usuario():
    mail_user = request.form['mail']

    url = "https://dolarapi.com/v1/dolares"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()

    email_sender = "jeremiascarballo03@gmail.com"
    password = "guks bcpy ppss neww"
    email_reciver = mail_user

    subject = "Informacion Cotizaciones"
    body = f"Información de Cotizaciones:\n\n{data}"

    em = EmailMessage()
    em["from"] = email_sender
    em["to"] = email_reciver
    em["subject"] = subject
    em.set_content(body)

    context = ssl.create_default_context()
   
    with smtplib.SMTP_SSL("smtp.gmail.com",465, context=context) as smtp:
        smtp.login(email_sender,password)
        smtp.sendmail(email_sender,email_reciver,em.as_string())
    return f"Correo enviado a {mail_user}"

if __name__ == '__main__':
    app.run(debug=True)



