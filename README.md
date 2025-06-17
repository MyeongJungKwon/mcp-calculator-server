# Calculator MCP Server

간단한 4칙연산을 수행하는 MCP (Model Context Protocol) 서버입니다.

## 🚀 Vercel 배포 방법

### 1. Vercel에 GitHub 저장소 연결
1. [Vercel Dashboard](https://vercel.com)에 로그인
2. "Add New..." → "Project" 클릭
3. GitHub 저장소 "mcp-calculator-server" 선택
4. 프로젝트 설정에서 다음 확인:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: (비워둠)
   - Output Directory: (비워둠)
5. "Deploy" 클릭

### 2. 배포된 URL 확인
배포 완료 후 Vercel이 제공하는 URL 형식:
- `https://[프로젝트명].vercel.app/api/mcp`
- 예: `https://mcp-calculator-server.vercel.app/api/mcp`

## 📋 엔드포인트

### API Routes (Vercel)
- **Root**: `/api/` - 서버 정보
- **Health Check**: `/api/health` - 상태 확인
- **MCP Endpoint**: `/api/mcp` - MCP 프로토콜 (POST)

### 로컬 서버
- **Root**: `http://localhost:3001/`
- **Health Check**: `http://localhost:3001/health`
- **MCP Endpoint**: `http://localhost:3001/mcp`

## 🔧 Claude 통합 방법

### Claude "통합 추가하기" 사용
1. Claude 인터페이스에서 "통합 추가" 클릭
2. "URL로 연결" 선택
3. Vercel URL 입력: `https://[프로젝트명].vercel.app/api/mcp`
4. 연결 테스트 후 저장

## 📁 프로젝트 구조

```
mcp_test/
├── api/              # Vercel API Routes
│   ├── index.js      # Root endpoint
│   ├── health.js     # Health check
│   └── mcp.js        # MCP protocol handler
├── server.js         # 로컬 개발 서버
├── package.json      # 프로젝트 설정
├── vercel.json       # Vercel 배포 설정
└── README.md         # 이 파일
```

## 💻 로컬 개발

### 1. 의존성 설치
```bash
npm install
```

### 2. 로컬 서버 실행
```bash
npm start
```

### 3. 개발 모드 (자동 재시작)
```bash
npm run dev
```

## 🧮 지원 기능

- **덧셈 (add)**: 두 숫자를 더합니다
- **뺄셈 (subtract)**: 첫 번째 숫자에서 두 번째 숫자를 뺍니다
- **곱셈 (multiply)**: 두 숫자를 곱합니다
- **나눗셈 (divide)**: 첫 번째 숫자를 두 번째 숫자로 나눅니다

## 📝 업데이트 내역

### 2025-06-17
- MCP 프로토콜 버전을 표준 `0.1.0`으로 통일
- Vercel 배포 설정 수정 (API Routes 사용)
- Claude "통합 추가하기" 호환성 개선
- 문서 개선 및 정확한 배포 가이드 추가

## 🐛 문제 해결

### Vercel 404 에러
- URL이 정확한지 확인: `/api/mcp` (끝에 슬래시 없음)
- Vercel Dashboard에서 Functions 탭 확인
- 배포 로그에서 에러 확인

### Claude가 tools/list를 요청하지 않음
- `initialize` 응답에 `capabilities.tools: {}` 포함 확인
- Protocol version이 `0.1.0`인지 확인
- 서버 로그 확인

## 📦 기술 스택

- Node.js 18+
- MCP Protocol 0.1.0
- Vercel Serverless Functions