import pytest
from app import db, Project 

def test_get_projects(client):
    # Create sample projects in the database
    project1 = Project(project_id=1, title='Project 1', description='Description 1', date='2023-05-17')
    project2 = Project(project_id=2, title='Project 2', description='Description 2', date='2023-05-18')
    db.session.add_all([project1, project2])
    db.session.commit()

    # Send a request to get the projects
    response = client.get('/get_projects')

    # Check that the response is successful (HTTP status code 200)
    assert response.status_code == 200

    # Parse the JSON response
    data = response.json

    # Verify the JSON structure and content
    assert 'projects' in data
    assert 'last_id' in data
    assert 'username' in data

    # Verify the content of the projects list
    projects = data['projects']
    assert len(projects) == 2

    # Verify the content of each project
    assert projects[0]['id'] == 1
    assert projects[0]['title'] == 'Project 1'
    assert projects[0]['description'] == 'Description 1'
    assert projects[0]['date'] == '2023-05-17'

    assert projects[1]['id'] == 2
    assert projects[1]['title'] == 'Project 2'
    assert projects[1]['description'] == 'Description 2'
    assert projects[1]['date'] == '2023-05-18'


def test_get_projects_no_projects(client):
    # Ensure there are no projects in the database
    assert Project.query.count() == 0

    # Send a request to get the projects
    response = client.get('/get_projects')

    # Check that the response is successful (HTTP status code 200)
    assert response.status_code == 200

    # Parse the JSON response
    data = response.json

    # Verify the JSON structure and content
    assert 'projects' in data
    assert 'last_id' in data
    assert 'username' in data

    # Verify that the projects list is empty
    projects = data['projects']
    assert len(projects) == 0

