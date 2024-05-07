from flask import Flask, render_template, redirect, url_for, request, send_file, Response, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, EqualTo
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
import io

# Application configuration
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key_here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///default.db'  # Default database URI
app.config['SQLALCHEMY_BINDS'] = {
    'users': 'sqlite:///users.db',
    'documents': 'sqlite:///documents.db'
}
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Login manager setup
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Database models
class User(UserMixin, db.Model):
    __bind_key__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True)
    password_hash = db.Column(db.String(100))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Document(db.Model):
    __bind_key__ = 'documents'
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(300))
    data = db.Column(db.LargeBinary)
    feedback = db.Column(db.Text)

class CriteriaDocument(db.Model):
    __bind_key__ = 'documents'
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(300))
    data = db.Column(db.LargeBinary)

# User loader for Flask-Login
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Form classes for Flask-WTF
class LoginForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired(), Length(min=4, max=20)])
    password = PasswordField('Password', validators=[InputRequired()])
    submit = SubmitField('Login')

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired(), Length(min=4, max=20)])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=6)])
    confirm_password = PasswordField('Confirm Password', validators=[InputRequired(), EqualTo('password')])
    submit = SubmitField('Register')



class CustomTemplate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    fields = db.Column(db.String(300), nullable=False)

# Route to add new template
@app.route('/add_template', methods=['POST'])
def add_template():
    data = request.json
    name = data['name']
    fields = ','.join(data['fields'])

    if not CustomTemplate.query.filter_by(name=name).first():
        new_template = CustomTemplate(name=name, fields=fields)
        db.session.add(new_template)
        db.session.commit()
    return jsonify({'status': 'success'})

# Route to get all templates
@app.route('/get_templates')
def get_templates():
    templates = CustomTemplate.query.all()
    return jsonify([{'name': t.name, 'fields': t.fields.split(',')} for t in templates])

@app.route('/clear_templates', methods=['POST'])
def clear_templates():
    CustomTemplate.query.delete()
    db.session.commit()
    return jsonify(status='success', message='All custom templates cleared.')



# Routes
@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and user.check_password(form.password.data):
            login_user(user)
            return redirect(url_for('create_project'))
        return 'Invalid username or password'
    return render_template('login.html', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        existing_user = User.query.filter_by(username=form.username.data).first()
        if existing_user is None:
            user = User(username=form.username.data)
            user.set_password(form.password.data)
            db.session.add(user)
            db.session.commit()
            return redirect(url_for('login'))
        return 'This username is already taken'
    return render_template('register.html', form=form)

@app.route('/create_project', methods=['GET', 'POST'])
@login_required
def create_project():
    if request.method == 'POST':
        return redirect(url_for('upload'))
    return render_template('dashboard.html')


@app.route('/help')
def help():
    return render_template('help.html')


@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        # Handle document uploads
        doc_files = request.files.getlist('documentInput')
        for doc_file in doc_files:
            if doc_file:
                filename = secure_filename(doc_file.filename)
                print("Uploaded document:", filename)  # Print the filename
                new_doc = Document(filename=filename, data=doc_file.read())
                db.session.add(new_doc)

        # Handle criteria document upload
        criteria_file = request.files.get('criteriaInput')
        if criteria_file:
            filename = secure_filename(criteria_file.filename)
            print("Uploaded criteria document:", filename)  # Print the filename
            new_criteria = CriteriaDocument(filename=filename, data=criteria_file.read())
            db.session.add(new_criteria)

        db.session.commit()

    documents = Document.query.all()
    criteria = CriteriaDocument.query.first()  # Fetch the first criteria document from the database
    return render_template('upload.html', documents=documents, criteria=criteria)


# Existing route to handle file download

@app.route('/download/<int:document_id>')
def download_file(document_id):
    document = Document.query.get_or_404(document_id)
    
    # Serve the PDF data directly in the response
    return Response(document.data, mimetype='application/pdf')


@app.route('/download_criteria/<int:document_id>')
def download_criteria(document_id):
    criteria_document = CriteriaDocument.query.get_or_404(document_id)
    
    # Serve the PDF data directly in the response
    return Response(criteria_document.data, mimetype='application/pdf')


@app.route('/reset_project', methods=['POST'])
@login_required
def reset_project():
    # Delete all documents from the database
    Document.query.delete()
    CriteriaDocument.query.delete()
    db.session.commit()
    return redirect(url_for('upload'))




@app.route('/save_feedback/<int:document_id>', methods=['POST'])
def save_feedback(document_id):
    document = Document.query.get_or_404(document_id)
    feedback = request.form['feedback']
    document.feedback = feedback
    db.session.commit()
    return jsonify(status='success', message='Feedback saved successfully.')


@app.route('/load_feedback/<int:document_id>', methods=['GET'])
def load_feedback(document_id):
    document = Document.query.get_or_404(document_id)
    return jsonify(feedback=document.feedback)


@app.route('/')
def home():
    return redirect(url_for('login'))

# Main block
if __name__ == '__main__':
    with app.app_context():
        # Create tables for all binds
        db.create_all()  # It will automatically handle binds
    app.run(debug=True)
