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
    assert "error" in response.json()


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


def test_batch_valid_files():
    """Batch with valid files returns results."""
    response = client.post(
        "/convert/batch",
        files=[
            ("files", ("test.csv", b"name,age\nAlice,30\nBob,25", "text/csv")),
            ("files", ("test.json", b'{"key": "value"}', "application/json")),
        ],
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert len(data["results"]) == 2
    assert data["results"][0]["filename"] == "test.csv"
    assert data["results"][1]["filename"] == "test.json"
    assert "markdown" in data["results"][0]
    assert "markdown" in data["results"][1]
    assert len(data["errors"]) == 0


def test_batch_too_many_files():
    """Batch with >5 files returns error."""
    files = [("files", (f"test{i}.csv", b"a,b\n1,2", "text/csv")) for i in range(6)]
    response = client.post("/convert/batch", files=files)
    assert response.status_code == 400
    data = response.json()
    assert "5" in data.get("error", "")


def test_batch_empty():
    """Empty batch (no files) returns appropriate response."""
    response = client.post("/convert/batch")
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
