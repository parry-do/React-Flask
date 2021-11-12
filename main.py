from replit import db, web
from flask import Flask, request
import requests

app = Flask(__name__)
users = web.UserStore()


# Persistence: visit logging by user and system-wide
@app.route('/log')
@web.authenticated
def log():
    hits = users.current.get("hits", 0) + 1
    users.current["hits"] = hits
    total = db.get('total', 0) + 1
    db['total'] = total

    return {"message": {'hits': hits, 'total': db['total']}}


# Simple demonstration of user access
@app.route('/user')
def user():
    result = {'message': {'name':web.auth.name}} \
            if web.auth.name else {'message':{'name':'Not Logged In'}}
    return result


# Dev Server: Proxy all other routes to Node.js/Vite/React
@app.route('/', defaults={'path': ''}, methods=['GET', 'POST', 'DELETE'])
@app.route('/<path:path>', methods=['GET', 'POST', 'DELETE'])
def proxy(*args, **kwargs):

    target = 'http://localhost:3000/'
    keywords = {
        'method': request.method,
        'url': request.url.replace(request.host_url,
                                   target).replace('%40', '@'),
        'headers': dict(request.headers),
        'data': request.get_data(),
        'cookies': request.cookies,
        'json': request.json,
        'auth': request.authorization,
        'files': request.files,
        'allow_redirects': False,
    }

    resp = requests.request(**keywords)
    return (resp.text, resp.status_code, resp.headers.items())


app.run(host='0.0.0.0', port=8080, debug=True)
