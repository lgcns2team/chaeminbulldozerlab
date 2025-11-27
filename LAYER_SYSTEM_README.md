# 지도 레이어 필터 시스템 구현 완료

## 개요
역사 지도 학습 서비스에 교육적 가치를 높이기 위한 **지도 레이어 필터 시스템**을 구현했습니다.

## 주요 기능

### 1. 레이어 필터 버튼 (4가지 모드)
지도 왼쪽 상단에 4개의 필터 버튼이 표시됩니다:

- **🗺️ 기본** - 순수 지도만 표시 (영토 경계선과 수도만)
- **⚔️ 전투** - 주요 역사적 전투 위치 표시
- **🚢 무역** - 주요 무역로와 교역 거점 표시
- **👑 인물** - 역사적 인물과 활동 지역 표시

### 2. 시대별 맞춤 데이터
각 레이어는 현재 선택된 **시대에 맞는 역사 데이터**만 표시합니다:

#### 전투 데이터 (15개 시대별)
- 삼국시대(475년): 관미성 전투, 평양성 전투
- 통일신라(700년): 살수대첩, 황산벌 전투, 안시성 전투
- 고려시대(1100년): 귀주대첩, 처인성 전투
- 조선시대(1600년): 임진왜란, 한산도대첩, 행주대첩, 병자호란

#### 무역 데이터
- 고대: 실크로드, 낙랑무역
- 통일신라: 신라-당 무역, 장보고 해상무역
- 고려: 고려-송 무역, 고려청자 수출
- 조선: 조공무역, 개항장 무역

#### 인물 데이터
- 삼국시대: 광개토대왕, 장수왕, 근초고왕
- 통일신라: 을지문덕, 김유신, 계백, 대조영, 장보고
- 고려: 왕건, 서희, 강감찬, 김부식
- 조선: 세종대왕, 이순신, 정약용

### 3. 인터랙티브 팝업
각 마커를 클릭하면 상세 정보가 팝업으로 표시됩니다:

#### 전투 마커 (빨간색 ⚔️)
```
⚔️ 관미성 전투
📅 475년
참전: 고구려, 백제
결과: 고구려 승리
```

#### 무역 마커 (파란색 🚢)
```
🚢 장보고 해상무역
교역로: 완도-당-일본
주요 품목: 도자기, 차, 직물, 노예
```

#### 인물 마커 (황금색 👑)
```
👑 광개토대왕
직위: 고구려 제19대 왕
시기: 391-413
업적: 영토 확장
```

## 기술 구현

### HTML
```html
<div class="map-layer-controls">
    <button class="layer-btn active" onclick="toggleLayer('default')">🗺️ 기본</button>
    <button class="layer-btn" onclick="toggleLayer('battles')">⚔️ 전투</button>
    <button class="layer-btn" onclick="toggleLayer('trade')">🚢 무역</button>
    <button class="layer-btn" onclick="toggleLayer('people')">👑 인물</button>
</div>
```

### CSS 스타일
- 버튼 컨테이너: 흰색 배경, 둥근 모서리, 그림자 효과
- 버튼 상태:
  - 기본: 흰색 배경, 회색 테두리
  - 호버: 연한 파란색 배경, 파란색 테두리
  - 활성화: 파란색 배경, 흰색 텍스트
- 마커 스타일:
  - 전투: 빨간색 (#ef4444)
  - 무역: 파란색 (#3b82f6)
  - 인물: 주황색 (#f59e0b)

### JavaScript 기능

#### 전역 변수
```javascript
let currentLayerType = 'default';  // 현재 활성 레이어
let eventMarkers = [];              // 이벤트 마커 배열
```

#### 핵심 함수
1. **toggleLayer(layerType)** - 레이어 전환
2. **clearEventMarkers()** - 기존 마커 제거
3. **showBattleMarkers(year)** - 전투 마커 표시
4. **showTradeMarkers(year)** - 무역 마커 표시
5. **showPeopleMarkers(year)** - 인물 마커 표시

#### 시대 변경 시 레이어 유지
```javascript
function updateYear(year) {
    // ... 기존 코드 ...
    
    // 현재 활성화된 레이어 다시 표시
    if (currentLayerType !== 'default') {
        clearEventMarkers();
        switch(currentLayerType) {
            case 'battles': showBattleMarkers(currentYear); break;
            case 'trade': showTradeMarkers(currentYear); break;
            case 'people': showPeopleMarkers(currentYear); break;
        }
    }
}
```

## 데이터 구조

### 전투 데이터
```javascript
battleData = {
    '300_500': [
        {
            name: '관미성 전투',
            year: 475,
            lat: 37.4,
            lng: 127.1,
            participants: ['고구려', '백제'],
            outcome: '고구려 승리'
        }
    ]
}
```

### 무역 데이터
```javascript
tradeData = {
    '700_900': [
        {
            name: '장보고 해상무역',
            route: '완도-당-일본',
            lat: 34.3,
            lng: 126.7,
            goods: ['도자기', '차', '직물', '노예']
        }
    ]
}
```

### 인물 데이터
```javascript
peopleData = {
    '300_500': [
        {
            name: '광개토대왕',
            title: '고구려 제19대 왕',
            lat: 41.1,
            lng: 126.2,
            years: '391-413',
            achievements: '영토 확장'
        }
    ]
}
```

## 사용 방법

1. **서버 실행**
   ```bash
   python -m http.server 8000
   ```

2. **브라우저 접속**
   ```
   http://localhost:8000/history-learning-app.html
   ```

3. **레이어 필터 사용**
   - 지도 왼쪽 상단의 버튼 클릭
   - 원하는 레이어(전투/무역/인물) 선택
   - 마커 클릭하여 상세 정보 확인
   - 시대 슬라이더를 움직여도 선택한 레이어 유지됨

## 특징

### 교육적 가치
- **맥락적 학습**: 단순 영토 변화뿐 아니라 그 시대의 전투, 무역, 인물을 함께 학습
- **시각적 이해**: 역사적 사건의 지리적 위치를 직관적으로 파악
- **통합적 관점**: 정치사, 경제사, 인물사를 종합적으로 이해

### 기술적 장점
- **레이어 지속성**: 시대 변경 시에도 선택한 레이어 유지
- **성능 최적화**: 필요한 시대의 데이터만 로드
- **반응형 디자인**: 모바일에서도 사용 가능
- **직관적 UI**: 이모지와 색상으로 레이어 구분

## 파일 수정 내역

### 1. history-learning-app.html
- 지도 컨테이너에 레이어 필터 버튼 추가

### 2. styles/main.css
- `.map-layer-controls` 스타일 추가
- `.layer-btn` 스타일 추가 (기본, 호버, 활성 상태)
- `.event-marker-content` 스타일 추가
- 반응형 미디어 쿼리 추가

### 3. scripts/app.js
- `currentLayerType`, `eventMarkers` 전역 변수 추가
- `battleData`, `tradeData`, `peopleData` 데이터 구조 추가
- `toggleLayer()` 함수 구현
- `clearEventMarkers()` 함수 구현
- `showBattleMarkers()` 함수 구현
- `showTradeMarkers()` 함수 구현
- `showPeopleMarkers()` 함수 구현
- `updateYear()` 함수에 레이어 유지 로직 추가

## 향후 확장 가능성

### 데이터 추가
- 더 많은 전투 데이터 (지방 전투, 해전 등)
- 무역로 라인 시각화 (polyline)
- 인물 이동 경로 표시
- 문화유산 위치 레이어

### 기능 추가
- 레이어 다중 선택 (전투+인물 동시 표시)
- 시대별 통계 차트
- 타임라인 애니메이션
- 검색 및 필터링 기능

### 교육 기능
- 레이어별 학습 퀴즈
- 연표 보기 모드
- 역사 카드 컬렉션
- 사건 간 인과관계 설명

## 작동 확인

✅ 레이어 필터 버튼 4개 표시
✅ 버튼 클릭 시 활성화 상태 변경
✅ 전투 마커 표시 (빨간색 ⚔️)
✅ 무역 마커 표시 (파란색 🚢)
✅ 인물 마커 표시 (황금색 👑)
✅ 마커 클릭 시 팝업 표시
✅ 시대 변경 시 레이어 유지
✅ 시대별 맞춤 데이터 로드
✅ 반응형 디자인 적용

---

**구현 완료일**: 2024년
**버전**: 1.0
**개발자**: GitHub Copilot
