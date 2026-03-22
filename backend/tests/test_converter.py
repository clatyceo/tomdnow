import pytest
from converter import convert_file, convert_url


def test_convert_file_rejects_unsupported_type():
    with pytest.raises(ValueError, match="Unsupported"):
        convert_file(b"fake content", "test.xyz", "xyz")


def test_convert_url_rejects_invalid_url():
    with pytest.raises(ValueError):
        convert_url("not-a-url", "youtube")


def test_convert_url_rejects_non_youtube_host():
    with pytest.raises(ValueError, match="Only YouTube"):
        convert_url("https://evil.com/watch?v=test", "youtube")


def test_convert_url_rejects_file_protocol():
    with pytest.raises(ValueError, match="Only http"):
        convert_url("file:///etc/passwd", "youtube")


def test_convert_url_rejects_internal_ip():
    with pytest.raises(ValueError, match="Only YouTube"):
        convert_url("http://169.254.169.254/latest/meta-data/", "youtube")


def test_convert_file_accepts_new_types():
    from converter import SUPPORTED_FILE_TYPES
    expected = {"pdf", "docx", "pptx", "xlsx", "xls", "html", "htm",
                "epub", "csv", "json", "xml", "msg", "ipynb", "zip",
                "jpg", "jpeg", "png", "gif", "webp"}
    assert expected == SUPPORTED_FILE_TYPES
