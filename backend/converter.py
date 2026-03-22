import os
import tempfile
from urllib.parse import urlparse
from markitdown import MarkItDown

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
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

md_converter = MarkItDown()


def convert_file(content: bytes, filename: str, file_type: str) -> dict:
    if file_type not in SUPPORTED_FILE_TYPES:
        raise ValueError(f"Unsupported file type: {file_type}")

    if len(content) > MAX_FILE_SIZE:
        raise ValueError(f"File too large: {len(content)} bytes (max {MAX_FILE_SIZE})")

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
        os.unlink(tmp_path)


ALLOWED_YOUTUBE_HOSTS = {"www.youtube.com", "youtube.com", "youtu.be", "m.youtube.com"}


def convert_url(url: str, url_type: str) -> dict:
    if url_type == "youtube":
        try:
            parsed = urlparse(url)
        except Exception:
            raise ValueError("Invalid URL")
        if parsed.scheme not in ("http", "https"):
            raise ValueError("Only http/https URLs are allowed")
        if parsed.hostname not in ALLOWED_YOUTUBE_HOSTS:
            raise ValueError("Only YouTube URLs are allowed")

        result = md_converter.convert(url)
        return {
            "markdown": result.text_content,
            "metadata": {
                "title": url,
                "type": "youtube",
                "size": len(result.text_content),
            },
        }

    raise ValueError(f"Unsupported URL type: {url_type}")
