import os

MAX_FILE_SIZE = int(os.environ.get("MAX_FILE_SIZE", 10 * 1024 * 1024))
RATE_LIMIT = int(os.environ.get("RATE_LIMIT", 20))
RATE_WINDOW = int(os.environ.get("RATE_WINDOW", 60))
CONVERSION_TIMEOUT = int(os.environ.get("CONVERSION_TIMEOUT", 30))
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
