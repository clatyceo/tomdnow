from errors import (
    ConversionError, FileTooLargeError, UnsupportedTypeError,
    InvalidUrlError, ConversionTimeoutError,
)


def test_conversion_error_base():
    err = ConversionError("test error", 422)
    assert err.message == "test error"
    assert err.status_code == 422


def test_file_too_large_error():
    err = FileTooLargeError(15_000_000, 10_485_760)
    assert "10MB" in err.message
    assert err.status_code == 413


def test_unsupported_type_error():
    err = UnsupportedTypeError("xyz")
    assert "xyz" in err.message
    assert err.status_code == 400


def test_invalid_url_error():
    err = InvalidUrlError("bad scheme")
    assert err.message == "bad scheme"
    assert err.status_code == 400


def test_timeout_error():
    err = ConversionTimeoutError(30)
    assert "30s" in err.message
    assert err.status_code == 504
