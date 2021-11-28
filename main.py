import os
import requests

from flask import (
    Flask,
    request,
    send_from_directory,
)

import flask_login as login

from python.db import connect

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

# App services initiation
db, User, Global, get_user = connect(app)

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
                'name': f'Signed in as {user["username"]}'
            }
        }
    return {
        'status': 'FAILED',
        'message': {
            'name': 'Not signed in'
        }
    }

@app.route('/signout', methods=['POST'])
@login.login_required
def signout():
    user = login.current_user
    if user:
        login.logout_user()
        return {
            'status': 'SUCCESS',
            'message': {
                'name': f'Signed out'
            }
        }
    return {
        'status': 'FAILED',
        'message': {
            'name': 'Not signed in'
        }
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
            'message': 'User already exists',
        }

    user = User(
        username=username,
        password=password,
    )

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
        'message': {
            'hits': hits,
            'total': total,
        },
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
            'message': {
                'username'  : None,
                'hits'      : None,
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
