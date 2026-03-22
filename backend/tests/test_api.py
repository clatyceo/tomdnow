from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_convert_no_file():
    response = client.post("/convert")
    assert response.status_code == 400
    assert response.json()["detail"] == "No file provided"


def test_convert_url_invalid():
    response = client.post("/convert/url", json={"url": "not-a-url", "type": "youtube"})
    assert response.status_code == 400
    assert "detail" in response.json()


def test_convert_file_missing_type():
    """File upload without type field should return 400."""
    response = client.post(
        "/convert",
        files={"file": ("test.txt", b"hello", "text/plain")},
    )
    assert response.status_code == 400
    assert "type" in response.json()["detail"].lower()


def test_convert_url_missing_fields():
    """URL request with missing fields should return 422 (Pydantic validation)."""
    response = client.post("/convert/url", json={"url": "https://youtube.com/watch?v=x"})
    assert response.status_code == 422


def test_convert_url_empty_body():
    """URL request with empty body should return 422."""
    response = client.post("/convert/url", json={})
    assert response.status_code == 422


def test_rate_limit_on_convert():
    """Exceeding rate limit should return 429."""
    from rate_limiter import RateLimiter
    import main
    # Save original and replace with strict limiter
    original = main.rate_limiter
    main.rate_limiter = RateLimiter(limit=1, window=60)
    try:
        client.post("/convert/url", json={"url": "not-a-url", "type": "youtube"})
        response = client.post("/convert/url", json={"url": "not-a-url", "type": "youtube"})
        assert response.status_code == 429
    finally:
        main.rate_limiter = original
