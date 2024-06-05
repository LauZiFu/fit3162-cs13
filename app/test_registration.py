import pytest
from app import app, db, User

@pytest.mark.parametrize("username,password,confirm_password", [
    ("test_user1", "password123", "password123"),
    ("test_user2", "password456", "password456"),
    ("test_user3", "password789", "password789")
])
def test_valid_registration(client, username, password, confirm_password):
    response = client.post('/register', data={
        'username': username,
        'password': password,
        'confirm_password': confirm_password,
        'submit': 'Register'
    }, follow_redirects=True)
    # Print all users in the database
    with app.app_context():
        users = User.query.all()
        for user in users:
            print(f' \nUser:{user.username}')
    assert b'Redirecting...' in response.data or b'Login' in response.data


@pytest.mark.parametrize("username,password,confirm_password", [
    ("existing_user", "password123", "password123"),
    ("existing_user", "password456", "password456"),
    ("existing_user", "password789", "password789")
])
def test_existing_username_registration(client, username, password, confirm_password):
    # Create a user with the username "existing_user" only once
    if not User.query.filter_by(username='existing_user').first():
        existing_user = User(username='existing_user')
        existing_user.set_password('password123')
        db.session.add(existing_user)
        db.session.commit()

    response = client.post('/register', data={
        'username': username,
        'password': password,
        'confirm_password': confirm_password,
        'submit': 'Register'
    }, follow_redirects=True)
    # Print all users in the database
    with app.app_context():
        users = User.query.all()
        for user in users:
            print(f'User: {user.username}')
    assert b'This username is already taken' in response.data