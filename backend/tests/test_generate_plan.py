from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_generate_plan_success():
    payload = {
        "weight": 70,
        "height": 175,
        "age": 30,
        "gender": "male",
        "activity_level": "lightly_active",
        "goals": ["Perder peso"],
        "routine_preference": "Ejercicio en casa",
        "dietary_restrictions": []
    }
    response = client.post("/generate_plan/", json=payload)
    assert response.status_code == 200
    json_data = response.json()
    assert "exercise_plan" in json_data
    assert "nutrition_plan" in json_data
