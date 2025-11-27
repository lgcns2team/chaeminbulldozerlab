// ===================================
// 전역 변수
// ===================================
let currentYear = 475;
let currentEra = '삼국시대';
let currentScreen = 'screen-main-map';
let debateTimer = 600; // 10분 = 600초
let debateInterval = null;
let map = null;
let historicalLayer = null;
let capitalMarkers = [];

// 시대별 동아시아 수도 데이터
const capitalData = {
    // BC 시대
    '-2000_-1000': [
        { name: '상(商)', capital: '은허', lat: 36.1, lng: 114.3, country: '중국 상나라' },
        { name: '고조선', capital: '왕검성(추정)', lat: 39.0, lng: 125.7, country: '고조선' }
    ],
    '-1000_-500': [
        { name: '주(周)', capital: '호경', lat: 34.3, lng: 108.9, country: '중국 주나라' },
        { name: '고조선', capital: '왕검성', lat: 39.0, lng: 125.7, country: '고조선' }
    ],
    '-500_0': [
        { name: '진(秦)', capital: '함양', lat: 34.3, lng: 108.7, country: '중국 진나라' },
        { name: '고조선', capital: '왕검성', lat: 39.0, lng: 125.7, country: '고조선' }
    ],
    // 기원후 ~ 삼국시대
    '0_300': [
        { name: '한(漢)', capital: '장안', lat: 34.3, lng: 108.9, country: '중국 한나라' },
        { name: '고구려', capital: '국내성', lat: 41.1, lng: 126.2, country: '고구려' },
        { name: '백제', capital: '위례성', lat: 37.5, lng: 127.0, country: '백제' },
        { name: '신라', capital: '서라벌', lat: 35.8, lng: 129.2, country: '신라' }
    ],
    '300_500': [
        { name: '진(晉)', capital: '낙양', lat: 34.6, lng: 112.4, country: '중국 진나라' },
        { name: '고구려', capital: '국내성', lat: 41.1, lng: 126.2, country: '고구려' },
        { name: '백제', capital: '한성', lat: 37.5, lng: 127.0, country: '백제' },
        { name: '신라', capital: '경주', lat: 35.8, lng: 129.2, country: '신라' }
    ],
    '500_700': [
        { name: '수/당', capital: '장안', lat: 34.3, lng: 108.9, country: '중국 수당' },
        { name: '고구려', capital: '평양', lat: 39.0, lng: 125.7, country: '고구려' },
        { name: '백제', capital: '사비(부여)', lat: 36.3, lng: 126.9, country: '백제' },
        { name: '신라', capital: '경주', lat: 35.8, lng: 129.2, country: '신라' }
    ],
    '700_900': [
        { name: '당', capital: '장안', lat: 34.3, lng: 108.9, country: '중국 당나라' },
        { name: '신라', capital: '경주', lat: 35.8, lng: 129.2, country: '통일신라' },
        { name: '발해', capital: '상경', lat: 44.0, lng: 129.5, country: '발해' },
        { name: '일본', capital: '헤이안쿄', lat: 35.0, lng: 135.7, country: '일본' }
    ],
    '900_1100': [
        { name: '송', capital: '개봉', lat: 34.8, lng: 114.3, country: '중국 송나라' },
        { name: '고려', capital: '개경', lat: 37.9, lng: 126.6, country: '고려' },
        { name: '일본', capital: '교토', lat: 35.0, lng: 135.7, country: '일본' }
    ],
    '1100_1300': [
        { name: '금/원', capital: '대도(북경)', lat: 39.9, lng: 116.4, country: '중국 원나라' },
        { name: '고려', capital: '개경', lat: 37.9, lng: 126.6, country: '고려' },
        { name: '일본', capital: '교토', lat: 35.0, lng: 135.7, country: '일본' }
    ],
    '1300_1400': [
        { name: '명', capital: '남경', lat: 32.0, lng: 118.8, country: '중국 명나라' },
        { name: '고려', capital: '개경', lat: 37.9, lng: 126.6, country: '고려' },
        { name: '일본', capital: '교토', lat: 35.0, lng: 135.7, country: '일본' }
    ],
    '1400_1600': [
        { name: '명', capital: '북경', lat: 39.9, lng: 116.4, country: '중국 명나라' },
        { name: '조선', capital: '한성', lat: 37.57, lng: 126.98, country: '조선' },
        { name: '일본', capital: '교토', lat: 35.0, lng: 135.7, country: '일본' }
    ],
    '1600_1800': [
        { name: '청', capital: '북경', lat: 39.9, lng: 116.4, country: '중국 청나라' },
        { name: '조선', capital: '한양', lat: 37.57, lng: 126.98, country: '조선' },
        { name: '일본', capital: '에도', lat: 35.7, lng: 139.7, country: '일본(에도시대)' }
    ],
    '1800_1900': [
        { name: '청', capital: '북경', lat: 39.9, lng: 116.4, country: '중국 청나라' },
        { name: '조선', capital: '한성', lat: 37.57, lng: 126.98, country: '조선' },
        { name: '일본', capital: '도쿄', lat: 35.7, lng: 139.7, country: '일본(메이지)' }
    ],
    '1900_1945': [
        { name: '중화민국', capital: '북경/남경', lat: 39.9, lng: 116.4, country: '중화민국' },
        { name: '대한제국', capital: '한성', lat: 37.57, lng: 126.98, country: '대한제국' },
        { name: '일본', capital: '도쿄', lat: 35.7, lng: 139.7, country: '일본제국' }
    ],
    '1945_2024': [
        { name: '중국', capital: '북경', lat: 39.9, lng: 116.4, country: '중화인민공화국' },
        { name: '대한민국', capital: '서울', lat: 37.57, lng: 126.98, country: '대한민국' },
        { name: '조선민주주의인민공화국', capital: '평양', lat: 39.0, lng: 125.7, country: '북한' },
        { name: '일본', capital: '도쿄', lat: 35.7, lng: 139.7, country: '일본' }
    ]
};

// ===================================
// 지도 초기화
// ===================================
function initMap() {
    try {
        // Leaflet 지도 생성 - 동아시아 중심
        map = L.map('map', {
            center: [37.5, 120.0], // 동아시아 중심
            zoom: 5,
            zoomControl: true,
            maxZoom: 10,
            minZoom: 3
        });

        // OpenStreetMap 타일 레이어 추가 (베이스맵)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            opacity: 0.3
        }).addTo(map);

        console.log('지도 초기화 완료');

        // 역사 지도 데이터 로드
        loadHistoricalMap(currentYear);
        
        // 수도 마커 표시
        updateCapitalMarkers(currentYear);
    } catch (error) {
        console.error('지도 초기화 오류:', error);
        // 지도 초기화 실패 시 기본 마커 표시
        addDefaultMarkers();
    }
}

// 역사 지도 데이터 로드
function loadHistoricalMap(year) {
    // 기존 레이어 완전히 제거
    if (historicalLayer) {
        try {
            map.removeLayer(historicalLayer);
            historicalLayer = null;
        } catch (e) {
            console.log('레이어 제거 중 오류:', e);
        }
    }

    // 연도에 맞는 GeoJSON 파일 선택
    let geojsonFile = getGeojsonFileForYear(year);
    
    // D3를 사용하여 GeoJSON 로드
    if (typeof d3 !== 'undefined') {
        d3.json(geojsonFile)
            .then(function(data) {
                if (data) {
                    // 기존 레이어 다시 한번 확인 후 제거
                    if (historicalLayer) {
                        map.removeLayer(historicalLayer);
                        historicalLayer = null;
                    }
                    
                    // 동아시아 영역만 필터링 (경도 70~150, 위도 15~60)
                    const filteredFeatures = data.features.filter(feature => {
                        if (!feature.geometry || !feature.geometry.coordinates) return false;
                        
                        // 폴리곤의 중심점이 동아시아 범위 내에 있는지 확인
                        try {
                            let coords = feature.geometry.coordinates;
                            if (feature.geometry.type === 'Polygon') {
                                // 첫 번째 좌표 링의 중간값 계산
                                let lngs = coords[0].map(c => c[0]);
                                let lats = coords[0].map(c => c[1]);
                                let centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
                                let centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
                                return centerLng >= 70 && centerLng <= 150 && centerLat >= 15 && centerLat <= 60;
                            } else if (feature.geometry.type === 'MultiPolygon') {
                                // MultiPolygon의 경우 첫 번째 폴리곤만 체크
                                let lngs = coords[0][0].map(c => c[0]);
                                let lats = coords[0][0].map(c => c[1]);
                                let centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
                                let centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
                                return centerLng >= 70 && centerLng <= 150 && centerLat >= 15 && centerLat <= 60;
                            }
                        } catch (e) {
                            return false;
                        }
                        return false;
                    });
                    
                    // 필터링된 데이터로 새 GeoJSON 객체 생성
                    const filteredData = {
                        type: 'FeatureCollection',
                        features: filteredFeatures
                    };
                    
                    historicalLayer = L.geoJSON(filteredData, {
                        style: function(feature) {
                            return {
                                fillColor: getColorByCountry(feature.properties.NAME),
                                weight: 2,
                                opacity: 1,
                                color: '#ffffff',
                                fillOpacity: 0.5,  // 투명도 낮춰서 겹침 보이게
                                smoothFactor: 1,
                                dashArray: null,
                                interactive: true  // 클릭 가능하게
                            };
                        },
                        onEachFeature: function(feature, layer) {
                            if (feature.properties && feature.properties.NAME) {
                                // 클릭 이벤트 - 맨 앞으로 가져오고 팝업 열기
                                layer.on('click', function(e) {
                                    e.target.bringToFront();
                                    layer.openPopup();
                                });
                                
                                layer.bindPopup(
                                    `<div style="font-family: sans-serif; padding: 8px;">
                                        <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937;">${feature.properties.NAME}</h3>
                                        <p style="margin: 0; font-size: 13px; color: #6b7280;">${year > 0 ? year + '년' : 'BC ' + Math.abs(year) + '년'}</p>
                                    </div>`,
                                    {
                                        className: 'custom-popup'
                                    }
                                );
                                
                                // 호버 효과
                                layer.on('mouseover', function(e) {
                                    e.target.setStyle({
                                        weight: 3,
                                        color: '#3b82f6',
                                        fillOpacity: 0.75
                                    });
                                    e.target.bringToFront();  // 마우스 오버시 맨 앞으로
                                });
                                
                                layer.on('mouseout', function(e) {
                                    if (historicalLayer) {
                                        historicalLayer.resetStyle(e.target);
                                    }
                                });
                            }
                        }
                    }).addTo(map);
                }
            })
            .catch(function(error) {
                console.log('GeoJSON 로드 중 오류:', error);
                // 기본 마커 표시
                addDefaultMarkers();
            });
    } else {
        // D3가 없으면 기본 마커만 표시
        addDefaultMarkers();
    }
}

// 연도에 맞는 GeoJSON 파일 찾기
function getGeojsonFileForYear(year) {
    if (year <= -2000) {
        return 'geojson/world_bc2000.geojson';
    } else if (year <= -1000) {
        return 'geojson/world_bc1000.geojson';
    } else if (year <= -500) {
        return 'geojson/world_bc500.geojson';
    } else if (year <= 0) {
        return 'geojson/world_bc1.geojson';
    } else if (year <= 100) {
        return 'geojson/world_100.geojson';
    } else if (year <= 300) {
        return 'geojson/world_300.geojson';
    } else if (year <= 500) {
        return 'geojson/world_500.geojson';
    } else if (year <= 700) {
        return 'geojson/world_700.geojson';
    } else if (year <= 900) {
        return 'geojson/world_900.geojson';
    } else if (year <= 1100) {
        return 'geojson/world_1100.geojson';
    } else if (year <= 1300) {
        return 'geojson/world_1279.geojson';
    } else if (year <= 1500) {
        return 'geojson/world_1492.geojson';
    } else if (year <= 1700) {
        return 'geojson/world_1650.geojson';
    } else if (year <= 1800) {
        return 'geojson/world_1783.geojson';
    } else if (year <= 1900) {
        return 'geojson/world_1880.geojson';
    } else if (year <= 1920) {
        return 'geojson/world_1914.geojson';
    } else if (year <= 1940) {
        return 'geojson/world_1938.geojson';
    } else if (year <= 1960) {
        return 'geojson/world_1945.geojson';
    } else if (year <= 2000) {
        return 'geojson/world_1994.geojson';
    } else {
        return 'geojson/world_2010.geojson';
    }
}

// 국가별 색상 지정
function getColorByCountry(name) {
    const colors = {
        '고구려': '#ef4444',
        '백제': '#3b82f6',
        '신라': '#f59e0b',
        '고려': '#8b5cf6',
        '조선': '#10b981',
        '일본': '#dc2626',
        '중국': '#ea580c',
        '당': '#f97316',
        '청': '#0ea5e9',
        '명': '#eab308',
        'Goguryeo': '#ef4444',
        'Baekje': '#3b82f6',
        'Silla': '#f59e0b',
        'Goryeo': '#8b5cf6',
        'Joseon': '#10b981',
        'Japan': '#dc2626',
        'China': '#ea580c',
        'Tang': '#f97316',
        'Qing': '#0ea5e9',
        'Ming': '#eab308',
        'Korea': '#10b981',
        'Korean Empire': '#059669',
        'Mongol Empire': '#b45309',
        'Yuan': '#b45309',
        'Han': '#dc2626',
        'Three Kingdoms': '#6366f1',
        'Gojoseon': '#7c3aed'
    };
    
    // 이름에서 키워드 매칭
    for (let key in colors) {
        if (name && name.includes(key)) {
            return colors[key];
        }
    }
    
    // 기본 색상 (파스텔 톤)
    const defaultColors = [
        '#94a3b8', '#cbd5e1', '#a5b4fc', '#c4b5fd', 
        '#f9a8d4', '#fdba74', '#fcd34d', '#86efac'
    ];
    
    // 이름 해시값으로 색상 선택
    let hash = 0;
    if (name) {
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
    }
    return defaultColors[Math.abs(hash) % defaultColors.length];
}

// 기본 마커 추가 (GeoJSON 로드 실패 시)
function addDefaultMarkers() {
    const markers = [
        { lat: 39.0, lng: 125.7, name: '평양', icon: '🏛️' },
        { lat: 37.5, lng: 126.9, name: '서울', icon: '🏛️' },
        { lat: 35.8, lng: 128.6, name: '경주', icon: '🏛️' }
    ];

    markers.forEach(marker => {
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="font-size:32px;">${marker.icon}</div>`,
            iconSize: [40, 40]
        });

        L.marker([marker.lat, marker.lng], { icon: icon })
            .addTo(map)
            .bindPopup(`<strong>${marker.name}</strong>`);
    });
}

// 시대별 수도 마커 업데이트
function updateCapitalMarkers(year) {
    // 기존 마커 완전히 제거
    if (capitalMarkers && capitalMarkers.length > 0) {
        capitalMarkers.forEach(marker => {
            try {
                map.removeLayer(marker);
            } catch (e) {
                console.log('마커 제거 중 오류:', e);
            }
        });
        capitalMarkers = [];
    }
    
    // 해당 시대 찾기
    let periodKey = getCapitalPeriod(year);
    let capitals = capitalData[periodKey];
    
    if (!capitals) return;
    
    // 약간의 지연 후 마커 추가 (레이어 제거 완료 보장)
    setTimeout(() => {
        // 수도 마커 추가
        capitals.forEach(capital => {
            // 커스텀 마커 아이콘
            const icon = L.divIcon({
                className: 'capital-marker',
                html: `
                    <div class="capital-marker-content">
                        <div class="capital-icon">⭐</div>
                        <div class="capital-label">
                            <div class="capital-name">${capital.name}</div>
                            <div class="capital-city">${capital.capital}</div>
                        </div>
                    </div>
                `,
                iconSize: [120, 50],
                iconAnchor: [60, 25]
            });
            
            const marker = L.marker([capital.lat, capital.lng], { icon: icon })
                .addTo(map)
                .bindPopup(
                    `<div style="font-family: sans-serif; padding: 12px; min-width: 200px;">
                        <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #1f2937; font-weight: 700;">${capital.country}</h3>
                        <p style="margin: 0 0 6px 0; font-size: 14px; color: #3b82f6;">📍 수도: ${capital.capital}</p>
                        <p style="margin: 0; font-size: 13px; color: #6b7280;">${year > 0 ? year + '년' : 'BC ' + Math.abs(year) + '년'}</p>
                    </div>`,
                    {
                        className: 'custom-popup',
                        offset: [0, -20]
                    }
                );
            
            capitalMarkers.push(marker);
        });
    }, 100);
}

// 연도에 맞는 수도 시대 키 찾기
function getCapitalPeriod(year) {
    if (year <= -1000) return '-2000_-1000';
    if (year <= -500) return '-1000_-500';
    if (year <= 0) return '-500_0';
    if (year <= 300) return '0_300';
    if (year <= 500) return '300_500';
    if (year <= 700) return '500_700';
    if (year <= 900) return '700_900';
    if (year <= 1100) return '900_1100';
    if (year <= 1300) return '1100_1300';
    if (year <= 1400) return '1300_1400';
    if (year <= 1600) return '1400_1600';
    if (year <= 1800) return '1600_1800';
    if (year <= 1900) return '1800_1900';
    if (year <= 1945) return '1900_1945';
    return '1945_2024';
}

// ===================================
// 화면 전환 함수
// ===================================
function showScreen(screenId) {
    // 모든 화면 숨기기
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    
    // 선택된 화면 표시
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenId;
    }
}

// ===================================
// 메뉴 토글
// ===================================
function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    
    if (sideMenu && overlay) {
        sideMenu.classList.toggle('open');
        overlay.classList.toggle('active');
    }
}

// ===================================
// A. 메인 지도 화면 기능
// ===================================
function updateYear(year) {
    currentYear = parseInt(year);
    const eraTitle = document.getElementById('era-title');
    const eraYear = document.getElementById('era-year');
    
    if (eraYear) {
        eraYear.textContent = year > 0 ? `${year}년` : `BC ${Math.abs(year)}년`;
    }
    
    // 시대 구분
    if (year < -500) {
        currentEra = '고조선';
    } else if (year < 0) {
        currentEra = '부족국가 시대';
    } else if (year < 57) {
        currentEra = '초기 국가';
    } else if (year < 668) {
        currentEra = '삼국시대';
    } else if (year < 935) {
        currentEra = '남북국 시대';
    } else if (year < 1392) {
        currentEra = '고려';
    } else if (year < 1897) {
        currentEra = '조선';
    } else if (year < 1945) {
        currentEra = '대한제국/일제강점기';
    } else {
        currentEra = '현대';
    }
    
    if (eraTitle) {
        eraTitle.textContent = currentEra;
    }

    // 지도 업데이트
    if (map) {
        loadHistoricalMap(currentYear);
        updateCapitalMarkers(currentYear);
    }
}

function previousYear() {
    const slider = document.getElementById('year-slider');
    if (slider) {
        slider.value = parseInt(slider.value) - 10;
        updateYear(slider.value);
    }
}

function nextYear() {
    const slider = document.getElementById('year-slider');
    if (slider) {
        slider.value = parseInt(slider.value) + 10;
        updateYear(slider.value);
    }
}

function showEventDetail(element) {
    const eventName = element.getAttribute('data-event');
    alert(`사건: ${eventName}\n\n더 자세한 정보는 교과서 보기에서 확인하세요!`);
}

// ===================================
// B. 교과서 보기 화면 기능
// ===================================
function loadChapter(chapterNum) {
    // 모든 챕터 아이템에서 active 제거
    const chapters = document.querySelectorAll('.chapter-item');
    chapters.forEach(ch => ch.classList.remove('active'));
    
    // 선택된 챕터에 active 추가
    if (chapters[chapterNum - 1]) {
        chapters[chapterNum - 1].classList.add('active');
    }
    
    // 실제로는 여기서 해당 챕터의 내용을 로드
    console.log(`챕터 ${chapterNum} 로드`);
}

// ===================================
// C. 인물 선택 화면 기능
// ===================================
function filterCharacters(era) {
    // 필터 버튼 활성화
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // 캐릭터 카드 필터링
    const cards = document.querySelectorAll('.character-card');
    cards.forEach(card => {
        const cardEra = card.getAttribute('data-era');
        if (era === 'all' || cardEra === era) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function selectCharacter(name) {
    const chatTitle = document.getElementById('chat-character-name');
    if (chatTitle) {
        chatTitle.textContent = name;
    }
    showScreen('screen-chat');
}

// ===================================
// D. 인물 대화 화면 기능
// ===================================
function sendMessage() {
    const input = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('chat-messages');
    
    if (!input || !messagesContainer || !input.value.trim()) return;
    
    const messageText = input.value.trim();
    
    // 사용자 메시지 추가
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerHTML = `
        <div class="message-bubble">
            <p>${messageText}</p>
        </div>
        <span class="message-time">${getCurrentTime()}</span>
    `;
    messagesContainer.appendChild(userMessage);
    
    // 입력 필드 초기화
    input.value = '';
    
    // 스크롤 하단으로
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // AI 응답 시뮬레이션 (1초 후)
    setTimeout(() => {
        const aiMessage = document.createElement('div');
        aiMessage.className = 'message character-message';
        aiMessage.innerHTML = `
            <div class="message-bubble">
                <p>흥미로운 질문이오. 이에 대해서는...</p>
                <button class="tts-btn" onclick="speakMessage(this)">🔊</button>
            </div>
            <span class="message-time">${getCurrentTime()}</span>
        `;
        messagesContainer.appendChild(aiMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
}

function askQuestion(question) {
    const input = document.getElementById('chat-input');
    if (input) {
        input.value = question;
        sendMessage();
    }
}

function speakMessage(button) {
    const messageText = button.parentElement.querySelector('p').textContent;
    
    // Web Speech API 사용 (지원하는 브라우저에서)
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(messageText);
        utterance.lang = 'ko-KR';
        window.speechSynthesis.speak(utterance);
    } else {
        alert('이 브라우저는 음성 재생을 지원하지 않습니다.');
    }
}

function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? '오후' : '오전';
    const displayHours = hours > 12 ? hours - 12 : hours;
    return `${ampm} ${displayHours}:${minutes}`;
}

// ===================================
// E. 토론: 찬반 선택 화면 기능
// ===================================
function selectDebateSide(side) {
    // 토론 채팅 화면으로 이동
    showScreen('screen-debate-chat');
    
    // 타이머 시작
    startDebateTimer();
}

function startDebateTimer() {
    if (debateInterval) {
        clearInterval(debateInterval);
    }
    
    debateTimer = 600; // 10분
    
    debateInterval = setInterval(() => {
        debateTimer--;
        
        const minutes = Math.floor(debateTimer / 60);
        const seconds = debateTimer % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // 타이머 표시 업데이트
        const timerDisplays = document.querySelectorAll('.timer-display, .timer-display-small');
        timerDisplays.forEach(display => {
            display.textContent = timeString;
        });
        
        if (debateTimer <= 0) {
            clearInterval(debateInterval);
            alert('토론 시간이 종료되었습니다!');
        }
    }, 1000);
}

// ===================================
// F. 토론: 의견 제출 UI 기능
// ===================================
function sendDebateMessage() {
    const input = document.getElementById('debate-input');
    const agreeMessages = document.getElementById('agree-messages');
    
    if (!input || !agreeMessages || !input.value.trim()) return;
    
    const messageText = input.value.trim();
    
    // 새 메시지 추가
    const newMessage = document.createElement('div');
    newMessage.className = 'debate-message';
    newMessage.innerHTML = `
        <div class="message-header">
            <span class="user-name">나</span>
            <span class="message-time">방금</span>
        </div>
        <div class="message-content">
            ${messageText}
        </div>
        <div class="message-actions">
            <button class="action-icon" onclick="agreeMessage(this)">
                👍 <span class="count">0</span>
            </button>
            <button class="action-icon" onclick="replyMessage(this)">
                💬 <span class="count">0</span>
            </button>
        </div>
    `;
    
    agreeMessages.appendChild(newMessage);
    input.value = '';
    
    // 스크롤 하단으로
    agreeMessages.scrollTop = agreeMessages.scrollHeight;
}

function agreeMessage(button) {
    const countSpan = button.querySelector('.count');
    if (countSpan) {
        const currentCount = parseInt(countSpan.textContent);
        countSpan.textContent = currentCount + 1;
    }
}

function replyMessage(button) {
    alert('답글 기능은 개발 중입니다.');
}

// ===================================
// G. 퀘스트 / 테스트 화면 기능
// ===================================
function selectOption(button, optionNum) {
    // 모든 옵션에서 selected 제거
    const options = button.parentElement.querySelectorAll('.option-btn');
    options.forEach(opt => opt.classList.remove('selected'));
    
    // 선택된 옵션에 selected 추가
    button.classList.add('selected');
}

function submitAnswer(correctAnswer) {
    const selected = document.querySelector('.option-btn.selected');
    
    if (!selected) {
        alert('답을 선택해주세요!');
        return;
    }
    
    // 정답 해설 표시
    const explanation = document.getElementById('answer-explanation');
    if (explanation) {
        explanation.style.display = 'block';
        
        // 스크롤 이동
        explanation.scrollIntoView({ behavior: 'smooth' });
    }
}

function nextQuestion() {
    // 다음 문제로 이동 (실제로는 문제 데이터를 로드)
    alert('다음 문제를 로드합니다.');
    
    // 정답 해설 숨기기
    const explanation = document.getElementById('answer-explanation');
    if (explanation) {
        explanation.style.display = 'none';
    }
    
    // 선택 초기화
    const options = document.querySelectorAll('.option-btn');
    options.forEach(opt => opt.classList.remove('selected'));
}

// ===================================
// H. 시험 대비 화면 기능
// ===================================
function switchTab(tabName) {
    // 탭 버튼 활성화
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // 탭 컨텐츠 표시
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    const targetTab = document.getElementById(`tab-${tabName}`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
}

function loadUnitSummary(unitNum) {
    console.log(`단원 ${unitNum}의 요약을 로드합니다.`);
    // 실제로는 여기서 해당 단원의 요약 데이터를 로드
}

function startPractice(mode) {
    alert(`${mode} 모드로 문제 풀이를 시작합니다.`);
    showScreen('screen-test');
}

// ===================================
// 초기화
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    // 지도 초기화
    initMap();
    
    // 초기 연도 설정
    updateYear(475);
    
    // 메인 화면 표시
    showScreen('screen-main-map');
    
    console.log('역사 지도 학습 서비스가 시작되었습니다.');
});

// ===================================
// 유틸리티 함수
// ===================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
