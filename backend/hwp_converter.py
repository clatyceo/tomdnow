import logging
import os
import tempfile

logger = logging.getLogger(__name__)


def _with_temp_file(content: bytes, suffix: str, convert_fn):
    """Write content to temp file, run convert_fn, clean up."""
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(content)
        tmp_path = tmp.name
    try:
        return convert_fn(tmp_path)
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            logger.warning("Failed to cleanup temp file: %s", tmp_path)


def convert_hwpx_to_markdown(content: bytes) -> str:
    """Convert HWPX file to Markdown using python-hwpx."""
    from hwpx import HwpxDocument

    def _convert(tmp_path):
        doc = HwpxDocument.open(tmp_path)
        try:
            return doc.export_markdown()
        except Exception:
            # Fallback: extract plain text
            return doc.export_text()

    markdown = _with_temp_file(content, ".hwpx", _convert)

    if not markdown or not markdown.strip():
        raise ValueError("Empty content after HWPX conversion")
    return markdown


def convert_hwp_to_markdown(content: bytes) -> str:
    """Convert HWP (binary) file to Markdown using pyhwp2md."""
    from pyhwp2md import convert as hwp2md_convert

    markdown = _with_temp_file(content, ".hwp", hwp2md_convert)

    if not markdown or not markdown.strip():
        raise ValueError("Empty content after HWP conversion")
    return markdown
