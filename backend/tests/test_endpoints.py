import json
from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)


def test_generate_plan_success():
    payload = {
        "weight": 70,
        "height": 175,
        "age": 30,
        "gender": "male",
        "activity_level": "sedentary",
        "goals": ["Perder peso"],
        "routine_preference": "Ejercicio en casa",
        "dietary_restrictions": []
    }
    response = client.post("/generate_plan/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "exercise_plan" in data
    assert "nutrition_plan" in data
    assert set(data["nutrition_plan"].keys()) == {"calories", "protein", "carbs", "fats"}


def test_generate_plan_invalid_activity():
    payload = {
        "weight": 70,
        "height": 175,
        "age": 30,
        "gender": "male",
        "activity_level": "invalid_level",
        "goals": ["Perder peso"],
        "routine_preference": "Ejercicio en casa",
        "dietary_restrictions": []
    }
    response = client.post("/generate_plan/", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "Nivel de actividad inválido"


def test_check_plan_success():
    response = client.get("/api/check-plan")
    assert response.status_code == 200
    data = response.json()
    assert data["hasPlan"] is True
    assert isinstance(data["plan"], dict)
    assert data["plan"].get("name") == "Plan de ejemplo"


def test_check_plan_method_not_allowed():
    response = client.post("/api/check-plan")
    assert response.status_code == 405


def test_reset_plan_success():
    response = client.post("/api/reset-plan")
    assert response.status_code == 200
    assert response.json() == {"success": True}


def test_reset_plan_method_not_allowed():
    response = client.get("/api/reset-plan")
    assert response.status_code == 405
