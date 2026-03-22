import pytest
from fastapi import HTTPException
from rate_limiter import RateLimiter


def test_allows_requests_under_limit():
    limiter = RateLimiter(limit=3, window=60)
    for _ in range(3):
        limiter.check("1.2.3.4")


def test_blocks_requests_over_limit():
    limiter = RateLimiter(limit=2, window=60)
    limiter.check("1.2.3.4")
    limiter.check("1.2.3.4")
    with pytest.raises(HTTPException) as exc:
        limiter.check("1.2.3.4")
    assert exc.value.status_code == 429


def test_separate_ips():
    limiter = RateLimiter(limit=1, window=60)
    limiter.check("1.1.1.1")
    limiter.check("2.2.2.2")  # different IP, should pass


def test_cleanup_removes_stale_entries():
    limiter = RateLimiter(limit=100, window=0)  # window=0 means all entries are stale
    limiter.check("old-ip")
    limiter._counter = 99  # trigger cleanup on next call
    limiter.check("new-ip")
    assert "old-ip" not in limiter._store
