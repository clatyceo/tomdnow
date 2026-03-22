import asyncio
import logging
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from converter import convert_file, convert_url
from config import ALLOWED_ORIGINS, CONVERSION_TIMEOUT
from rate_limiter import RateLimiter

logger = logging.getLogger(__name__)

app = FastAPI(title="AllToMD API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["POST"],
    allow_headers=["*"],
)

rate_limiter = RateLimiter()


class UrlRequest(BaseModel):
    url: str
    type: str


async def run_conversion(func, *args):
    """Run a blocking conversion function with timeout and error handling."""
    try:
        return await asyncio.wait_for(
            asyncio.to_thread(func, *args),
            timeout=CONVERSION_TIMEOUT,
        )
    except asyncio.TimeoutError:
        raise HTTPException(status_code=422, detail=f"Conversion timed out ({CONVERSION_TIMEOUT}s limit)")
    except ValueError as e:
        status = 413 if "too large" in str(e).lower() else 400
        raise HTTPException(status_code=status, detail=str(e))
    except Exception:
        logger.exception("Conversion failed")
        raise HTTPException(status_code=422, detail="Conversion failed")


@app.post("/convert")
async def convert_file_endpoint(
    request: Request,
    file: UploadFile | None = File(None),
    type: str | None = Form(None),
):
    rate_limiter.check(request.client.host if request.client else "unknown")

    if file is not None:
        if not type:
            raise HTTPException(status_code=400, detail="Missing 'type' field")
        if file.size and file.size > 10 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="File too large (max 10MB)")
        content = await file.read()
        return await run_conversion(convert_file, content, file.filename or "unknown", type)

    raise HTTPException(status_code=400, detail="No file provided")


@app.post("/convert/url")
async def convert_url_endpoint(request: Request, body: UrlRequest):
    rate_limiter.check(request.client.host if request.client else "unknown")
    return await run_conversion(convert_url, body.url, body.type)


@app.get("/health")
async def health():
    return {"status": "ok"}
