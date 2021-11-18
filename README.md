## React/Flask on Repl.it

[React](https://reactjs.org/) is a popular JavaScript library for building user interfaces.

[Vite](https://vitejs.dev/) is a blazing fast frontend build tool that includes features like Hot Module Reloading (HMR), optimized builds, and TypeScript support out of the box.

[Flask](https://flask.palletsprojects.com/) is a bare-bones Python micro web framework based on Werkzeug, Jinja2, and good intentions.

Using the three in conjunction is one of the fastest ways to build a web app with a powerful backend.

### Getting Started
- Hit run
- Edit [src/App.jsx](#src/App.jsx) and watch it live update!
- Edit main.py to change the backend 

By default this runs a development server.

### Production

To run the production server, change the first line in .replit:<br>
From: `run="bash development.sh"`  
To: `run="bash production.sh"`

sudo nano /etc/config.json
{
	"SECRET_KEY": "1A37BbcCJh67",
	"DATABASE_URI": "sqlite:///site.db"
}

import json
with open('/etc/config.json') as config_file:
    config = json.load(config_file)
app.config['SECRET_KEY'] = config.get('SECRET_KEY')
app.config['DATABASE_URI'] = config.get('DATABASE_URI')

bash configure.sh "github clone url"

### Inspiration

Directly inspired by [a previous React Repl](https://replit.com/@replit/Reactjs), and [a previous Flask authentication Repl(@mat1)](https://replit.com/talk/learn/Authenticating-users-with-Replit-Auth/23460). This takes code liberally from both.

Production implementation patterned from [this article](https://medium.com/@abalarin/flask-on-linode-a6d6ce2505d0).
