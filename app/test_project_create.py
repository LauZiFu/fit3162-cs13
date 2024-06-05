import pytest
from app import db, Project 

def test_create_new_project(client):
    # Ensure the database starts empty
    assert Project.query.count() == 0

    # Data for the new project
    new_project_data = {
        'id': 1,
        'title': 'New Project',
        'description': 'A new test project',
        'date': '2023-05-17'
    }

    # Send POST request to create new project
    response = client.post('/add_project', json=new_project_data)

    # Check that the response is a redirect (HTTP status code 302)
    assert response.status_code == 302
    # Verify the project was added to the database
    project = Project.query.filter_by(project_id=new_project_data['id']).first()
    assert project is not None
    assert project.title == new_project_data['title']
    assert project.description == new_project_data['description']



def test_invalid_json_in_project_creation(client):
    # Invalid JSON data (missing required fields)
    invalid_json_data = {
        'title': 'Incomplete Project'
        # 'description' and 'date' fields are missing
    }

    # Send POST request with invalid JSON
    response = client.post('/add_project', json=invalid_json_data)

    assert response.status_code != 302




