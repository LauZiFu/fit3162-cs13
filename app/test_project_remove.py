import pytest
from app import db, Project 

def test_remove_project(client):
    # Create a project in the database
    project = Project(project_id=1, title='Test Project', description='Test Description', date='2023-05-17')
    db.session.add(project)
    db.session.commit()

    # Ensure the project was added successfully
    assert Project.query.filter_by(project_id=1).first() is not None

    # Send a request to remove the project
    response = client.get('/remove_project/1')

    # Check that the response is a redirect (HTTP status code 302)
    assert response.status_code == 302

    # Ensure the project was removed from the database
    assert Project.query.filter_by(project_id=1).first() is None



def test_remove_nonexistent_project(client):
    # Ensure the project with ID 999 does not exist in the database
    assert Project.query.filter_by(project_id=999).first() is None

    # Send a request to remove the non-existent project
    response = client.get('/remove_project/999')

    # Check that the response is a redirect (HTTP status code 302)
    assert response.status_code == 404

    # Optionally, verify that the project was not removed (e.g., by checking the database)
    assert Project.query.filter_by(project_id=999).first() is None