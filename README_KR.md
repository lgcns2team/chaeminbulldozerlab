# 동아시아 역사 지도 학습 서비스

## ⚠️ 중요: 서버 실행 필수!
이 프로젝트는 **반드시 서버를 통해 실행**해야 합니다. 
`history-learning-app.html` 파일을 직접 더블클릭하면 CORS 오류로 지도가 표시되지 않습니다.

## 🚀 빠른 시작

### 방법 1: Python 서버 (추천)
```bash
# 1. 저장소 클론
git clone https://github.com/lgcns2team/frontend.git
cd frontend
git checkout chaemin

# 2. 프로젝트 폴더에서 서버 실행
python -m http.server 8000

# 3. 브라우저에서 열기
# http://localhost:8000/history-learning-app.html
```

### 방법 2: VS Code Live Server
1. VS Code에서 이 폴더 열기
2. Live Server 확장 설치: https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer
3. `history-learning-app.html` 우클릭 → "Open with Live Server"

### 방법 3: Node.js (npm 설치 필요)
```bash
npm start
# 자동으로 브라우저가 열립니다
```

### 방법 4: 다른 간단한 서버
```bash
# PHP가 설치되어 있다면
php -S localhost:8000

# Ruby가 설치되어 있다면
ruby -run -ehttpd . -p8000
```

## ❌ 주의사항
- ❌ `history-learning-app.html` 파일 직접 열기 (파일 경로: `file:///...`)
- ✅ 서버를 통해 열기 (웹 주소: `http://localhost:8000/...`)

## 📝 기능
- 📜 시대별 동아시아 역사 지도 (BC 2000 ~ 현재)
- 🗺️ 인터랙티브 지도 탐색 (확대/축소/이동)
- ⭐ 시대별 수도 표시
- 🎯 국가별 색상 구분 및 클릭/호버 효과
- 📅 타임라인 슬라이더로 시대 전환

## 🛠️ 기술 스택
- Leaflet.js 1.9.4 (지도)
- D3.js v5 (GeoJSON 로딩)
- OpenStreetMap 타일
- Vanilla JavaScript

## 🐛 문제 해결

### "404 Not Found" 오류
→ **원인**: 서버를 실행하지 않고 파일을 직접 열었거나, 잘못된 폴더에서 서버를 실행했습니다.  
→ **해결**: 프로젝트 **루트 폴더**에서 서버를 실행하세요. (`history-learning-app.html`이 있는 위치)

### 지도가 표시되지 않음
→ **원인**: CORS 정책으로 인해 로컬 파일 접근이 차단되었습니다.  
→ **해결**: 반드시 서버를 통해 실행하세요. (위의 방법 1~4 참고)

### GeoJSON 파일 로딩 실패
→ **원인**: `geojson/` 폴더가 없거나, 상대 경로가 잘못되었습니다.  
→ **해결**: 
  1. 저장소를 다시 클론하세요
  2. `geojson/` 폴더가 있는지 확인하세요
  3. 서버를 프로젝트 루트에서 실행하세요

