import os
import json
import requests
from replit import db

from flask import (
    Flask,
    request,
    send_from_directory,
)
import flask_login as Login
from flask_login import current_user as current
import werkzeug.security as security

from python.user import User

###################################################
# App Configuration
###################################################
# Server mode
mode = os.environ.get('MODE')
if mode is None:
    # Deployment server, statics by reverse proxy
    mode = 'deployment'
    app = Flask(__name__)
else:
    # Replit prod/dev, statics by Flask
    app = Flask(__name__, static_url_path='/dists')

# Server encryption key
if os.environ.get('SECRET_KEY'):
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
else:
    with open('flask.config.json') as config_file:
        app.config['SECRET_KEY'] = json.load(config_file).get('SECRET_KEY')

# App services initiation
auth = Login.LoginManager()
auth.init_app(app)


###################################################
# Login routes
###################################################
def load_user(user_id):
    try:
        return User(user_id, db)
    except ValueError:
        return None


auth.user_loader(load_user)


@auth.unauthorized_handler
def unauthorized():
    responses = {
        '/user': 'Login required for User Information',
        '/log': 'Login required to access Logs',
    }

    # Path substring of the url
    path = '/'.join([''] + request.url.split('/')[3:])

    return {
        'status': 'FAILED',
        'message': responses[path] if path in responses else "Not Logged In"
    }


@app.route('/login')
def login():
    user_id = request.form.get('user_name')
    password = request.form.get('password')
    remember = bool(request.form.get('remember'))
    user = load_user(user_id)

    if user and security.check_password_hash(user['password'], password):
        security.login_user(user, remember=remember)
    else:
        return {
            'status': 'FAILED',
            'message': 'Wrong user name or password',
        }

    # User is created
    user = User(
        user_id,
        db,
        password=security.generate_password_hash(
            password,
            method='sha256',
        ),
    )

    return {
        'status': 'SUCCESS',
        'message': {
            'name': user.get_id,
            'hits': user.data['hits'],
        }
    }


@app.route('/signup', methods=['POST'])
def signup():
    user_id = request.form.get('user_name')
    password = request.form.get('password')

    if load_user(user_id):  # User exists
        return {
            'status': 'FAILED',
            'message': 'User already exists',
        }

    # User is created
    user = User(
        user_id,
        db,
        password=security.generate_password_hash(
            password,
            method='sha256',
        ),
    )

    return {
        'status': 'SUCCESS',
        'message': f'User {user.get_id()} created',
    }


@app.route('/logout')
def logout():
    return 'Logout'


###################################################
# Flask-specific routes
###################################################
# Persistence: logs visits, by user and system-wide
@app.route('/log')
@Login.login_required
def log():
    # Visits by user
    hits = current.get("hits", 0) + 1
    current["hits"] = hits

    # Visits system-wide
    total = db.get('total', 0) + 1
    db['total'] = total

    return {
        'message': {
            'hits': hits,
            'total': db['total'],
        },
        'status': 'success',
    }


# Simple demonstration of user access
@app.route('/user')
@Login.login_required
def user():
    return {
        'status': 'success',
        'message': {
            'name': current.name
        }
    } if current.name else {
        'status': 'success',
        'message': {
            'name': 'Not Logged In'
        }
    }


###################################################
# Static routes by server type
###################################################
if mode == 'development':
    # Dev Server: Proxy other routes to Node.js/Vite server
    ms = ['GET', 'POST', 'DELETE']

    @app.route('/', defaults={'path': ''}, methods=ms)
    @app.route('/<path:path>', methods=ms)
    def proxy(*args, **kwargs):
        # Blind, unopinionated proxy
        url = request.url.replace(
            request.host_url,
            'http://localhost:3000/',
        ).replace(
            '%40',
            '@',
        )

        resp = requests.request(
            **{
                'method': request.method,
                'url': url,
                'headers': dict(request.headers),
                'data': request.get_data(),
                'cookies': request.cookies,
                'json': request.json,
                'auth': request.authorization,
                'files': request.files,
                'allow_redirects': False,
            })

        return (resp.text, resp.status_code, resp.headers.items())

elif mode == 'production':
    # Replit production environment. Statics through Flask.
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def send_js(path):
        if path == '':
            path = 'index.html'
        return send_from_directory('dist/', path)

else:
    # Deployment. Reverse proxy will handle statics.
    pass

###################################################
# Run as __main__, typically Replit environment
###################################################
if __name__ == '__main__':
    if mode == 'development':
        # Replit development mode
        app.run(host='0.0.0.0', port=8080, debug=True)
    else:
        # Possible replit production mode
        app.run(host='0.0.0.0', port=8080)
