class ConversionError(Exception):
    """Base error for conversion failures."""
    def __init__(self, message: str, status_code: int = 422):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class FileTooLargeError(ConversionError):
    def __init__(self, size: int, max_size: int):
        super().__init__(f"File too large (max {max_size // 1024 // 1024}MB)", 413)


class UnsupportedTypeError(ConversionError):
    def __init__(self, file_type: str):
        super().__init__(f"Unsupported file type: {file_type}", 400)


class InvalidUrlError(ConversionError):
    def __init__(self, reason: str = "Invalid URL"):
        super().__init__(reason, 400)


class ConversionTimeoutError(ConversionError):
    def __init__(self, timeout: int):
        super().__init__(f"Conversion timed out ({timeout}s limit)", 504)
