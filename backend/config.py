import os
import logging

logger = logging.getLogger(__name__)


def _parse_int(name: str, default: int) -> int:
    raw = os.environ.get(name)
    if raw is None:
        return default
    try:
        return int(raw)
    except ValueError:
        raise ValueError(f"Invalid environment variable {name}={raw!r} (expected integer)")


MAX_FILE_SIZE = _parse_int("MAX_FILE_SIZE", 10 * 1024 * 1024)
RATE_LIMIT = _parse_int("RATE_LIMIT", 20)
RATE_WINDOW = _parse_int("RATE_WINDOW", 60)
CONVERSION_TIMEOUT = _parse_int("CONVERSION_TIMEOUT", 30)
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

logger.info("Config loaded: MAX_FILE_SIZE=%s RATE_LIMIT=%s RATE_WINDOW=%s TIMEOUT=%s ORIGINS=%s",
            MAX_FILE_SIZE, RATE_LIMIT, RATE_WINDOW, CONVERSION_TIMEOUT, ALLOWED_ORIGINS)
