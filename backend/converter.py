import logging
import os
import tempfile
from urllib.parse import urlparse
from markitdown import MarkItDown
from config import MAX_FILE_SIZE
from errors import UnsupportedTypeError, FileTooLargeError, InvalidUrlError

logger = logging.getLogger(__name__)

SUPPORTED_FILE_TYPES = {
    "pdf", "docx", "pptx", "xlsx", "xls",
    "html", "htm",
    "epub",
    "csv", "json", "xml",
    "msg",
    "ipynb",
    "zip",
    "jpg", "jpeg", "png", "gif", "webp",
}

md_converter = MarkItDown()


def convert_file(content: bytes, filename: str, file_type: str) -> dict:
    if file_type not in SUPPORTED_FILE_TYPES:
        raise UnsupportedTypeError(file_type)

    if len(content) > MAX_FILE_SIZE:
        raise FileTooLargeError(len(content), MAX_FILE_SIZE)

    suffix = f".{file_type}"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(content)
        tmp_path = tmp.name

    try:
        result = md_converter.convert(tmp_path)
        return {
            "markdown": result.text_content,
            "metadata": {
                "title": os.path.splitext(filename)[0],
                "type": file_type,
                "size": len(content),
            },
        }
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            logger.warning("Failed to cleanup temp file: %s", tmp_path)


ALLOWED_YOUTUBE_HOSTS = {"www.youtube.com", "youtube.com", "youtu.be", "m.youtube.com"}


def convert_url(url: str, url_type: str) -> dict:
    if url_type == "youtube":
        try:
            parsed = urlparse(url)
        except Exception:
            raise InvalidUrlError("Invalid URL")
        if parsed.scheme not in ("http", "https"):
            raise InvalidUrlError("Only http/https URLs are allowed")
        if parsed.hostname not in ALLOWED_YOUTUBE_HOSTS:
            raise InvalidUrlError("Only YouTube URLs are allowed")

        result = md_converter.convert(url)
        return {
            "markdown": result.text_content,
            "metadata": {
                "title": url,
                "type": "youtube",
                "size": len(result.text_content),
            },
        }

    raise UnsupportedTypeError(url_type)
