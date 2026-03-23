"""Tests for OCR module and endpoint."""
import io
import pytest


def _tesseract_available():
    """Check if Tesseract OCR is installed on this system."""
    try:
        import pytesseract
        pytesseract.get_tesseract_version()
        return True
    except Exception:
        return False


# --- Module-level tests (no Tesseract required) ---

def test_ocr_module_importable():
    """The ocr module should be importable regardless of Tesseract."""
    import ocr
    assert hasattr(ocr, "ocr_image_to_markdown")
    assert hasattr(ocr, "get_tesseract_lang")
    assert hasattr(ocr, "LANG_MAP")
    assert hasattr(ocr, "VALID_LANGS")


def test_get_tesseract_lang_known():
    from ocr import get_tesseract_lang
    assert get_tesseract_lang("en") == "eng"
    assert get_tesseract_lang("ko") == "kor"
    assert get_tesseract_lang("ja") == "jpn"
    assert get_tesseract_lang("zh") == "chi_sim"
    assert get_tesseract_lang("de") == "deu"
    assert get_tesseract_lang("fr") == "fra"
    assert get_tesseract_lang("es") == "spa"
    assert get_tesseract_lang("pt") == "por"


def test_get_tesseract_lang_unknown():
    from ocr import get_tesseract_lang
    assert get_tesseract_lang("xx") == "eng"
    assert get_tesseract_lang("") == "eng"


def test_lang_map_covers_all_locales():
    from ocr import LANG_MAP
    expected_locales = {"en", "ko", "ja", "zh", "de", "fr", "es", "pt"}
    assert set(LANG_MAP.keys()) == expected_locales


def test_valid_langs_matches_lang_map():
    from ocr import LANG_MAP, VALID_LANGS
    assert VALID_LANGS == set(LANG_MAP.values())


# --- Tesseract-dependent tests ---

@pytest.mark.skipif(not _tesseract_available(), reason="Tesseract not installed")
def test_ocr_with_simple_image():
    """Create a simple image with text and verify OCR extracts it."""
    from PIL import Image, ImageDraw, ImageFont
    from ocr import ocr_image_to_markdown

    # Create a white image with black text
    img = Image.new("RGB", (400, 100), color="white")
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 36)
    except (OSError, IOError):
        font = ImageFont.load_default()
    draw.text((10, 30), "Hello World", fill="black", font=font)

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    content = buf.getvalue()

    result = ocr_image_to_markdown(content, "eng")
    assert "markdown" in result
    assert "metadata" in result
    assert result["metadata"]["type"] == "ocr"
    assert result["metadata"]["lang"] == "eng"
    # The OCR should detect at least part of "Hello World"
    assert "hello" in result["markdown"].lower() or "world" in result["markdown"].lower()


@pytest.mark.skipif(not _tesseract_available(), reason="Tesseract not installed")
def test_ocr_empty_image():
    """An image with no text should raise ConversionError."""
    from PIL import Image
    from ocr import ocr_image_to_markdown
    from errors import ConversionError

    # Create a blank white image (no text)
    img = Image.new("RGB", (100, 100), color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    content = buf.getvalue()

    with pytest.raises(ConversionError, match="No text detected"):
        ocr_image_to_markdown(content, "eng")


def test_ocr_invalid_image_data():
    """Invalid image data should raise an error."""
    from ocr import ocr_image_to_markdown

    with pytest.raises(Exception):
        ocr_image_to_markdown(b"not an image", "eng")


@pytest.mark.skipif(not _tesseract_available(), reason="Tesseract not installed")
def test_ocr_invalid_lang_falls_back():
    """An invalid language code should fall back to 'eng'."""
    from PIL import Image, ImageDraw, ImageFont
    from ocr import ocr_image_to_markdown

    img = Image.new("RGB", (400, 100), color="white")
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 36)
    except (OSError, IOError):
        font = ImageFont.load_default()
    draw.text((10, 30), "Test", fill="black", font=font)

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    content = buf.getvalue()

    result = ocr_image_to_markdown(content, "invalid_lang")
    assert result["metadata"]["lang"] == "eng"


# --- API endpoint tests ---

def test_ocr_endpoint_exists():
    """The /convert/ocr endpoint should exist and accept POST."""
    from fastapi.testclient import TestClient
    from main import app

    client = TestClient(app)
    # Sending no file should get a 422 (validation error), not 404
    response = client.post("/convert/ocr")
    assert response.status_code == 422


@pytest.mark.skipif(not _tesseract_available(), reason="Tesseract not installed")
def test_ocr_endpoint_with_image():
    """POST a valid image to /convert/ocr and verify response shape."""
    from PIL import Image, ImageDraw, ImageFont
    from fastapi.testclient import TestClient
    from main import app

    client = TestClient(app)

    img = Image.new("RGB", (400, 100), color="white")
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 36)
    except (OSError, IOError):
        font = ImageFont.load_default()
    draw.text((10, 30), "Hello OCR", fill="black", font=font)

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)

    response = client.post(
        "/convert/ocr",
        files={"file": ("test.png", buf, "image/png")},
        data={"lang": "eng"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "markdown" in data
    assert "metadata" in data
    assert data["metadata"]["type"] == "ocr"
