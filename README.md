# Calculator MCP Server

간단한 4칙연산을 수행하는 MCP (Model Context Protocol) 서버입니다.

## 🚀 배포된 서버

**Vercel에 배포된 HTTPS 서버**: `https://your-app.vercel.app/api/mcp`

## 업데이트 내역

### 2025-06-17
- MCP 프로토콜 버전을 표준 `0.1.0`으로 변경
- Claude "통합 추가하기" 기능과의 호환성 개선
- `capabilities.tools` 응답 최적화

## 기능

- **덧셈 (add)**: 두 숫자를 더합니다
- **뺄셈 (subtract)**: 첫 번째 숫자에서 두 번째 숫자를 뺍니다  
- **곱셈 (multiply)**: 두 숫자를 곱합니다
- **나눗셈 (divide)**: 첫 번째 숫자를 두 번째 숫자로 나눕니다

## 로컬 개발

### 1. 의존성 설치
```bash
npm install
```

### 2. 로컬 서버 실행
```bash
npm start
```

### 3. Vercel 로컬 개발
```bash
npm run vercel-dev
```

## 배포

### Vercel 배포
```bash
# Vercel CLI 설치 (글로벌)
npm install -g vercel

# 프로덕션 배포
npm run deploy
```

## 엔드포인트

### 로컬
- **Root**: `http://localhost:3001/`
- **Health Check**: `http://localhost:3001/health`
- **MCP Endpoint**: `http://localhost:3001/mcp`

### Vercel 배포
- **Root**: `https://your-app.vercel.app/api/index`
- **Health Check**: `https://your-app.vercel.app/api/health`
- **MCP Endpoint**: `https://your-app.vercel.app/api/mcp`

## Claude 통합 추가 방법

### HTTPS (배포된 서버 - 권장)
1. Claude 인터페이스에서 "통합 추가" 클릭
2. "URL로 연결" 선택  
3. URL 입력: `https://your-app.vercel.app/api/mcp`
4. 연결 완료 후 계산 기능 사용 가능

### HTTP (로컬 테스트용)
1. URL 입력: `http://localhost:3001/mcp`

## Git 저장소 설정

```bash
git init
git add .
git commit -m "Initial commit - Calculator MCP Server"
git branch -M main
git remote add origin https://github.com/your-username/mcp-calculator.git
git push -u origin main
```

## 사용 예시

연결 후 Claude에서 다음과 같이 사용할 수 있습니다:

- "15와 27을 더해줘"
- "100에서 35를 빼줘"  
- "8과 12를 곱해줘"
- "144를 12로 나눠줘"

## 개발 모드

파일 변경 시 자동 재시작:
```bash
npm run dev
```

## 기술 스택

- Node.js
- Express.js
- MCP SDK
- CORS
