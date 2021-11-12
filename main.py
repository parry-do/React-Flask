from flask import Flask, request
import requests

app = Flask(__name__)


# TODO: remove initial verification route
@app.route('/working')
def working():
    return {'message': 'working'}


# Dev Server: Other routes to Node.js/Vite/React
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
