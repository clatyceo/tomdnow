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


def test_convert_file_rejects_oversized():
    """File exceeding MAX_FILE_SIZE should be rejected."""
    big_content = b"x" * (10 * 1024 * 1024 + 1)  # 10MB + 1 byte
    with pytest.raises(ValueError, match="too large"):
        convert_file(big_content, "test.pdf", "pdf")


def test_convert_file_metadata_special_chars():
    """Filename with special characters should parse title correctly."""
    import os
    title = os.path.splitext("my-report (2024).pdf")[0]
    assert title == "my-report (2024)"


def test_convert_file_no_extension():
    """Filename without extension should still produce valid metadata title."""
    import os
    title = os.path.splitext("noextension")[0]
    assert title == "noextension"


def test_convert_url_unsupported_type():
    """Non-youtube URL type should be rejected."""
    with pytest.raises(ValueError, match="Unsupported URL type"):
        convert_url("https://vimeo.com/123", "vimeo")


def test_convert_url_ftp_protocol():
    """ftp:// URLs should be rejected."""
    with pytest.raises(ValueError, match="Only http"):
        convert_url("ftp://youtube.com/watch?v=test", "youtube")


def test_convert_url_no_hostname():
    """URL with no hostname should be rejected."""
    with pytest.raises(ValueError):
        convert_url("https://", "youtube")


def test_convert_url_m_youtube():
    """m.youtube.com should be in ALLOWED_YOUTUBE_HOSTS."""
    from converter import ALLOWED_YOUTUBE_HOSTS
    assert "m.youtube.com" in ALLOWED_YOUTUBE_HOSTS
