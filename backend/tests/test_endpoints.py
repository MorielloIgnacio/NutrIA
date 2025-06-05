import os
import sys
import asyncio
import pytest
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from backend.main import generate_plan, check_plan, reset_plan, UserData
from fastapi import HTTPException


def test_generate_plan_success():
    data = UserData(
        weight=70,
        height=175,
        age=30,
        gender="male",
        activity_level="lightly_active",
        goals=["Perder peso"],
        routine_preference="Ejercicio en casa",
        dietary_restrictions=[],
    )
    result = generate_plan(data)
    assert "exercise_plan" in result
    assert "nutrition_plan" in result


def test_generate_plan_invalid_activity():
    data = UserData(
        weight=70,
        height=175,
        age=30,
        gender="male",
        activity_level="invalid",
        goals=["Perder peso"],
        routine_preference="Ejercicio en casa",
        dietary_restrictions=[],
    )
    with pytest.raises(HTTPException) as exc:
        generate_plan(data)
    assert exc.value.status_code == 400


def test_check_plan_success():
    result = asyncio.run(check_plan())
    assert result == {"hasPlan": True, "plan": {"name": "Plan de ejemplo"}}


def test_reset_plan_success():
    result = asyncio.run(reset_plan())
    assert result == {"success": True}
