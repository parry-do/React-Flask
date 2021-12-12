## React+Flask on Repl.it

[React](https://reactjs.org/) is a popular JavaScript library for building user interfaces.

[Vite](https://vitejs.dev/) is a blazing fast frontend build tool with Hot Module Reloading (HMR), optimized builds, and TypeScript.

[Flask](https://flask.palletsprojects.com/) is a bare-bones Python micro web framework based on Werkzeug, Jinja2, and good intentions.

These three are one of the fastest ways to build a web app with a powerful backend.

### Getting Started
- Hit run
- Edit [src/App.jsx](#src/App.jsx) and watch it live update!
- Edit main.py to change the backend
- Using cookies, login must be done through a separate tab
  - Username: admin Password: admin
  - or
  - Username: user  Password: useruser

By default this runs a development server. Change that below.

### Development
The development server uses Vite to interpret React code live and is too slow to use in real time, but it makes building a new website easy.

### Production
The production server does not support live React and builds static HTML/JS like a real deployment using a gunicorn server.

To run the production server, change the first line in .replit:<br>
From: `run="bash development.sh"`  
To: `run="bash production.sh"`

### Deployment
Deployment tested on linode.com. I don't work for them, but they're developer owned and not a bookstore. Provision an Ubuntu LTS (Long-Term Support) node, ssh into the node, and run the following commands from root:

`git clone https://github.com/parry-do/React-Flask.git`

`bash React-Flask/scripts/configure.sh`

### Next
This isn't ready for use in the real world. Recaptcha protections, OAuth signins, and continuous integration are just a few other features to add next. This builds the backbone for a great webapp.

### Inspiration

Directly inspired by [a previous React Repl](https://replit.com/@replit/Reactjs).

Deployment implementation patterned from [this article](https://www.digitalocean.com/community/tutorials/how-to-set-up-flask-with-mongodb-and-docker).
