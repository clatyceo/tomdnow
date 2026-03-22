def test_config_defaults():
    """Config should have sensible defaults when env vars are not set."""
    from config import MAX_FILE_SIZE, RATE_LIMIT, RATE_WINDOW, CONVERSION_TIMEOUT
    assert MAX_FILE_SIZE == 10 * 1024 * 1024
    assert RATE_LIMIT == 20
    assert RATE_WINDOW == 60
    assert CONVERSION_TIMEOUT == 30


def test_allowed_origins_is_list():
    """ALLOWED_ORIGINS should be a list of strings."""
    from config import ALLOWED_ORIGINS
    assert isinstance(ALLOWED_ORIGINS, list)
    assert len(ALLOWED_ORIGINS) >= 1
    assert all(isinstance(o, str) for o in ALLOWED_ORIGINS)
