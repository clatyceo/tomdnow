import time
import threading
import logging
from fastapi import HTTPException
from config import RATE_LIMIT, RATE_WINDOW

logger = logging.getLogger(__name__)


class RateLimiter:
    def __init__(self, limit: int = RATE_LIMIT, window: int = RATE_WINDOW):
        self.limit = limit
        self.window = window
        self._store: dict[str, list[float]] = {}
        self._counter = 0
        self._lock = threading.Lock()

    def check(self, ip: str) -> None:
        now = time.time()
        with self._lock:
            self._counter += 1
            if self._counter >= 100:
                self._counter = 0
                stale = [k for k, v in self._store.items() if all(now - t >= self.window for t in v)]
                for k in stale:
                    del self._store[k]

            timestamps = self._store.get(ip, [])
            timestamps = [t for t in timestamps if now - t < self.window]
            if len(timestamps) >= self.limit:
                logger.warning("Rate limit exceeded for IP: %s", ip)
                raise HTTPException(status_code=429, detail="Rate limit exceeded")
            timestamps.append(now)
            self._store[ip] = timestamps
