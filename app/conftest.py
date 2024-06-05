import pytest
from app import app, db, Project

@pytest.fixture
def app_with_test_client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:' 
    app.config['WTF_CSRF_ENABLED'] = False  # Use in-memory database for testing
    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app_with_test_client):
    with app_with_test_client as client:
        yield client