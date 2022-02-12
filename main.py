import os
import json
import requests

from flask import (
    Flask,
    request,
    send_from_directory,
)

import mongoengine
import flask_login as login

from python.db import get_user, User, Global, initialize

###################################################
# App Configuration
###################################################
# Server mode

mode = os.environ.get('MODE') or 'deployment'

if mode == 'deployment':
    # Deployment server, actual mongodb
    app = Flask(__name__)
else:
    # Replit prod/dev, db by mongomock, statics by Flask
    app = Flask(__name__, static_url_path='/dist')

# Environment options for the app are acquired
def get_key(key, default=''):
    if os.environ.get(key):
        app.config[key] = os.environ.get(key)
    else:
        with open('scripts/options.json') as config_file:
            app.config[key] = json.load(config_file).get(
                key, default
            )
for k,v in {
    'SECRET_KEY'      : 'KEEPITSECRETkeepitsafe',
    'COOKIE_LIFESPAN' : {'months': 12},
    'MONGODB_USERNAME': 'mongo',
    'MONGODB_PASSWORD': 'mongo',
    }.items():
    get_key(k,v)

# Database connection is acquired
if mode == 'deployment':
    # Deployment server, actual mongodb
    db = mongoengine.connect(host=f"mongodb://{app.config['MONGODB_USERNAME']}:{app.config['MONGODB_PASSWORD']}@db:27017/db")
else:
    # Replit prod/dev, db by mongomock, statics by Flask
    db = mongoengine
    db.connect("test", host="mongomock://localhost")

# App services initiation
login_manager = login.LoginManager()
login_manager.init_app(app)
login_manager.user_loader(get_user)
@login_manager.unauthorized_handler
def unauthorized_handler():
    return 'Unauthorized'

###################################################
# Login routes
###################################################
@app.route('/signin', methods=['POST'])
def signin():
    req = request.get_json(force=True)
    username = req.get('username', None)
    password = req.get('password', None)
    user = get_user(username, password)

    if user:
        login.login_user(user)
        return {
            'status': 'SUCCESS',
            'message': {
                'username': f'Signed in as {user["username"]}'
            }
        }
    return {
        'status': 'FAILED',
        'message': 'Incorrect user name or password'
    }

@app.route('/signout', methods=['POST'])
@login.login_required
def signout():
    user = login.current_user
    if user:
        login.logout_user()
        return {
            'status': 'SUCCESS',
            'message': {'name': f'Signed out'}
        }
    return {
        'status': 'FAILED',
        'message': {'name': 'Not signed in'}
    }

@app.route('/signup', methods=['POST'])
def signup():
    req = request.get_json(force=True)
    username = req.get('username', None)
    password = req.get('password', None)

    if User.objects(username=username):
        # User exists
        return {
            'status': 'FAILED',
            'message': 'User name already exists. Pick another.',
        }

    user = User(
        username=username,
        password=password,
    )
    user.save()
    
    login.login_user(user)

    return {
        'status'    : 'SUCCESS',
        'message'   : {
            'username'  : user.username,
            'hits'      : user.hits,
        }
    }

###################################################
# Flask-specific routes
###################################################
# Persistence: logs visits, by user and system-wide
@app.route('/log')
@login.login_required
def log():
    # Visits by user
    hits = login.current_user.hits + 1
    login.current_user.hits = hits
    login.current_user.save()

    # Visits system-wide
    visits = Global.objects.first()
    total = visits['total'] + 1
    visits['total'] = total
    visits.save()

    return {
        'status': 'SUCCESS',
        'message': {'hits': hits, 'total': total},
    }


# Simple demonstration of user access
@app.route('/user', methods=['GET'])
def user():
    if login.current_user.is_authenticated:
        return {
            'status': 'SUCCESS',
            'message': {
                'username'  : login.current_user.username,
                'hits'      : login.current_user.hits,
            }
        }   
    else:
        return {
            'status': 'FAILED',
            'message': {'username': None, 'hits' : None}
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
        ).replace('%40','@')

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
    # Single db initialization at setup, not by app
    pass
    
def production():
    # Replit production mode
    initialize()
    return app

###################################################
# Run as __main__, typically Replit environment
###################################################
if __name__ == '__main__':
    # Replit development mode
    initialize()
    app.run(host='0.0.0.0', port=8080, debug=True)
