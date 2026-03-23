# AllToMD 전체 개선 로드맵 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** AllToMD의 트래픽 확보, 신뢰 구축, 기능 확장, 수익화를 단계적으로 구현

**Architecture:** Next.js 16 + FastAPI 기반 기존 구조 위에 점진적으로 기능 추가. 프론트엔드는 Vercel, 백엔드는 Railway 배포. i18n(8개 언어)과 [locale] 라우팅 유지.

**Tech Stack:** Next.js 16, next-intl, Tailwind CSS 4, FastAPI, MarkItDown, MDX, Stripe, Google Analytics 4, Google AdSense

---

## Phase 1: SEO + 신뢰 구축 (1-4주)

### Task 1: 보안 전용 페이지 생성 (/[locale]/security)

**Files:**
- Create: `frontend/app/[locale]/security/page.tsx`
- Modify: `frontend/messages/en.json` (+ 7개 언어 파일)
- Modify: `frontend/components/footer.tsx` — security 링크 추가
- Modify: `frontend/app/sitemap.ts` — security URL 추가

**Step 1: 번역 키 추가**

`frontend/messages/en.json`에 `security` 섹션 추가:

```json
"security": {
  "title": "Security — ToMarkdown",
  "h1": "Your Files Are Safe With Us",
  "subtitle": "We take your privacy seriously. Here's how we protect your data.",
  "memoryProcessingTitle": "In-Memory Processing",
  "memoryProcessingDesc": "Your files are processed entirely in server memory. They are never written to disk or stored in a database.",
  "instantDeletionTitle": "Instant Deletion",
  "instantDeletionDesc": "After conversion, your file data is immediately discarded. We keep nothing — not even temporarily.",
  "tlsEncryptionTitle": "TLS Encryption",
  "tlsEncryptionDesc": "All data transmitted between your browser and our servers is encrypted with TLS 1.3.",
  "noAccountTitle": "No Account Required",
  "noAccountDesc": "We don't collect personal information. No sign-up, no tracking, no cookies for advertising.",
  "openSourceTitle": "Open Approach",
  "openSourceDesc": "Our conversion is powered by Microsoft's open-source MarkItDown library. Transparency is built in.",
  "comparisonTitle": "How We Compare",
  "comparisonDesc": "Most file conversion services store your files on their servers for hours. We never store them at all.",
  "comparisonUs": "ToMarkdown",
  "comparisonOthers": "Other Services",
  "comparisonStorage": "File Storage",
  "comparisonStorageUs": "None (memory only)",
  "comparisonStorageOthers": "1-24 hours on server",
  "comparisonDeletion": "Deletion",
  "comparisonDeletionUs": "Instant (after conversion)",
  "comparisonDeletionOthers": "Scheduled (hours later)",
  "comparisonAccount": "Account Required",
  "comparisonAccountUs": "No",
  "comparisonAccountOthers": "Often yes"
}
```

나머지 7개 언어 파일(ko, ja, zh, es, pt, de, fr)에도 번역 추가.

**Step 2: security 페이지 컴포넌트 생성**

`frontend/app/[locale]/security/page.tsx` 생성 — 보안 특징 카드 + 비교 테이블 렌더링. 기존 `about/page.tsx` 패턴 참고.

```tsx
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("security");
  return { title: t("title") };
}

export default async function SecurityPage() {
  const t = await getTranslations("security");
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">{t("h1")}</h1>
      <p className="text-lg text-gray-600 mb-12">{t("subtitle")}</p>
      {/* 보안 특징 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* memoryProcessing, instantDeletion, tlsEncryption, noAccount, openSource 카드 */}
      </div>
      {/* 비교 테이블 */}
      <h2 className="text-2xl font-bold mb-6">{t("comparisonTitle")}</h2>
      <p className="text-gray-600 mb-6">{t("comparisonDesc")}</p>
      <table>...</table>
    </main>
  );
}
```

**Step 3: footer에 Security 링크 추가**

`frontend/components/footer.tsx` 수정 — `nav.security` 번역 키와 `/security` 링크 추가.

**Step 4: sitemap에 security 추가**

`frontend/app/sitemap.ts` 수정 — `security` 경로를 priority 0.5, changeFrequency yearly로 추가.

**Step 5: 테스트**

Run: `cd frontend && npm test`

**Step 6: 커밋**

```bash
git add frontend/app/[locale]/security/ frontend/messages/ frontend/components/footer.tsx frontend/app/sitemap.ts
git commit -m "feat: add security page with trust signals and comparison table"
```

---

### Task 2: 홈페이지 신뢰 배지 추가

**Files:**
- Modify: `frontend/app/[locale]/page.tsx` — 신뢰 배지 섹션 추가
- Modify: `frontend/messages/en.json` (+ 7개 언어) — trust 번역 키

**Step 1: 번역 키 추가**

```json
"trust": {
  "noStorage": "No File Storage",
  "noStorageDesc": "Files processed in memory only",
  "encrypted": "TLS Encrypted",
  "encryptedDesc": "End-to-end encryption",
  "instantDelete": "Instant Deletion",
  "instantDeleteDesc": "Data deleted after conversion",
  "noSignup": "No Sign-up",
  "noSignupDesc": "100% free, no account needed"
}
```

**Step 2: 홈페이지에 신뢰 배지 섹션 추가**

`frontend/app/[locale]/page.tsx`에서 기존 feature 섹션 아래에 trust 배지 그리드 추가. 아이콘(shield, lock, trash, user-x 등)은 인라인 SVG 사용.

**Step 3: 테스트 및 커밋**

```bash
cd frontend && npm test
git add frontend/app/[locale]/page.tsx frontend/messages/
git commit -m "feat: add trust badges to homepage (no storage, TLS, instant delete)"
```

---

### Task 3: Schema.org 구조화 데이터 보강

**Files:**
- Modify: `frontend/app/[locale]/layout.tsx` — Organization schema 추가
- Modify: `frontend/components/seo-content.tsx` — SoftwareApplication schema 보강

**Step 1: Organization + WebSite schema 추가**

`frontend/app/[locale]/layout.tsx`의 `<head>`에 JSON-LD 추가:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ToMarkdown",
  "url": "https://tomdnow.com",
  "logo": "https://tomdnow.com/logo.png",
  "sameAs": []
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ToMarkdown",
  "url": "https://tomdnow.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://tomdnow.com/{locale}?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

**Step 2: SoftwareApplication schema에 필드 추가**

기존 `seo-content.tsx`의 WebApplication에 `applicationCategory`, `operatingSystem`, `offers` (Free), `aggregateRating` (추후 리뷰 확보 시) 보강.

**Step 3: 커밋**

```bash
git commit -m "feat: enhance Schema.org structured data (Organization, WebSite, SoftwareApplication)"
```

---

### Task 4: MDX 블로그 시스템 구축

**Files:**
- Install: `@next/mdx`, `@mdx-js/react`, `gray-matter`, `next-mdx-remote`
- Create: `frontend/app/[locale]/blog/page.tsx` — 블로그 인덱스
- Create: `frontend/app/[locale]/blog/[slug]/page.tsx` — 블로그 포스트
- Create: `frontend/lib/blog.ts` — MDX 파싱 유틸리티
- Create: `frontend/content/blog/en/`, `ko/`, ... — 언어별 MDX 파일 디렉토리
- Modify: `frontend/messages/en.json` (+ 7개 언어) — blog 번역 키
- Modify: `frontend/components/header.tsx` — Blog 네비게이션 링크 추가
- Modify: `frontend/app/sitemap.ts` — 블로그 URL 추가

**Step 1: 의존성 설치**

```bash
cd frontend && npm install next-mdx-remote gray-matter
```

**Step 2: 블로그 유틸리티 생성**

`frontend/lib/blog.ts`:

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export function getBlogPosts(locale: string): BlogPost[] {
  const dir = path.join(CONTENT_DIR, locale);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.mdx$/, ""),
        title: data.title,
        description: data.description,
        date: data.date,
        author: data.author || "ToMarkdown",
        tags: data.tags || [],
        content,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPost(locale: string, slug: string): BlogPost | null {
  const filePath = path.join(CONTENT_DIR, locale, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    author: data.author || "ToMarkdown",
    tags: data.tags || [],
    content,
  };
}
```

**Step 3: 블로그 인덱스 페이지**

`frontend/app/[locale]/blog/page.tsx`:
- `getBlogPosts(locale)`로 목록 렌더링
- 카드 그리드 (제목, 설명, 날짜, 태그)
- generateMetadata로 SEO 메타 설정

**Step 4: 블로그 포스트 페이지**

`frontend/app/[locale]/blog/[slug]/page.tsx`:
- `getBlogPost(locale, slug)`로 포스트 로드
- `next-mdx-remote`로 MDX 렌더링
- BlogPosting JSON-LD 구조화 데이터
- generateStaticParams로 정적 생성

**Step 5: 초기 콘텐츠 (한국어 + 영어 최소 3편)**

`frontend/content/blog/en/pdf-to-markdown-guide.mdx`:
```mdx
---
title: "How to Convert PDF to Markdown: Complete Guide"
description: "Learn how to convert PDF files to clean Markdown format..."
date: "2026-03-24"
tags: ["pdf", "markdown", "guide"]
---

## Why Convert PDF to Markdown?
...
```

`frontend/content/blog/ko/pdf-to-markdown-guide.mdx` — 한국어 버전

**Step 6: 헤더에 Blog 링크 추가**

`frontend/components/header.tsx` 수정 — 네비게이션에 Blog 링크.

**Step 7: sitemap에 블로그 추가**

`frontend/app/sitemap.ts` — 블로그 인덱스 + 개별 포스트 URL 추가.

**Step 8: 테스트 및 커밋**

```bash
cd frontend && npm test
git add .
git commit -m "feat: add MDX blog system with i18n support and initial posts"
```

---

### Task 5: Google Analytics 4 연동

**Files:**
- Modify: `frontend/app/[locale]/layout.tsx` — GA4 스크립트 삽입
- Modify: `frontend/next.config.ts` — CSP에 Google Analytics 도메인 허용
- Modify: `frontend/messages/en.json` (+ 7개 언어) — 쿠키 동의 번역
- Create: `frontend/components/cookie-consent.tsx` — GDPR 쿠키 동의 배너

**Step 1: GA4 스크립트 추가**

`frontend/app/[locale]/layout.tsx`에 `<Script>` 태그로 GA4 삽입:

```tsx
import Script from "next/script";

// GA_MEASUREMENT_ID는 환경변수로
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
  strategy="afterInteractive"
/>
<Script id="ga4" strategy="afterInteractive">
  {`window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');`}
</Script>
```

**Step 2: CSP 업데이트**

`frontend/next.config.ts`의 CSP에 `*.googletagmanager.com`, `*.google-analytics.com` 추가.

**Step 3: 쿠키 동의 배너**

GDPR 준수를 위한 간단한 쿠키 동의 컴포넌트. localStorage에 동의 상태 저장. 동의 전에는 GA 스크립트 비활성.

**Step 4: 커밋**

```bash
git commit -m "feat: add Google Analytics 4 with GDPR cookie consent banner"
```

---

### Task 6: Google Search Console 설정

**코드 변경 아닌 외부 작업:**
- Google Search Console에 tomdnow.com 등록
- sitemap.xml 제출
- 인덱싱 요청

이 작업은 코드 변경이 아닌 수동 설정.

---

## Phase 2: 기능 확장 (1-3개월)

### Task 7: HWP/HWPX 변환 지원

**Files:**
- Install (backend): `python-hwp` 또는 `pyhwp`, `olefile`, `lxml`
- Create: `backend/hwp_converter.py` — HWP/HWPX 파싱 로직
- Modify: `backend/converter.py` — SUPPORTED_FILE_TYPES에 hwp/hwpx 추가, convert_file에 분기 추가
- Modify: `backend/requirements.txt` — 의존성 추가
- Create: `backend/tests/test_hwp_converter.py`
- Modify: `frontend/lib/tools.ts` — hwp, hwpx 도구 추가
- Create: `frontend/app/[locale]/hwp-to-markdown/page.tsx`
- Create: `frontend/app/[locale]/hwpx-to-markdown/page.tsx`
- Modify: `frontend/messages/en.json` (+ 7개 언어) — hwp/hwpx 번역 키

**Step 1: HWP/HWPX 파서 리서치 및 구현**

HWPX는 ZIP 안에 XML이므로 `zipfile` + `lxml`로 파싱 가능:

```python
# backend/hwp_converter.py
import zipfile
from lxml import etree

def convert_hwpx(content: bytes) -> str:
    """HWPX (Open XML) → Markdown 변환"""
    # HWPX = ZIP containing Contents/section*.xml
    # 각 section XML에서 텍스트/테이블/이미지 추출
    ...

def convert_hwp(content: bytes) -> str:
    """HWP (binary OLE) → Markdown 변환"""
    # olefile로 OLE 컨테이너 파싱
    # BodyText/Section* 스트림에서 텍스트 추출
    ...
```

HWP 바이너리 포맷은 복잡하므로, 먼저 HWPX 지원 후 HWP 점진 구현.

**Step 2: converter.py에 통합**

```python
SUPPORTED_FILE_TYPES = {
    # ... 기존 타입들
    "hwp", "hwpx",
}

def convert_file(content, filename, file_type):
    if file_type == "hwpx":
        from hwp_converter import convert_hwpx
        markdown = convert_hwpx(content)
        return {"markdown": markdown, "metadata": {...}}
    elif file_type == "hwp":
        from hwp_converter import convert_hwp
        markdown = convert_hwp(content)
        return {"markdown": markdown, "metadata": {...}}
    # ... 기존 markitdown 경로
```

**Step 3: 프론트엔드 도구 등록**

`frontend/lib/tools.ts`에 hwp, hwpx 도구 추가 (기존 패턴 따름).
각 도구별 전용 페이지 + 8개 언어 번역.

**Step 4: 테스트**

```bash
cd backend && python -m pytest tests/test_hwp_converter.py -v
cd frontend && npm test
```

**Step 5: 커밋**

```bash
git commit -m "feat: add HWP/HWPX to Markdown conversion support"
```

---

### Task 8: 배치 처리 기능

**Files:**
- Modify: `backend/main.py` — `POST /convert/batch` 엔드포인트 추가
- Modify: `frontend/components/file-uploader.tsx` — 다중 파일 지원
- Modify: `frontend/components/converter-page.tsx` — 배치 결과 UI
- Modify: `frontend/lib/api.ts` — `convertBatch()` 함수 추가
- Create: `backend/tests/test_batch.py`

**Step 1: 백엔드 배치 엔드포인트**

```python
@app.post("/convert/batch")
async def convert_batch_endpoint(
    request: Request,
    files: list[UploadFile] = File(...),
):
    rate_limiter.check(request.client.host)
    if len(files) > 5:
        raise ConversionError("Maximum 5 files per batch", 400)

    results = []
    for file in files:
        content = await file.read()
        file_type = file.filename.rsplit(".", 1)[-1].lower()
        result = await run_conversion(convert_file, content, file.filename, file_type)
        results.append(result)

    return {"results": results}
```

**Step 2: 프론트엔드 다중 파일 업로드**

`file-uploader.tsx` 수정 — `multiple` 속성 + 파일 목록 표시 + 진행률.

**Step 3: 테스트 및 커밋**

```bash
git commit -m "feat: add batch file conversion (up to 5 files)"
```

---

### Task 9: REST API (공개 API v1)

**Files:**
- Create: `backend/api_v1.py` — API v1 라우터
- Create: `backend/api_keys.py` — API 키 관리 (SQLite 기반)
- Modify: `backend/main.py` — v1 라우터 마운트
- Create: `frontend/app/[locale]/docs/api/page.tsx` — API 문서 페이지
- Modify: `backend/requirements.txt` — 추가 의존성

**Step 1: API 키 관리**

```python
# backend/api_keys.py
import sqlite3
import secrets
import hashlib

DB_PATH = "api_keys.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""CREATE TABLE IF NOT EXISTS api_keys (
        key_hash TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        tier TEXT DEFAULT 'free',
        daily_limit INTEGER DEFAULT 50,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )""")
    conn.commit()
    conn.close()

def create_api_key(email: str) -> str:
    key = f"tmd_{secrets.token_urlsafe(32)}"
    key_hash = hashlib.sha256(key.encode()).hexdigest()
    # ... insert into DB
    return key

def validate_api_key(key: str) -> dict | None:
    key_hash = hashlib.sha256(key.encode()).hexdigest()
    # ... lookup and check daily limit
    return {"email": ..., "tier": ..., "remaining": ...}
```

**Step 2: API v1 엔드포인트**

```python
# backend/api_v1.py
from fastapi import APIRouter, Header

router = APIRouter(prefix="/api/v1")

@router.post("/convert")
async def api_convert(
    file: UploadFile,
    x_api_key: str = Header(...),
):
    user = validate_api_key(x_api_key)
    if not user:
        raise HTTPException(401, "Invalid API key")
    # ... 기존 변환 로직 재사용
```

**Step 3: API 문서 페이지**

프론트엔드에 인터랙티브 API 문서 (curl 예시, 응답 포맷 등).

**Step 4: 커밋**

```bash
git commit -m "feat: add public REST API v1 with API key authentication"
```

---

### Task 10: AI 기능 — OCR

**Files:**
- Install (backend): `pytesseract` (Tesseract OCR 래퍼)
- Modify: `backend/converter.py` — OCR 경로 추가
- Modify: `backend/Dockerfile` — Tesseract 설치
- Create: `backend/tests/test_ocr.py`

**Step 1: Dockerfile에 Tesseract 추가**

```dockerfile
RUN apt-get update && apt-get install -y tesseract-ocr tesseract-ocr-kor tesseract-ocr-jpn && rm -rf /var/lib/apt/lists/*
```

**Step 2: OCR 변환 로직**

```python
import pytesseract
from PIL import Image
import io

def ocr_to_markdown(content: bytes, lang: str = "eng") -> str:
    image = Image.open(io.BytesIO(content))
    text = pytesseract.image_to_string(image, lang=lang)
    return text
```

**Step 3: 커밋**

```bash
git commit -m "feat: add OCR support with Tesseract for image-to-markdown"
```

---

### Task 11: 추가 포맷 (RTF, TXT)

**Files:**
- Modify: `backend/converter.py` — rtf, txt 지원
- Modify: `frontend/lib/tools.ts` — 도구 추가
- Create: 각 포맷별 페이지 + 번역

RTF와 TXT는 MarkItDown이 이미 지원하거나 단순 텍스트 읽기로 처리 가능.
SUPPORTED_FILE_TYPES에 추가하고, 프론트엔드 도구 등록.

---

## Phase 3: 수익화 (3-6개월)

### Task 12: Google AdSense 통합

**Files:**
- Modify: `frontend/app/[locale]/layout.tsx` — AdSense 스크립트
- Create: `frontend/components/ad-unit.tsx` — 광고 컴포넌트
- Modify: `frontend/next.config.ts` — CSP에 AdSense 도메인 허용
- Modify: `frontend/app/[locale]/blog/[slug]/page.tsx` — 블로그 내 광고

**Step 1: AdSense 스크립트**

```tsx
<Script
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
  data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
  strategy="afterInteractive"
  crossOrigin="anonymous"
/>
```

**Step 2: 광고 컴포넌트**

```tsx
// frontend/components/ad-unit.tsx
"use client";
import { useEffect } from "react";

export function AdUnit({ slot, format = "auto" }: { slot: string; format?: string }) {
  useEffect(() => {
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}
  }, []);

  return (
    <ins className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
```

**Step 3: 배치 원칙**
- 블로그 글 중간/하단
- 변환 결과 하단 (변환 UX 방해 금지)
- 도구 사용 흐름에는 광고 최소화

---

### Task 13: Freemium 결제 시스템 (Stripe)

**Files:**
- Install (frontend): `@stripe/stripe-js`, `stripe`
- Create: `frontend/app/[locale]/pricing/page.tsx` — 가격 페이지
- Create: `frontend/app/api/stripe/checkout/route.ts` — 결제 세션 생성
- Create: `frontend/app/api/stripe/webhook/route.ts` — 웹훅 처리
- Create: `backend/auth.py` — 사용자 인증 (이메일 기반)
- Create: `backend/plans.py` — 플랜/구독 관리

**Step 1: Stripe 설정**

- Stripe 대시보드에서 Pro ($5-9/월), Team ($15-25/월) 상품 생성
- Webhook 엔드포인트 등록

**Step 2: 가격 페이지**

Free / Pro / Team 비교 카드 UI. 8개 언어 번역.

**Step 3: 결제 흐름**

```
사용자 → 가격 페이지 → Stripe Checkout → 웹훅 → API 키 발급/업그레이드
```

---

### Task 14: 사용자 대시보드

**Files:**
- Create: `frontend/app/[locale]/dashboard/page.tsx` — API 키 관리, 사용량 조회
- Create: `frontend/app/api/auth/` — 인증 API (이메일 매직링크)

간단한 이메일 기반 로그인 → API 키 관리 + 사용량 차트 + 구독 관리.

---

## Phase 4: 브랜드 & 확장 (6개월+)

### Task 15: Product Hunt 런칭 준비

**코드 변경:**
- Create: `frontend/app/[locale]/launch/page.tsx` — 런칭 랜딩페이지
- 로고/아이콘 정비 (public/ 디렉토리)

**외부 작업:**
- Product Hunt 프로필 생성
- 런칭 에셋 (스크린샷, GIF, 설명) 준비
- Phase 2 API 출시 시점에 맞춰 런칭

### Task 16: G2 / Capterra 등록

외부 작업 — Pro 플랜 출시 후 진행.

### Task 17: VS Code 확장 프로그램

**Files:**
- Create: `vscode-extension/` 디렉토리
- `package.json`, `src/extension.ts`
- API v1을 호출하여 에디터 내 변환

### Task 18: CLI 도구

**Files:**
- Create: `cli/` 디렉토리
- npm 패키지 또는 pip 패키지
- `tomd convert file.pdf` → 마크다운 출력

### Task 19: PWA 모바일 대응

**Files:**
- Create: `frontend/public/manifest.json`
- Modify: `frontend/app/[locale]/layout.tsx` — PWA 메타 태그
- Create: `frontend/public/icons/` — 앱 아이콘

---

## 전체 실행 순서 요약

```
Phase 1 (Week 1-4):
  Task 1  → 보안 전용 페이지
  Task 2  → 홈페이지 신뢰 배지
  Task 3  → Schema.org 보강
  Task 4  → MDX 블로그 시스템
  Task 5  → Google Analytics 4
  Task 6  → Search Console (수동)

Phase 2 (Month 2-4):
  Task 7  → HWP/HWPX 지원 ★
  Task 8  → 배치 처리
  Task 9  → REST API v1
  Task 10 → AI OCR
  Task 11 → 추가 포맷

Phase 3 (Month 4-6):
  Task 12 → Google AdSense
  Task 13 → Stripe Freemium
  Task 14 → 사용자 대시보드

Phase 4 (Month 6+):
  Task 15 → Product Hunt
  Task 16 → G2/Capterra
  Task 17 → VS Code 확장
  Task 18 → CLI 도구
  Task 19 → PWA
```
