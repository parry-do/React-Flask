import os
from replit import db, web
from flask import Flask, request, send_from_directory
import requests

# Appropriate Flask app prepared
mode = os.environ.get('MODE')
if mode is None:
    # Deployment server, statics by reverse proxy
    mode = 'deployment'
    app = Flask(__name__)
else:
    # Replit prod/dev, statics by Flask
    app = Flask(__name__, static_url_path='/dists')

users = web.UserStore()


###################################################
# Flask-specific routes
###################################################
# Persistence: logs visits, by user and system-wide
# Auth required
@app.route('/log')
@web.authenticated
def log():
    # Visits by user
    hits = users.current.get("hits", 0) + 1
    users.current["hits"] = hits

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
def user():
    return {
            'status': 'success',
            'message': {'name':web.auth.name}
        } \
        if web.auth.name else \
        {
            'status': 'success',
            'message':{'name':'Not Logged In'}
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
        url = request.url.replace( \
            request.host_url,
            'http://localhost:3000/'
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
