import os
from flask import Flask, request, jsonify, redirect, url_for, session, render_template
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth
from openai import OpenAI
from dotenv import load_dotenv
import json

# Cargar claves del archivo .env
load_dotenv()
app = Flask(__name__)
CORS(app)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

appConf ={
    "client_id": os.getenv("CLIENT_ID"),
    "client_secret": os.getenv("CLIENT_SECRET"),
    "meta_url": "https://accounts.google.com/.well-known/openid-configuration",
    "flask_secret": os.getenv("FLASK_SECRET"),
    "flask_port": 5000
}

app.secret_key = appConf["flask_secret"]

oauth = OAuth (app)

oauth.register(
    name='myapp',
    client_id=appConf["client_id"],
    client_secret=appConf["client_secret"],
    server_metadata_url=appConf["meta_url"],
    client_kwargs={
        'scope': 'openid email profile'
    }
)


@app.route('/')
def home():
    return render_template("home.html", session=session.get("user"), pretty= json.dumps (session.get("user"), indent=4))


@app.route('/login')
def login():
    return oauth.myapp.authorize_redirect(redirect_uri= url_for('googleCallback', _external=True))

@app.route('/login/google/authorized')
def googleCallback():
      token = oauth.myapp.authorize_access_token()
      user_info= oauth.myapp.get("https://openidconnect.googleapis.com/v1/userinfo").json()

      session["user"] = user_info

    # Opcional: print para ver qué devuelve
      print(json.dumps(user_info, indent=2))

      return redirect("http://localhost:5173")

@app.route("/api/me")
def me():
    user = session.get("user")
    if user:
        return jsonify({
            "name": user.get("name"),
            "email": user.get("email"),
            "picture": user.get("picture")
        })
    return jsonify({"error": "Unauthorized"}), 401



   

# Inicializar cliente de OpenAI
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

# Ruta de sugerencias de películas
@app.route('/suggest', methods=['POST'])
def suggest_movies():
    data = request.get_json()
    prompt = data.get("prompt")
    favorites = data.get("favorites", [])

    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400

    context = f"""
Eres un recomendador de películas. El usuario tiene estas películas como favoritas: {', '.join(favorites)}.
Basado en eso, sugiere películas que le podrían gustar relacionadas con su mensaje: "{prompt}"
"""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Recomienda películas personalizadas según los gustos del usuario."},
                {"role": "user", "content": context}
            ]
        )
        suggestion = response.choices[0].message.content
        return jsonify({'suggestion': suggestion})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Ejecutar servidor
if __name__ == "__main__":
    app.run(debug=True)

