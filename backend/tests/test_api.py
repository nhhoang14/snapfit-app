from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["app"] == "SnapFit API"
    assert data["status"] == "online"


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_pinterest_categories():
    response = client.get("/api/v1/pinterest/categories")
    assert response.status_code == 200
    categories = response.json()
    assert len(categories) > 0
    assert any(c["id"] == "portrait" for c in categories)


def test_pinterest_search():
    response = client.get("/api/v1/pinterest/search?q=portrait")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert len(data["items"]) > 0


def test_ai_analyze_reference():
    payload = {
        "image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1080",
        "category": "portrait"
    }
    response = client.post("/api/v1/ai/analyze-reference", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "camera_guidance" in data
    assert "composition" in data
    assert "pose" in data
    assert len(data["pose"]["keypoints"]) > 0


def test_ai_live_alignment():
    payload = {
        "reference_id": "pin-port-1",
        "current_keypoints": [
            {"name": "nose", "x": 0.50, "y": 0.30},
            {"name": "left_shoulder", "x": 0.38, "y": 0.45},
            {"name": "right_shoulder", "x": 0.62, "y": 0.45},
            {"name": "left_hip", "x": 0.42, "y": 0.88},
            {"name": "right_hip", "x": 0.58, "y": 0.88},
        ],
        "device_pitch": 0.0,
        "device_roll": 0.0,
    }
    response = client.post("/api/v1/ai/live-alignment", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "overall_score" in data
    assert "primary_guidance" in data
    assert data["overall_score"] > 50


def test_photo_filters():
    response = client.get("/api/v1/photos/filters")
    assert response.status_code == 200
    filters = response.json()
    assert len(filters) > 0
    assert filters[0]["id"] == "original"


def test_photo_compare():
    response = client.post(
        "/api/v1/photos/compare",
        data={
            "captured_photo_id": "photo-test-1",
            "reference_id": "pin-port-1",
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "overall_match_percentage" in data
    assert "positive_highlights" in data
