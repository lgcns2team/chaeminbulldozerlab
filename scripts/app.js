// ===================================
// 전역 변수
// ===================================
let currentYear = -1300;
let currentEra = '고조선';
let currentScreen = 'screen-main-map';
let debateTimer = 600; // 10분 = 600초
let debateInterval = null;
let map = null;
let historicalLayer = null;
let capitalMarkers = [];
let currentLayerType = 'default'; // 현재 활성화된 레이어 타입
let eventMarkers = []; // 이벤트 마커들 (전투, 무역, 인물)
let tradeRoutes = []; // 무역로 라인들
let userAddedEvents = []; // 사용자가 추가한 사건들
let currentCharacter = null; // 현재 대화 중인 인물
let isAutoPlaying = false; // 자동 재생 상태
let autoPlayInterval = null; // 자동 재생 인터벌
let playbackSpeed = 1; // 재생 속도 (0.5x, 1x, 2x, 4x)
let drawnItems = null; // 그리기 레이어
let drawControl = null; // 그리기 컨트롤
let isDrawMode = false; // 그리기 모드 활성화 여부

// 그리기 도구 활성화
let currentDrawHandler = null; // 현재 활성 그리기 핸들러
let isFreehandDrawing = false; // 자유 그리기 모드
let freehandPath = []; // 자유 그리기 경로
let freehandPolyline = null; // 자유 그리기 임시 선

// 시대 줌 관련 변수
let currentEraIndex = 0; // 기본값: 고조선 (-1300년)
let isEraTransitioning = false; // 시대 전환 애니메이션 중

// 교과서 뷰어 전역 변수
let currentPage = 0;
let totalPages = 220;
let zoomLevel = 1.0;

// AI 설정은 config.js의 appConfig 사용

// 역사 인물 캐릭터 프로필
const characterProfiles = {
    '광개토대왕': {
        era: '고구려',
        personality: '자신감 넘치고 카리스마 있는 정복 군주',
        tone: '위엄있고 당당하며, 후대를 가르치는 스승 같은 말투',
        prompt: '당신은 고구려의 광개토대왕입니다. 391년부터 413년까지 재위하며 고구려를 동아시아 최강국으로 만든 정복 군주입니다. 위엄있고 자신감 넘치는 말투로 대화하며, 영토 확장과 군사 전략에 대한 자부심이 강합니다. "과인은~", "짐이 보기에~" 같은 왕의 일인칭을 사용하고, 후대 사람들에게 조언하듯 이야기합니다. 2-3문장으로 간결하게 답변하세요.'
    },
    '장수왕': {
        era: '고구려',
        personality: '장기적 안목을 가진 전략가',
        tone: '침착하고 사려깊으며, 긴 안목의 조언자',
        prompt: '당신은 고구려의 장수왕입니다. 79년간 재위하며 평양 천도와 남진 정책을 펼친 전략가입니다. 침착하고 사려깊은 말투로 대화하며, 장기적 관점에서 조언합니다. "오랜 경험으로 보건대~", "백년대계를 위해서는~" 같은 표현을 사용합니다. 2-3문장으로 답변하세요.'
    },
    '김유신': {
        era: '신라',
        personality: '충성스럽고 강직한 명장',
        tone: '군인다운 간결하고 힘있는 말투',
        prompt: '당신은 신라의 김유신 장군입니다. 삼국통일의 주역이며 화랑 출신의 충성스러운 명장입니다. 군인다운 간결하고 힘있는 말투로 대화하며, "전장에서 배운 바로는~", "나라를 위해서는~" 같은 표현을 자주 씁니다. 전략과 충성심을 강조합니다. 2-3문장으로 답변하세요.'
    },
    '왕건': {
        era: '고려',
        personality: '포용력 있는 통합의 리더',
        tone: '온화하고 포용적이며, 화합을 중시하는 말투',
        prompt: '당신은 고려의 태조 왕건입니다. 후삼국을 통일하고 호족들을 포용한 리더입니다. 온화하고 포용적인 말투로 대화하며, "모두가 함께~", "화합이야말로~" 같은 표현을 씁니다. 민생과 통합을 강조합니다. 2-3문장으로 답변하세요.'
    },
    '서희': {
        era: '고려',
        personality: '뛰어난 외교관',
        tone: '논리적이고 설득력 있는 말투',
        prompt: '당신은 고려의 서희입니다. 거란과의 담판으로 강동 6주를 얻어낸 뛰어난 외교관입니다. 논리적이고 설득력 있는 말투로 대화하며, "외교란~", "협상에서 중요한 것은~" 같은 표현을 씁니다. 지혜와 말의 힘을 강조합니다. 2-3문장으로 답변하세요.'
    },
    '이성계': {
        era: '조선',
        personality: '무장 출신의 개혁가',
        tone: '결단력 있고 개혁적인 말투',
        prompt: '당신은 조선의 태조 이성계입니다. 무장 출신으로 새 왕조를 세운 개혁가입니다. 결단력 있고 개혁적인 말투로 대화하며, "새 시대를 위해서는~", "구습을 타파하고~" 같은 표현을 씁니다. 변화와 개혁을 강조합니다. 2-3문장으로 답변하세요.'
    },
    '세종대왕': {
        era: '조선',
        personality: '학문을 사랑하는 성군',
        tone: '따뜻하고 지혜로우며, 백성을 생각하는 말투',
        prompt: '당신은 조선의 세종대왕입니다. 한글을 창제하고 과학과 문화를 발전시킨 성군입니다. 따뜻하고 지혜로운 말투로 대화하며, "백성을 위하여~", "학문이란~" 같은 표현을 씁니다. 백성 사랑과 지식의 중요성을 강조합니다. 2-3문장으로 답변하세요.'
    },
    '이순신': {
        era: '조선',
        personality: '불굴의 의지를 가진 명장',
        tone: '굳건하고 결연한 군인의 말투',
        prompt: '당신은 조선의 이순신 장군입니다. 임진왜란 때 나라를 구한 불굴의 명장입니다. 굳건하고 결연한 말투로 대화하며, "필사즉생 필생즉사", "신에게는 아직 12척의 배가 있습니다" 같은 불굴의 의지를 보여줍니다. 충성과 책임감을 강조합니다. 2-3문장으로 답변하세요.'
    },
    '정약용': {
        era: '조선',
        personality: '실학자이자 개혁 사상가',
        tone: '논리적이고 실용적인 지식인의 말투',
        prompt: '당신은 조선의 정약용입니다. 실학을 집대성한 개혁 사상가입니다. 논리적이고 실용적인 말투로 대화하며, "실용이 중요하네", "백성의 실생활에~" 같은 표현을 씁니다. 실사구시와 개혁을 강조합니다. 2-3문장으로 답변하세요.'
    },
    '김구': {
        era: '근대',
        personality: '독립운동의 지도자',
        tone: '열정적이고 민족애가 넘치는 말투',
        prompt: '당신은 백범 김구 선생입니다. 평생을 독립운동에 바친 지도자입니다. 열정적이고 민족애가 넘치는 말투로 대화하며, "나의 소원은 독립이오", "민족을 위해~" 같은 표현을 씁니다. 독립과 평화통일을 강조합니다. 2-3문장으로 답변하세요.'
    },
    '안중근': {
        era: '근대',
        personality: '의기있는 독립투사',
        tone: '정의롭고 강직한 애국자의 말투',
        prompt: '당신은 안중근 의사입니다. 이토 히로부미를 처단한 독립투사입니다. 정의롭고 강직한 말투로 대화하며, "동양평화를 위하여", "의로운 일이라면~" 같은 표현을 씁니다. 정의와 평화를 강조합니다. 2-3문장으로 답변하세요.'
    },
    '유관순': {
        era: '근대',
        personality: '용감한 독립운동가',
        tone: '용기있고 당당한 젊은 애국자의 말투',
        prompt: '당신은 유관순 열사입니다. 3.1운동을 이끈 용감한 독립운동가입니다. 용기있고 당당한 말투로 대화하며, "독립만세를 외치며~", "용기를 내세요" 같은 표현을 씁니다. 희생정신과 용기를 강조합니다. 2-3문장으로 답변하세요.'
    }
};

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

// 역사적 전투 데이터
const battleData = {
    '0_300': [
        { name: '적벽대전', year: 208, lat: 30.2, lng: 113.9, participants: ['조조', '손권', '유비'], outcome: '손유연합 승리' }
    ],
    '300_500': [
        { name: '비수대전', year: 383, lat: 33.0, lng: 117.0, participants: ['동진', '전진'], outcome: '동진 승리' },
        { name: '평양성 전투', year: 427, lat: 39.0, lng: 125.7, participants: ['고구려', '북연'], outcome: '고구려 승리' },
        {
            name: '관미성 전투', year: 475, lat: 37.4, lng: 127.1, participants: ['고구려', '백제'], outcome: '고구려 승리',
            troops: { attacker: { name: '고구려군', from: { lat: 39.0, lng: 125.7 }, to: { lat: 37.4, lng: 127.1 } } }
        }
    ],
    '500_700': [
        {
            name: '살수대첩', year: 612, lat: 39.7, lng: 125.4, participants: ['고구려', '수나라'], outcome: '고구려 대승',
            troops: {
                attacker: {
                    name: '수나라군', from: { lat: 40.5, lng: 116.4 }, to: { lat: 39.7, lng: 125.4 }, type: 'land',
                    waypoints: [
                        { lat: 40.6, lng: 117.0 }, { lat: 40.7, lng: 118.0 }, { lat: 40.8, lng: 119.0 }, // 산해관 북쪽
                        { lat: 41.0, lng: 120.0 }, { lat: 41.2, lng: 121.0 }, { lat: 41.5, lng: 122.0 }, // 요동반도 북부
                        { lat: 41.6, lng: 123.0 }, { lat: 41.5, lng: 124.0 }, { lat: 41.3, lng: 124.8 }, // 요양
                        { lat: 40.8, lng: 125.2 }, { lat: 40.3, lng: 125.3 }, { lat: 39.9, lng: 125.4 }  // 압록강→평양
                    ]
                }
            }
        },
        {
            name: '황산벌 전투', year: 660, lat: 36.0, lng: 127.1, participants: ['신라당연합', '백제'], outcome: '신라당 승리',
            troops: {
                attacker: {
                    name: '신라군', from: { lat: 35.8, lng: 129.2 }, to: { lat: 36.0, lng: 127.1 }, type: 'land',
                    waypoints: [{ lat: 35.85, lng: 129.0 }, { lat: 35.9, lng: 128.5 }, { lat: 35.93, lng: 128.0 }, { lat: 35.95, lng: 127.8 }, { lat: 35.97, lng: 127.5 }, { lat: 35.98, lng: 127.3 }]
                }
            }
        },
        {
            name: '안시성 전투', year: 645, lat: 40.5, lng: 124.3, participants: ['고구려', '당나라'], outcome: '고구려 승리',
            troops: {
                attacker: {
                    name: '당나라군', from: { lat: 40.0, lng: 116.4 }, to: { lat: 40.5, lng: 124.3 }, type: 'land',
                    waypoints: [
                        { lat: 40.6, lng: 117.0 }, { lat: 40.7, lng: 118.0 }, { lat: 40.8, lng: 119.0 }, // 산해관 북쪽
                        { lat: 41.0, lng: 120.0 }, { lat: 41.2, lng: 121.0 }, { lat: 41.4, lng: 122.0 }, // 요동반도 북부
                        { lat: 41.3, lng: 123.0 }, { lat: 41.0, lng: 123.8 }, { lat: 40.7, lng: 124.2 }  // 요양→안시성
                    ]
                }
            }
        },
        { name: '백강 전투', year: 663, lat: 37.8, lng: 126.6, participants: ['신라당연합', '백제왜연합'], outcome: '신라당 승리' }
    ],
    '700_900': [
        { name: '매초성 전투', year: 733, lat: 43.8, lng: 127.5, participants: ['발해', '당나라'], outcome: '발해 승리' }
    ],
    '900_1100': [
        {
            name: '귀주대첩', year: 1019, lat: 38.9, lng: 125.2, participants: ['고려', '거란'], outcome: '고려 대승',
            troops: {
                attacker: {
                    name: '거란군', from: { lat: 42.0, lng: 120.0 }, to: { lat: 38.9, lng: 125.2 }, type: 'land',
                    waypoints: [
                        { lat: 42.0, lng: 121.0 }, { lat: 42.0, lng: 122.0 }, { lat: 41.8, lng: 123.0 }, // 요동반도 북부
                        { lat: 41.6, lng: 123.8 }, { lat: 41.4, lng: 124.4 }, { lat: 41.2, lng: 124.8 }, // 요양
                        { lat: 40.8, lng: 125.1 }, { lat: 40.4, lng: 125.2 }, { lat: 40.0, lng: 125.2 }, // 압록강
                        { lat: 39.6, lng: 125.2 }, { lat: 39.3, lng: 125.2 }, { lat: 39.0, lng: 125.2 } // 평안도
                    ]
                }
            }
        }
    ],
    '1100_1300': [
        {
            name: '처인성 전투', year: 1232, lat: 37.2, lng: 127.4, participants: ['고려', '몽골'], outcome: '고려 승리',
            troops: {
                attacker: {
                    name: '몽골군', from: { lat: 40.0, lng: 116.4 }, to: { lat: 37.2, lng: 127.4 }, type: 'land',
                    waypoints: [
                        { lat: 40.5, lng: 117.0 }, { lat: 40.8, lng: 118.0 }, { lat: 41.0, lng: 119.0 }, // 산해관 북쪽
                        { lat: 41.2, lng: 120.0 }, { lat: 41.5, lng: 121.5 }, { lat: 41.6, lng: 123.0 }, // 요동반도 북부
                        { lat: 41.4, lng: 124.0 }, { lat: 41.0, lng: 124.8 }, { lat: 40.5, lng: 125.3 }, // 요양→압록강
                        { lat: 39.8, lng: 125.8 }, { lat: 39.0, lng: 126.3 }, { lat: 38.3, lng: 126.8 }, // 평안도→황해도
                        { lat: 37.8, lng: 127.1 }, { lat: 37.5, lng: 127.3 }  // 경기도
                    ]
                }
            }
        }
    ],
    '1300_1400': [
        { name: '홍건적의 난', year: 1361, lat: 37.9, lng: 127.7, participants: ['고려', '홍건적'], outcome: '고려 승리' }
    ],
    '1400_1600': [
        {
            name: '임진왜란', year: 1592, lat: 35.2, lng: 129.0, participants: ['조선', '일본', '명나라'], outcome: '조선명 승리',
            troops: { attacker: { name: '왜군', from: { lat: 33.5, lng: 130.5 }, to: { lat: 35.2, lng: 129.0 }, type: 'sea', waypoints: [{ lat: 34.0, lng: 129.5 }, { lat: 34.5, lng: 129.3 }] } }
        },
        {
            name: '한산도대첩', year: 1592, lat: 34.8, lng: 128.4, participants: ['조선수군', '일본수군'], outcome: '조선 대승',
            troops: { attacker: { name: '왜수군', from: { lat: 34.5, lng: 128.0 }, to: { lat: 34.8, lng: 128.4 }, type: 'sea' } }
        },
        {
            name: '한산도 대첩', year: 1592, lat: 34.8, lng: 128.4, participants: ['조선수군', '일본수군'], outcome: '조선 대승',
            troops: { attacker: { name: '왜수군', from: { lat: 34.5, lng: 128.0 }, to: { lat: 34.8, lng: 128.4 }, type: 'sea' } }
        },
        {
            name: '명량해전', year: 1597, lat: 34.5, lng: 126.3, participants: ['조선수군', '일본수군'], outcome: '조선 대승',
            troops: { attacker: { name: '왜수군', from: { lat: 34.3, lng: 126.5 }, to: { lat: 34.5, lng: 126.3 }, type: 'sea' } }
        },
        {
            name: '노량해전', year: 1598, lat: 34.6, lng: 128.0, participants: ['조선수군', '일본수군'], outcome: '조선 승리',
            troops: { attacker: { name: '왜수군', from: { lat: 34.4, lng: 128.2 }, to: { lat: 34.6, lng: 128.0 }, type: 'sea' } }
        },
        {
            name: '행주대첩', year: 1593, lat: 37.6, lng: 126.8, participants: ['조선', '일본'], outcome: '조선 승리',
            troops: { attacker: { name: '왜군', from: { lat: 37.5, lng: 127.0 }, to: { lat: 37.6, lng: 126.8 }, type: 'land' } }
        }
    ],
    '1600_1800': [
        {
            name: '병자호란', year: 1636, lat: 37.5, lng: 127.0, participants: ['조선', '청나라'], outcome: '청나라 승리',
            troops: {
                attacker: {
                    name: '청군', from: { lat: 40.0, lng: 116.4 }, to: { lat: 37.5, lng: 127.0 }, type: 'land',
                    waypoints: [
                        { lat: 40.5, lng: 117.5 }, { lat: 40.8, lng: 118.5 }, { lat: 41.0, lng: 119.5 }, // 산해관 북쪽
                        { lat: 41.3, lng: 121.0 }, { lat: 41.5, lng: 122.5 }, { lat: 41.4, lng: 123.8 }, // 요동반도 북부
                        { lat: 41.0, lng: 124.6 }, { lat: 40.5, lng: 125.2 }, { lat: 40.0, lng: 125.5 }, // 요양→압록강
                        { lat: 39.3, lng: 126.0 }, { lat: 38.5, lng: 126.5 }, { lat: 38.0, lng: 126.8 }  // 평안도→한성
                    ]
                }
            }
        },
        {
            name: '의주 전투', year: 1636, lat: 40.2, lng: 124.5, participants: ['조선', '청나라'], outcome: '청나라 승리', war: '병자호란',
            troops: { attacker: { name: '청군', from: { lat: 40.5, lng: 124.0 }, to: { lat: 40.2, lng: 124.5 }, type: 'land' } }
        },
        {
            name: '정주성 전투', year: 1636, lat: 39.7, lng: 125.2, participants: ['조선', '청나라'], outcome: '청나라 승리', war: '병자호란',
            troops: { attacker: { name: '청군', from: { lat: 40.2, lng: 124.5 }, to: { lat: 39.7, lng: 125.2 }, type: 'land' } }
        },
        {
            name: '안주성 전투', year: 1636, lat: 39.6, lng: 125.7, participants: ['조선', '청나라'], outcome: '청나라 승리', war: '병자호란',
            troops: { attacker: { name: '청군', from: { lat: 39.7, lng: 125.2 }, to: { lat: 39.6, lng: 125.7 }, type: 'land' } }
        },
        {
            name: '평양성 전투', year: 1636, lat: 39.0, lng: 125.8, participants: ['조선', '청나라'], outcome: '청나라 승리', war: '병자호란',
            troops: { attacker: { name: '청군', from: { lat: 39.6, lng: 125.7 }, to: { lat: 39.0, lng: 125.8 }, type: 'land' } }
        },
        {
            name: '황주 전투', year: 1637, lat: 38.6, lng: 125.8, participants: ['조선', '청나라'], outcome: '청나라 승리', war: '병자호란',
            troops: { attacker: { name: '청군', from: { lat: 39.0, lng: 125.8 }, to: { lat: 38.6, lng: 125.8 }, type: 'land' } }
        },
        {
            name: '남한산성 포위전', year: 1637, lat: 37.48, lng: 127.18, participants: ['조선', '청나라'], outcome: '청나라 승리', war: '병자호란',
            troops: { attacker: { name: '청군', from: { lat: 37.5, lng: 127.0 }, to: { lat: 37.48, lng: 127.18 }, type: 'land' } }
        },
        {
            name: '쌍령 전투', year: 1637, lat: 37.7, lng: 127.3, participants: ['조선', '청나라'], outcome: '청나라 승리', war: '병자호란',
            troops: { attacker: { name: '청군', from: { lat: 37.5, lng: 127.0 }, to: { lat: 37.7, lng: 127.3 }, type: 'land' } }
        },
        {
            name: '김화 전투', year: 1637, lat: 38.1, lng: 127.5, participants: ['조선', '청나라'], outcome: '청나라 승리', war: '병자호란',
            troops: { attacker: { name: '청군', from: { lat: 37.7, lng: 127.3 }, to: { lat: 38.1, lng: 127.5 }, type: 'land' } }
        }
    ],
    '1800_1900': [
        { name: '청일전쟁', year: 1894, lat: 37.9, lng: 124.7, participants: ['청나라', '일본'], outcome: '일본 승리' }
    ],
    '1900_1945': [
        { name: '러일전쟁', year: 1904, lat: 38.9, lng: 125.7, participants: ['러시아', '일본'], outcome: '일본 승리' }
    ]
};

// 바다 영역 정의 (육지 공격 시 통과 불가능한 영역)
const seaRegions = {
    // 황해 (Yellow Sea)
    yellowSea: {
        minLat: 34.0, maxLat: 40.0,
        minLng: 119.5, maxLng: 126.0
    },
    // 동해 (Sea of Japan)
    seaOfJapan: {
        minLat: 35.0, maxLat: 43.0,
        minLng: 128.5, maxLng: 142.0
    },
    // 남해 (South Sea)
    southSea: {
        minLat: 32.0, maxLat: 35.5,
        minLng: 125.5, maxLng: 130.0
    },
    // 발해만
    bohaiSea: {
        minLat: 37.5, maxLat: 41.0,
        minLng: 117.5, maxLng: 122.0
    }
};

// 주어진 좌표가 바다인지 확인 (육지 공격 시 통과 불가)
function isInSea(lat, lng, routeType = 'land') {
    if (routeType === 'sea') return false; // 해상 공격은 바다 통과 가능

    for (const region of Object.values(seaRegions)) {
        if (lat >= region.minLat && lat <= region.maxLat &&
            lng >= region.minLng && lng <= region.maxLng) {
            return true;
        }
    }
    return false;
}

// 간단한 pathfinding: 출발지→목적지 사이에 육지만 통과하는 경로 찾기
function findLandPath(fromLat, fromLng, toLat, toLng) {
    const path = [{ lat: fromLat, lng: fromLng }];
    const resolution = 1.5; // 더 큰 간격으로 부드러운 경로

    let currentLat = fromLat;
    let currentLng = fromLng;
    const maxSteps = 100; // 무한루프 방지
    let steps = 0;

    while (steps < maxSteps) {
        steps++;

        // 목적지에 가까워지면 종료
        const distToDest = Math.sqrt((toLat - currentLat) ** 2 + (toLng - currentLng) ** 2);
        if (distToDest < resolution) {
            path.push({ lat: toLat, lng: toLng });
            break;
        }

        // 목적지 방향으로 이동할 벡터 계산
        const dirLat = (toLat - currentLat) / distToDest;
        const dirLng = (toLng - currentLng) / distToDest;

        // 다음 위치 후보들 (직진 우선, 필요시에만 우회)
        const candidates = [
            // 직진 (목적지 방향으로)
            { lat: currentLat + dirLat * resolution, lng: currentLng + dirLng * resolution, priority: 1 },
            // 약간 북쪽으로
            { lat: currentLat + dirLat * resolution + 0.5, lng: currentLng + dirLng * resolution, priority: 2 },
            // 약간 동쪽으로
            { lat: currentLat + dirLat * resolution, lng: currentLng + dirLng * resolution + 0.5, priority: 2 },
            // 북쪽 크게 우회
            { lat: currentLat + resolution * 1.5, lng: currentLng + dirLng * resolution * 0.3, priority: 3 }
        ];

        // 육지인 경로 중 가장 우선순위 높은 것 선택
        let nextPoint = null;
        for (const candidate of candidates) {
            if (!isInSea(candidate.lat, candidate.lng, 'land')) {
                nextPoint = candidate;
                break;
            }
        }

        // 모든 후보가 바다면 강제로 북쪽 우회
        if (!nextPoint) {
            nextPoint = { lat: currentLat + resolution, lng: currentLng };
        }

        currentLat = nextPoint.lat;
        currentLng = nextPoint.lng;
        path.push({ lat: currentLat, lng: currentLng });
    }

    return path;
}

// 자동 경로 생성 함수
function generateRoute(from, to, type = 'auto') {
    const fromLat = from.lat;
    const fromLng = from.lng;
    const toLat = to.lat;
    const toLng = to.lng;

    // 자동 판단: 해양 vs 육상
    if (type === 'auto') {
        // 경도 차이가 크지 않고 위도 차이가 큰 경우 (남북 이동) -> 육상 가능성 높음
        // 동해/서해를 넘는 경우 -> 해상
        const latDiff = Math.abs(toLat - fromLat);
        const lngDiff = Math.abs(toLng - fromLng);

        // 일본 <-> 한반도 (해상)
        if ((fromLng > 128 && toLng < 128) || (fromLng < 128 && toLng > 128)) {
            type = 'sea';
        }
        // 위도차가 크고 경도차가 작으면 육로
        else if (latDiff > 2 && lngDiff < 3) {
            type = 'land';
        }
        // 그 외는 거리로 판단
        else {
            const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
            type = distance > 5 ? 'land' : 'sea';
        }
    }

    // 경유지 자동 생성
    const waypoints = [];
    const segments = Math.max(2, Math.floor(Math.sqrt((toLat - fromLat) ** 2 + (toLng - fromLng) ** 2) / 2));

    if (type === 'land') {
        // 육로: 중국 -> 한반도는 요동반도 경유 (황해를 피해감)
        if (fromLng < 120 && toLng > 123) {
            // 베이징/중국 내륙 -> 한반도 (북쪽 육로)
            waypoints.push({ lat: 40.5, lng: 119.5 });  // 산해관
            waypoints.push({ lat: 41.0, lng: 121.5 });  // 요동반도 북부
            waypoints.push({ lat: 41.2, lng: 123.5 });  // 요양
            waypoints.push({ lat: 40.8, lng: 124.5 });  // 압록강 접근
            waypoints.push({ lat: 40.0, lng: 124.8 });  // 압록강
            waypoints.push({ lat: 39.0, lng: 125.5 });  // 한반도 북부
            waypoints.push({ lat: 38.0, lng: 126.0 });  // 평안도
            if (toLat < 38) {
                waypoints.push({ lat: 37.5, lng: 126.5 });  // 황해도
            }
        }
        // 한반도 내 이동 - 해안선 따라가기
        else if (fromLng > 125 && toLng > 125) {
            const latDiff = toLat - fromLat;
            const lngDiff = toLng - fromLng;

            // 바다를 피해 내륙으로 경로 생성
            const steps = Math.ceil(Math.abs(latDiff) + Math.abs(lngDiff)) * 2;
            for (let i = 1; i < steps; i++) {
                const ratio = i / steps;
                let newLat = fromLat + latDiff * ratio;
                let newLng = fromLng + lngDiff * ratio;

                // 바다면 내륙으로 이동 (경도를 약간 조정)
                if (isInSea(newLat, newLng)) {
                    // 동해쪽이면 서쪽으로, 서해쪽이면 동쪽으로
                    if (newLng > 128) {
                        newLng = 127.5;  // 동해 -> 내륙
                    } else if (newLng < 126) {
                        newLng = 126.5;  // 서해 -> 내륙
                    }
                }
                waypoints.push({ lat: newLat, lng: newLng });
            }
        }
        // 기타 육로: 바다 체크하면서 경로 생성
        else {
            const steps = Math.max(10, Math.ceil(Math.sqrt((toLat - fromLat) ** 2 + (toLng - fromLng) ** 2) * 3));
            for (let i = 1; i < steps; i++) {
                const ratio = i / steps;
                let newLat = fromLat + (toLat - fromLat) * ratio;
                let newLng = fromLng + (toLng - fromLng) * ratio;

                // 직선 경로가 바다를 지나면 우회
                if (isInSea(newLat, newLng)) {
                    // 황해를 지나는 경우 -> 북쪽 우회
                    if (newLng > 119.5 && newLng < 126.0 && newLat > 34 && newLat < 40) {
                        newLat = 40.5;  // 북쪽으로 우회 (요동반도 경유)
                        newLng = fromLng + (toLng - fromLng) * ratio;
                    }
                    // 동해를 지나는 경우 -> 서쪽으로
                    else if (newLng > 128.0) {
                        newLng = 127.5;
                    }
                    // 남해를 지나는 경우
                    else if (newLat < 35 && newLng > 126 && newLng < 130) {
                        newLat = 35.5;
                    }
                }
                waypoints.push({ lat: newLat, lng: newLng });
            }
        }
    } else {
        // 해상: 곡선 경로
        for (let i = 1; i < segments; i++) {
            const ratio = i / segments;
            waypoints.push({
                lat: fromLat + (toLat - fromLat) * ratio,
                lng: fromLng + (toLng - fromLng) * ratio
            });
        }
    }

    return { type, waypoints };
}

// 역사적 무역 데이터
const tradeData = {
    '0_300': [
        {
            name: '실크로드', route: '장안-중앙아시아', lat: 34.3, lng: 108.9, goods: ['비단', '도자기', '향료'],
            from: { name: '장안', lat: 34.3, lng: 108.9 }, to: { name: '중앙아시아', lat: 40.0, lng: 65.0 }, bidirectional: true
        }
    ],
    '300_500': [
        {
            name: '낙랑무역', route: '낙랑-한반도', lat: 39.0, lng: 125.7, goods: ['철기', '직물', '칠기'],
            from: { name: '낙랑', lat: 39.0, lng: 125.7 }, to: { name: '한반도남부', lat: 36.0, lng: 127.5 }, bidirectional: true
        }
    ],
    '500_700': [
        {
            name: '신라-당 무역', route: '경주-당나라', lat: 35.8, lng: 129.2, goods: ['금', '은', '직물', '불상'],
            from: { name: '경주', lat: 35.8, lng: 129.2 }, to: { name: '장안', lat: 34.3, lng: 108.9 }, bidirectional: true
        }
    ],
    '700_900': [
        {
            name: '장보고 해상무역', route: '완도-당-일본', lat: 34.3, lng: 126.7, goods: ['도자기', '차', '직물', '노예'],
            from: { name: '완도', lat: 34.3, lng: 126.7 }, to: { name: '당나라', lat: 34.3, lng: 108.9 },
            waypoints: [{ name: '일본', lat: 35.0, lng: 135.7 }], bidirectional: true
        }
    ],
    '900_1100': [
        {
            name: '고려-송 무역', route: '개경-송나라', lat: 37.9, lng: 126.6, goods: ['인삼', '종이', '붓', '먹'],
            from: { name: '개경', lat: 37.9, lng: 126.6 }, to: { name: '송나라', lat: 30.3, lng: 120.2 }, bidirectional: true
        }
    ],
    '1100_1300': [
        {
            name: '고려청자 수출', route: '벽란도-송원', lat: 37.7, lng: 126.7, goods: ['청자', '고려인삼', '나전칠기'],
            from: { name: '벽란도', lat: 37.7, lng: 126.7 }, to: { name: '송원', lat: 31.0, lng: 121.0 }, bidirectional: false
        }
    ],
    '1300_1400': [
        {
            name: '원-고려 무역', route: '개경-대도', lat: 37.9, lng: 126.6, goods: ['면직물', '화약', '금속활자'],
            from: { name: '개경', lat: 37.9, lng: 126.6 }, to: { name: '대도', lat: 39.9, lng: 116.4 }, bidirectional: true
        }
    ],
    '1400_1600': [
        {
            name: '조선-명 조공무역', route: '한성-북경', lat: 37.57, lng: 126.98, goods: ['인삼', '종이', '말', '은'],
            from: { name: '한성', lat: 37.57, lng: 126.98 }, to: { name: '북경', lat: 39.9, lng: 116.4 }, bidirectional: false
        }
    ],
    '1600_1800': [
        {
            name: '조선-청 무역', route: '한양-북경', lat: 37.57, lng: 126.98, goods: ['인삼', '종이', '직물'],
            from: { name: '한양', lat: 37.57, lng: 126.98 }, to: { name: '북경', lat: 39.9, lng: 116.4 }, bidirectional: false
        },
        {
            name: '남만무역', route: '나가사키-동남아', lat: 32.7, lng: 129.9, goods: ['은', '구리', '도자기'],
            from: { name: '나가사키', lat: 32.7, lng: 129.9 }, to: { name: '동남아', lat: 13.7, lng: 100.5 }, bidirectional: true
        }
    ],
    '1800_1900': [
        {
            name: '개항장 무역', route: '부산-일본', lat: 35.1, lng: 129.0, goods: ['쌀', '콩', '직물', '기계'],
            from: { name: '부산', lat: 35.1, lng: 129.0 }, to: { name: '나가사키', lat: 32.7, lng: 129.9 }, bidirectional: true
        }
    ],
    '1900_1945': [
        {
            name: '경부선 물류', route: '부산-서울', lat: 36.0, lng: 128.0, goods: ['쌀', '석탄', '철강'],
            from: { name: '부산', lat: 35.1, lng: 129.0 }, to: { name: '서울', lat: 37.57, lng: 126.98 }, bidirectional: true
        }
    ]
};

// 역사적 인물 데이터
const peopleData = {
    '0_300': [
        { name: '동명성왕', title: '고구려 시조', lat: 41.1, lng: 126.2, years: 'BC 37', achievements: '고구려 건국' },
        { name: '온조왕', title: '백제 시조', lat: 37.5, lng: 127.0, years: 'BC 18', achievements: '백제 건국' }
    ],
    '300_500': [
        { name: '근초고왕', title: '백제 제13대 왕', lat: 37.5, lng: 127.0, years: '346-375', achievements: '백제 전성기' },
        { name: '광개토대왕', title: '고구려 제19대 왕', lat: 41.1, lng: 126.2, years: '391-413', achievements: '영토 확장' },
        { name: '장수왕', title: '고구려 제20대 왕', lat: 39.0, lng: 125.7, years: '413-491', achievements: '평양 천도, 백제 압박' }
    ],
    '500_700': [
        { name: '을지문덕', title: '고구려 장군', lat: 39.7, lng: 125.4, years: '?-?', achievements: '살수대첩 승리' },
        { name: '김유신', title: '신라 장군', lat: 35.8, lng: 129.2, years: '595-673', achievements: '삼국통일 공신' },
        { name: '계백', title: '백제 장군', lat: 36.0, lng: 127.1, years: '?-660', achievements: '황산벌 항전' }
    ],
    '700_900': [
        { name: '대조영', title: '발해 건국자', lat: 44.0, lng: 129.5, years: '?-719', achievements: '발해 건국' },
        { name: '장보고', title: '청해진 대사', lat: 34.3, lng: 126.7, years: '?-846', achievements: '해상무역 장악' }
    ],
    '900_1100': [
        { name: '왕건', title: '고려 태조', lat: 37.9, lng: 126.6, years: '877-943', achievements: '고려 건국, 후삼국 통일' },
        { name: '서희', title: '고려 문신', lat: 38.9, lng: 125.2, years: '942-998', achievements: '강동6주 획득' },
        { name: '강감찬', title: '고려 장군', lat: 38.9, lng: 125.2, years: '948-1031', achievements: '귀주대첩 승리' }
    ],
    '1100_1300': [
        { name: '김부식', title: '고려 문신', lat: 37.9, lng: 126.6, years: '1075-1151', achievements: '삼국사기 편찬' },
        { name: '김윤후', title: '고려 승려', lat: 37.2, lng: 127.4, years: '?-?', achievements: '처인성에서 몽골 살리타 사살' }
    ],
    '1300_1400': [
        { name: '이성계', title: '조선 태조', lat: 37.57, lng: 126.98, years: '1335-1408', achievements: '조선 건국' },
        { name: '정몽주', title: '고려 충신', lat: 37.9, lng: 126.6, years: '1337-1392', achievements: '고려 충절' }
    ],
    '1400_1600': [
        { name: '세종대왕', title: '조선 제4대 왕', lat: 37.57, lng: 126.98, years: '1397-1450', achievements: '한글 창제, 과학 발전' },
        { name: '이순신', title: '조선 장군', lat: 34.8, lng: 128.4, years: '1545-1598', achievements: '임진왜란 수군 승리' }
    ],
    '1600_1800': [
        { name: '정약용', title: '조선 실학자', lat: 37.57, lng: 126.98, years: '1762-1836', achievements: '실학 집대성' }
    ],
    '1800_1900': [
        { name: '김구', title: '독립운동가', lat: 37.57, lng: 126.98, years: '1876-1949', achievements: '대한민국 임시정부 주석' }
    ],
    '1900_1945': [
        { name: '안중근', title: '독립운동가', lat: 43.8, lng: 125.3, years: '1879-1910', achievements: '이토 히로부미 처단' }
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

        // 그리기 전용 pane 생성 (z-index 높게 설정)
        map.createPane('drawPane');
        map.getPane('drawPane').style.zIndex = 650; // 기본 overlay pane(400)보다 높게

        // 그리기 레이어 초기화
        drawnItems = new L.FeatureGroup({
            pane: 'drawPane'
        });
        map.addLayer(drawnItems);

        // 그리기 이벤트 리스너
        map.on(L.Draw.Event.CREATED, function (e) {
            const layer = e.layer;
            drawnItems.addLayer(layer);
            saveDrawings();

            // 그리기 완료 후 현재 핸들러 비활성화
            if (currentDrawHandler) {
                currentDrawHandler.disable();
                currentDrawHandler = null;
            }

            // 활성 버튼 표시 제거
            document.querySelectorAll('.draw-tool-btn').forEach(btn => btn.classList.remove('active'));
        });

        map.on(L.Draw.Event.EDITED, function (e) {
            saveDrawings();
        });

        map.on(L.Draw.Event.DELETED, function (e) {
            saveDrawings();
        });

        // 저장된 그리기 불러오기
        loadDrawings();

        console.log('지도 초기화 완료');

        // 역사 지도 데이터 로드
        loadHistoricalMap(currentYear);

        // 수도 마커 표시
        updateCapitalMarkers(currentYear);

        // 타임라인 초기화
        initTimeline();
    } catch (error) {
        console.error('지도 초기화 오류:', error);
        // 지도 초기화 실패 시 기본 마커 표시
        addDefaultMarkers();
    }
}

// 역사 지도 데이터 로드
function loadHistoricalMap(year) {
    // BC 1300년(고조선)일 경우 지도 데이터 표시 안 함 (그리기 모드)
    if (year === -1300) {
        if (historicalLayer) {
            map.removeLayer(historicalLayer);
            historicalLayer = null;
        }
        return;
    }

    // 연도에 맞는 GeoJSON 파일 선택
    let geojsonFile = getGeojsonFileForYear(year);

    // D3를 사용하여 GeoJSON 로드
    if (typeof d3 !== 'undefined') {
        d3.json(geojsonFile)
            .then(function (data) {
                if (data) {
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

                    // 새 레이어 생성 (아직 지도에 추가 안함)
                    const newLayer = L.geoJSON(filteredData, {
                        style: function (feature) {
                            return {
                                fillColor: getColorByCountry(feature.properties.NAME),
                                weight: 1,
                                opacity: 1,
                                color: '#ffffff',
                                fillOpacity: 0.5,
                                smoothFactor: 1,
                                dashArray: null,
                                interactive: true  // 클릭 가능하게
                            };
                        },
                        onEachFeature: function (feature, layer) {
                            if (feature.properties && (feature.properties.NAME || feature.properties.name)) {
                                const countryName = feature.properties.NAME || feature.properties.name;
                                const displayName = countryName === 'gojoseon' ? '고조선' : countryName;

                                // 클릭 이벤트 - 맨 앞으로 가져오고 팝업 열기
                                layer.on('click', function (e) {
                                    e.target.bringToFront();
                                    layer.openPopup();
                                });

                                layer.bindPopup(
                                    `<div style="font-family: sans-serif; padding: 8px;">
                                        <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937;">${displayName}</h3>
                                        <p style="margin: 0; font-size: 13px; color: #6b7280;">${year > 0 ? year + '년' : 'BC ' + Math.abs(year) + '년'}</p>
                                    </div>`,
                                    {
                                        className: 'custom-popup'
                                    }
                                );

                                // 호버 효과
                                layer.on('mouseover', function (e) {
                                    e.target.setStyle({
                                        weight: 3,
                                        color: '#3b82f6',
                                        fillOpacity: 0.75
                                    });
                                    e.target.bringToFront();  // 마우스 오버시 맨 앞으로
                                });

                                layer.on('mouseout', function (e) {
                                    if (newLayer) {
                                        newLayer.resetStyle(e.target);
                                    }
                                });
                            }
                        }
                    });

                    // 페이드 효과를 위해 새 레이어 먼저 추가
                    newLayer.addTo(map);

                    // 기존 레이어가 있으면 즉시 제거 (깜빡임 최소화)
                    if (historicalLayer) {
                        try {
                            map.removeLayer(historicalLayer);
                        } catch (e) {
                            console.log('레이어 제거 중 오류:', e);
                        }
                    }

                    // 새 레이어를 현재 레이어로 설정
                    historicalLayer = newLayer;
                }
            })
            .catch(function (error) {
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
    // 고조선 시대 (-2333 ~ -108년)
    if (year >= -2333 && year <= -108) {
        return 'geojson/gojoseon.geojson';
    } else if (year <= -2000) {
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
        '고조선': '#7c3aed',
        'gojoseon': '#7c3aed',
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
    // BC 1300년(고조선)일 경우 마커 표시 안 함
    if (year === -1300) {
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
        return;
    }

    // 해당 시대 찾기
    let periodKey = getCapitalPeriod(year);
    let capitals = capitalData[periodKey];

    if (!capitals) {
        // 데이터가 없으면 기존 마커만 제거
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
        return;
    }

    // 새 마커 생성 (아직 지도에 추가 안함)
    const newMarkers = [];
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

        newMarkers.push(marker);
    });

    // 기존 마커 제거
    if (capitalMarkers && capitalMarkers.length > 0) {
        capitalMarkers.forEach(marker => {
            try {
                map.removeLayer(marker);
            } catch (e) {
                console.log('마커 제거 중 오류:', e);
            }
        });
    }

    // 새 마커 먼저 추가
    newMarkers.forEach(marker => marker.addTo(map));

    // 새 마커를 현재 마커로 설정
    capitalMarkers = newMarkers;
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
// 지도 레이어 토글 함수
// ===================================
function toggleLayer(layerType) {
    // 버튼 활성화 상태 업데이트
    const buttons = document.querySelectorAll('.layer-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // 현재 레이어 타입 업데이트
    currentLayerType = layerType;

    // 기존 이벤트 마커 제거
    clearEventMarkers();

    // 레이어 타입에 따라 마커 추가
    switch (layerType) {
        case 'default':
            // 기본 지도만 표시 (아무것도 추가 안 함)
            break;
        case 'battles':
            showBattleMarkers(currentYear);
            break;
        case 'trade':
            showTradeMarkers(currentYear);
            break;
        case 'people':
            showPeopleMarkers(currentYear);
            break;
    }
}

// 이벤트 마커 제거
function clearEventMarkers() {
    if (eventMarkers && eventMarkers.length > 0) {
        eventMarkers.forEach(marker => {
            try {
                map.removeLayer(marker);
            } catch (e) {
                console.log('이벤트 마커 제거 중 오류:', e);
            }
        });
        eventMarkers = [];
    }

    // 무역로 라인 제거
    if (tradeRoutes && tradeRoutes.length > 0) {
        tradeRoutes.forEach(route => {
            try {
                map.removeLayer(route);
            } catch (e) {
                console.log('무역로 제거 중 오류:', e);
            }
        });
        tradeRoutes = [];
    }
}

// 전투 마커 표시
function showBattleMarkers(year) {
    const periodKey = getCapitalPeriod(year);
    const battles = battleData[periodKey];

    if (!battles) return;

    battles.forEach(battle => {
        // 전투 마커
        const icon = L.divIcon({
            className: 'battle-marker',
            html: `
                <div class="event-marker-content" style="background: #ef4444;">
                    <div class="event-icon">⚔️</div>
                    <div class="event-label">${battle.name}</div>
                </div>
            `,
            iconSize: [100, 40],
            iconAnchor: [50, 20]
        });

        const marker = L.marker([battle.lat, battle.lng], { icon: icon })
            .addTo(map)
            .bindPopup(
                `<div style="font-family: sans-serif; padding: 12px; min-width: 250px;">
                    <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #1f2937; font-weight: 700;">⚔️ ${battle.name}</h3>
                    <p style="margin: 0 0 6px 0; font-size: 14px; color: #ef4444;">📅 ${battle.year > 0 ? battle.year + '년' : 'BC ' + Math.abs(battle.year) + '년'}</p>
                    <p style="margin: 0 0 6px 0; font-size: 13px; color: #374151;"><strong>참전:</strong> ${battle.participants.join(', ')}</p>
                    <p style="margin: 0; font-size: 13px; color: #6b7280;"><strong>결과:</strong> ${battle.outcome}</p>
                </div>`,
                {
                    className: 'custom-popup',
                    offset: [0, -15]
                }
            );

        eventMarkers.push(marker);

        // 병사 진군 애니메이션 (troops 데이터가 있는 경우)
        if (battle.troops && battle.troops.attacker) {
            const troop = battle.troops.attacker;

            // 경로 타입 확인
            const isLand = !troop.type || troop.type === 'land';

            // 경로 구성
            let routePoints = [];

            // waypoints가 있으면 기존 방식 사용 (더 자연스러움)
            if (troop.waypoints && troop.waypoints.length > 0) {
                routePoints = [[troop.from.lat, troop.from.lng]];

                troop.waypoints.forEach(wp => {
                    routePoints.push([wp.lat, wp.lng]);
                });

                routePoints.push([battle.lat, battle.lng]);
            } else if (isLand) {
                // waypoints가 없는 육지 공격만 pathfinding 사용
                const path = findLandPath(troop.from.lat, troop.from.lng, battle.lat, battle.lng);
                routePoints = path.map(p => [p.lat, p.lng]);
            } else {
                // 해상 공격: 직선
                routePoints = [
                    [troop.from.lat, troop.from.lng],
                    [battle.lat, battle.lng]
                ];
            }

            // 경로 타입에 따른 색상 (육로: 빨강, 해상: 파랑)
            const routeColor = isLand ? '#ff0000' : '#0066ff';

            // HoI4 스타일 굵은 공격 화살표
            // 외곽선 (검은색)
            const outlineColor = routeColor === '#ff0000' ? '#8b0000' : '#003366';
            const outlineLine = L.polyline(routePoints, {
                color: '#000000',
                weight: 18,
                opacity: 0.4,
                className: 'hoi4-attack-outline'
            }).addTo(map);
            eventMarkers.push(outlineLine);

            // 메인 라인
            const marchLine = L.polyline(routePoints, {
                color: routeColor,
                weight: 15,
                opacity: 0.85,
                className: 'hoi4-attack-arrow'
            }).addTo(map);
            eventMarkers.push(marchLine);

            // 큰 화살표 데코레이터 (HoI4 스타일)
            if (typeof L.polylineDecorator !== 'undefined') {
                // 외곽선 화살표 (검은색)
                const outlineDecorator = L.polylineDecorator(outlineLine, {
                    patterns: [
                        {
                            offset: '20%',
                            repeat: '40%',  // 40% 간격으로 반복
                            symbol: L.Symbol.arrowHead({
                                pixelSize: 70,
                                polygon: true,
                                pathOptions: {
                                    stroke: true,
                                    color: '#000000',
                                    fillColor: '#000000',
                                    fillOpacity: 0.4,
                                    weight: 6
                                }
                            })
                        }
                    ]
                }).addTo(map);
                eventMarkers.push(outlineDecorator);

                // 메인 화살표
                const decorator = L.polylineDecorator(marchLine, {
                    patterns: [
                        {
                            offset: '20%',
                            repeat: '40%',  // 40% 간격으로 반복
                            symbol: L.Symbol.arrowHead({
                                pixelSize: 65,
                                polygon: true,
                                pathOptions: {
                                    stroke: true,
                                    color: outlineColor,
                                    fillColor: routeColor,
                                    fillOpacity: 0.95,
                                    weight: 6
                                }
                            })
                        }
                    ]
                }).addTo(map);
                eventMarkers.push(decorator);
            }

            // 병사 아이콘 (육로: 검, 해상: 배)
            const troopIcon = isLand ? '⚔️' : '⛵';
            const soldierIcon = L.divIcon({
                className: 'animated-soldier',
                html: `<div class="soldier-icon" style="font-size: 24px;">${troopIcon}</div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });

            const soldierMarker = L.marker([troop.from.lat, troop.from.lng], { icon: soldierIcon })
                .addTo(map);
            eventMarkers.push(soldierMarker);

            // 병사 진군 애니메이션
            let currentSegment = 0;
            let progress = 0;
            const animationSpeed = 0.004;

            function animateSoldier() {
                progress += animationSpeed;

                if (progress >= 1) {
                    currentSegment++;
                    if (currentSegment >= routePoints.length - 1) {
                        // 전투 지점 도달 후 다시 시작
                        setTimeout(() => {
                            currentSegment = 0;
                            progress = 0;
                            animateSoldier();
                        }, 3000);
                        return;
                    }
                    progress = 0;
                }

                const startPoint = routePoints[currentSegment];
                const endPoint = routePoints[currentSegment + 1];
                const lat = startPoint[0] + (endPoint[0] - startPoint[0]) * progress;
                const lng = startPoint[1] + (endPoint[1] - startPoint[1]) * progress;

                soldierMarker.setLatLng([lat, lng]);

                requestAnimationFrame(animateSoldier);
            }

            animateSoldier();

            // 출발지 마커
            const fromIcon = L.divIcon({
                className: 'battle-point-marker',
                html: `<div class="battle-point from" style="font-size: 24px;">🏰</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            const fromMarker = L.marker([troop.from.lat, troop.from.lng], { icon: fromIcon })
                .addTo(map)
                .bindPopup(`<div style="font-family: sans-serif; padding: 8px;">
                    <strong>${troop.name}</strong><br>
                    <span style="color: ${isLand ? '#dc2626' : '#0066ff'};">${isLand ? '육로' : '해상'} 진군 시작</span>
                </div>`);

            eventMarkers.push(fromMarker);
        }
    });
}

// 무역 마커 표시
function showTradeMarkers(year) {
    const periodKey = getCapitalPeriod(year);
    const trades = tradeData[periodKey];

    if (!trades) return;

    trades.forEach(trade => {
        // 무역로 라인 그리기
        if (trade.from && trade.to) {
            let routePoints = [
                [trade.from.lat, trade.from.lng]
            ];

            // 경유지가 있으면 추가
            if (trade.waypoints && trade.waypoints.length > 0) {
                trade.waypoints.forEach(wp => {
                    routePoints.push([wp.lat, wp.lng]);
                });
            }

            routePoints.push([trade.to.lat, trade.to.lng]);

            // 곡선 경로 생성 (베지어 곡선 효과)
            const polyline = L.polyline(routePoints, {
                color: '#3b82f6',
                weight: 3,
                opacity: 0.7,
                dashArray: '10, 10',
                className: 'trade-route-line'
            }).addTo(map);

            // 화살표 데코레이터 추가 (라이브러리가 로드된 경우)
            if (typeof L.polylineDecorator !== 'undefined') {
                const decorator = L.polylineDecorator(polyline, {
                    patterns: [
                        {
                            offset: '50%',
                            repeat: 0,
                            symbol: L.Symbol.arrowHead({
                                pixelSize: 15,
                                polygon: false,
                                pathOptions: {
                                    stroke: true,
                                    weight: 3,
                                    color: '#3b82f6',
                                    opacity: 0.8
                                }
                            })
                        }
                    ]
                }).addTo(map);

                tradeRoutes.push(decorator);
            }

            tradeRoutes.push(polyline);

            // 배 애니메이션 마커 추가
            const shipIcon = L.divIcon({
                className: 'ship-marker',
                html: `<div class="animated-ship" style="font-size: 32px;">🚢</div>`,
                iconSize: [50, 50],
                iconAnchor: [25, 25]
            });

            const shipMarker = L.marker(routePoints[0], { icon: shipIcon }).addTo(map);
            eventMarkers.push(shipMarker);

            // 배 애니메이션 함수
            let currentPointIndex = 0;
            let progress = 0;
            const animationSpeed = 0.005; // 속도 조절
            let direction = 1; // 1: 정방향, -1: 역방향

            function animateShip() {
                const isBidirectional = trade.bidirectional !== false; // 기본값 true

                // 안전 체크
                if (currentPointIndex < 0) currentPointIndex = 0;
                if (currentPointIndex >= routePoints.length - 1) currentPointIndex = routePoints.length - 2;

                const startPoint = routePoints[currentPointIndex];
                const endPoint = routePoints[currentPointIndex + 1];

                // 진행률 업데이트
                progress += animationSpeed * direction;

                // 구간 전환 및 방향 전환
                if (direction === 1 && progress >= 1) {
                    if (currentPointIndex < routePoints.length - 2) {
                        // 다음 구간으로
                        currentPointIndex++;
                        progress = 0;
                    } else if (isBidirectional) {
                        // 양방향: 끝에 도달 → 역방향 전환
                        direction = -1;
                        progress = 1;
                    } else {
                        // 단방향: 처음으로 리셋
                        currentPointIndex = 0;
                        progress = 0;
                        shipMarker.setLatLng(routePoints[0]);
                        setTimeout(() => requestAnimationFrame(animateShip), 2000);
                        return;
                    }
                } else if (direction === -1 && progress <= 0) {
                    if (currentPointIndex > 0) {
                        // 이전 구간으로
                        currentPointIndex--;
                        progress = 1;
                    } else {
                        // 시작점 도달 → 정방향 전환
                        direction = 1;
                        progress = 0;
                    }
                }

                // 현재 위치 계산 (선형 보간)
                const lat = startPoint[0] + (endPoint[0] - startPoint[0]) * progress;
                const lng = startPoint[1] + (endPoint[1] - startPoint[1]) * progress;

                shipMarker.setLatLng([lat, lng]);

                requestAnimationFrame(animateShip);
            }

            // 애니메이션 시작
            animateShip();

            // 출발지 마커
            const fromIcon = L.divIcon({
                className: 'trade-point-marker',
                html: `<div class="trade-point from">📦</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            const fromMarker = L.marker([trade.from.lat, trade.from.lng], { icon: fromIcon })
                .addTo(map)
                .bindPopup(`<div style="font-family: sans-serif; padding: 8px;">
                    <strong>${trade.from.name}</strong><br>
                    <span style="color: #3b82f6;">출발지</span>
                </div>`);

            eventMarkers.push(fromMarker);

            // 도착지 마커
            const toIcon = L.divIcon({
                className: 'trade-point-marker',
                html: `<div class="trade-point to">🏪</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            const toMarker = L.marker([trade.to.lat, trade.to.lng], { icon: toIcon })
                .addTo(map)
                .bindPopup(`<div style="font-family: sans-serif; padding: 8px;">
                    <strong>${trade.to.name}</strong><br>
                    <span style="color: #3b82f6;">도착지</span>
                </div>`);

            eventMarkers.push(toMarker);
        }

        // 중앙 무역 정보 마커
        const icon = L.divIcon({
            className: 'trade-marker',
            html: `
                <div class="event-marker-content" style="background: #3b82f6;">
                    <div class="event-icon">🚢</div>
                    <div class="event-label">${trade.name}</div>
                </div>
            `,
            iconSize: [100, 40],
            iconAnchor: [50, 20]
        });

        const marker = L.marker([trade.lat, trade.lng], { icon: icon })
            .addTo(map)
            .bindPopup(
                `<div style="font-family: sans-serif; padding: 12px; min-width: 250px;">
                    <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #1f2937; font-weight: 700;">🚢 ${trade.name}</h3>
                    <p style="margin: 0 0 6px 0; font-size: 14px; color: #3b82f6;"><strong>교역로:</strong> ${trade.route}</p>
                    ${trade.from ? `<p style="margin: 0 0 4px 0; font-size: 13px; color: #374151;">📦 출발: ${trade.from.name} → 🏪 도착: ${trade.to.name}</p>` : ''}
                    <p style="margin: 0; font-size: 13px; color: #6b7280;"><strong>주요 품목:</strong> ${trade.goods.join(', ')}</p>
                </div>`,
                {
                    className: 'custom-popup',
                    offset: [0, -15]
                }
            );

        eventMarkers.push(marker);
    });
}

// 인물 마커 표시
function showPeopleMarkers(year) {
    const periodKey = getCapitalPeriod(year);
    const people = peopleData[periodKey];

    if (!people) return;

    people.forEach(person => {
        const icon = L.divIcon({
            className: 'people-marker',
            html: `
                <div class="event-marker-content" style="background: #f59e0b;">
                    <div class="event-icon">👑</div>
                    <div class="event-label">${person.name}</div>
                </div>
            `,
            iconSize: [100, 40],
            iconAnchor: [50, 20]
        });

        const marker = L.marker([person.lat, person.lng], { icon: icon })
            .addTo(map)
            .bindPopup(
                `<div style="font-family: sans-serif; padding: 12px; min-width: 250px;">
                    <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #1f2937; font-weight: 700;">👑 ${person.name}</h3>
                    <p style="margin: 0 0 6px 0; font-size: 14px; color: #f59e0b;"><strong>직위:</strong> ${person.title}</p>
                    <p style="margin: 0 0 6px 0; font-size: 13px; color: #374151;"><strong>시기:</strong> ${person.years}</p>
                    <p style="margin: 0; font-size: 13px; color: #6b7280;"><strong>업적:</strong> ${person.achievements}</p>
                </div>`,
                {
                    className: 'custom-popup',
                    offset: [0, -15]
                }
            );

        eventMarkers.push(marker);
    });
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
// 사이드 패널 관리
// ===================================
function openPanel(panelId) {
    // 다른 패널 모두 닫기
    closeAllPanels();

    // 채팅 패널을 직접 열 때는 인물 대화 모드 해제 (일반 AI)
    if (panelId === 'panel-chat') {
        currentCharacter = null;
        // 채팅 기록 초기화
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
            const greetingMessage = document.createElement('div');
            greetingMessage.className = 'message character-message';
            greetingMessage.innerHTML = `
                <div class="message-bubble">
                    <p>안녕하세요! 한국 역사에 대해 무엇이든 물어보세요. 💡</p>
                </div>
                <span class="message-time">${getCurrentTime()}</span>
            `;
            messagesContainer.appendChild(greetingMessage);
        }
    }

    // 선택된 패널 열기
    const panel = document.getElementById(panelId);
    const overlay = document.getElementById('panel-overlay');
    const timeline = document.querySelector('.timeline-control');

    if (panel) {
        panel.classList.add('open');
    }
    if (overlay) {
        overlay.classList.add('active');
    }
    if (timeline) {
        timeline.classList.add('shifted');
    }
}

function closePanel(panelId) {
    const panel = document.getElementById(panelId);
    const overlay = document.getElementById('panel-overlay');
    const timeline = document.querySelector('.timeline-control');

    // 인물 채팅 패널을 닫을 때 인물 대화 모드 해제
    if (panelId === 'panel-character-chat') {
        currentCharacter = null;
    }

    if (panel) {
        panel.classList.remove('open');
    }

    // 모든 패널이 닫혔는지 확인
    const openPanels = document.querySelectorAll('.side-panel.open');
    if (openPanels.length === 0) {
        if (overlay) {
            overlay.classList.remove('active');
        }
        if (timeline) {
            timeline.classList.remove('shifted');
        }
    }
}

function closeAllPanels() {
    const panels = document.querySelectorAll('.side-panel');
    const overlay = document.getElementById('panel-overlay');
    const timeline = document.querySelector('.timeline-control');

    panels.forEach(panel => panel.classList.remove('open'));
    if (overlay) {
        overlay.classList.remove('active');
    }
    if (timeline) {
        timeline.classList.remove('shifted');
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

    // 시대 구분 (정확한 역사 시기)
    if (year < -108) {
        currentEra = '고조선'; // BC 2333 ~ BC 108
    } else if (year < 300) {
        currentEra = '원삼국시대'; // BC 108 ~ 300 (부여, 삼한 등)
    } else if (year < 698) {
        currentEra = '삼국시대'; // 300 ~ 698 (고구려, 백제, 신라)
    } else if (year < 926) {
        currentEra = '남북국시대'; // 698 ~ 926 (통일신라, 발해)
    } else if (year < 1392) {
        currentEra = '고려'; // 918 ~ 1392
    } else if (year < 1897) {
        currentEra = '조선'; // 1392 ~ 1897
    } else if (year < 1910) {
        currentEra = '대한제국'; // 1897 ~ 1910
    } else if (year < 1945) {
        currentEra = '일제강점기'; // 1910 ~ 1945
    } else {
        currentEra = '현대'; // 1945 ~
    }

    if (eraTitle) {
        eraTitle.textContent = currentEra;
    }

    // 시대 경계 체크 (자동 재생 중 시대 전환)
    const era = ERAS[currentEraIndex];
    if (year > era.end && currentEraIndex < ERAS.length - 1) {
        // 현재 시대를 넘어섬 -> 다음 시대로
        switchToEra(currentEraIndex + 1);
        return;
    } else if (year < era.start && currentEraIndex > 0) {
        // 현재 시대 이전 -> 이전 시대로
        switchToEra(currentEraIndex - 1);
        return;
    }

    // 타임라인 핸들 업데이트
    updateTimelineHandle(currentYear);

    // 지도 업데이트
    if (map) {
        loadHistoricalMap(currentYear);
        updateCapitalMarkers(currentYear);

        // 현재 활성화된 레이어 다시 표시
        if (currentLayerType !== 'default') {
            clearEventMarkers();
            switch (currentLayerType) {
                case 'battles':
                    showBattleMarkers(currentYear);
                    break;
                case 'trade':
                    showTradeMarkers(currentYear);
                    break;
                case 'people':
                    showPeopleMarkers(currentYear);
                    break;
            }
        }
    }
}

function previousYear() {
    updateYear(currentYear - 10);
}

function nextYear() {
    updateYear(currentYear + 10);
}

// 자동 재생/정지 토글
function toggleAutoPlay() {
    const btn = document.getElementById('play-pause-btn');

    if (isAutoPlaying) {
        // 정지
        stopAutoPlay();
        btn.textContent = '▶';
        btn.style.color = '';
    } else {
        // 재생
        startAutoPlay();
        btn.textContent = '⏸';
        btn.style.color = '#ef4444';
    }
}

// 자동 재생 시작
function startAutoPlay() {
    isAutoPlaying = true;

    // 속도에 따른 인터벌 계산 (기본 500ms)
    const baseInterval = 500;
    const interval = baseInterval / playbackSpeed;

    autoPlayInterval = setInterval(() => {
        const newYear = currentYear + 1;

        // 최대값에 도달하면 처음으로
        if (newYear > MAX_YEAR) {
            updateYear(MIN_YEAR);
        } else {
            updateYear(newYear);
        }
    }, interval);
}

// 자동 재생 정지
function stopAutoPlay() {
    isAutoPlaying = false;

    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

// 재생 속도 변경
function changePlaybackSpeed() {
    const speeds = [0.5, 1, 2, 4, 8, 16];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    playbackSpeed = speeds[nextIndex];

    const speedBtn = document.getElementById('speed-btn');
    if (speedBtn) {
        speedBtn.textContent = playbackSpeed + 'x';
    }

    // 재생 중이면 재시작
    if (isAutoPlaying) {
        stopAutoPlay();
        startAutoPlay();
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
    if (event && event.target) {
        event.target.classList.add('active');
    }

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
    alert(`${name}과(와)의 대화 기능은 개발 중입니다.`);
}

function openCharacterChat(name) {
    // 현재 선택된 인물 저장
    currentCharacter = name;

    const chatTitle = document.getElementById('character-chat-title');
    if (chatTitle) {
        chatTitle.textContent = `💬 ${name}과(와)의 대화`;
    }

    // 채팅 기록 초기화하고 인사말 추가
    const messagesContainer = document.getElementById('character-chat-messages');
    if (messagesContainer) {
        messagesContainer.innerHTML = '';

        // 인물의 인사말 추가
        const greetingMessage = document.createElement('div');
        greetingMessage.className = 'message character-message';

        let greeting = '';
        switch (name) {
            case '광개토대왕':
                greeting = '과인은 고구려의 광개토대왕이다. 동아시아를 호령한 경험을 후대에 전하고자 하니, 무엇이 궁금한가?';
                break;
            case '장수왕':
                greeting = '나는 장수왕이라 하오. 79년의 긴 재위 경험을 바탕으로 그대의 질문에 답하겠소.';
                break;
            case '김유신':
                greeting = '나는 김유신 장군이다. 전장에서 배운 것들을 나누고자 하니, 무엇이든 물어보게.';
                break;
            case '왕건':
                greeting = '나는 고려 태조 왕건이오. 후삼국 통일의 경험을 함께 나누고 싶소이다.';
                break;
            case '서희':
                greeting = '나는 서희라 하오. 거란과의 담판 경험을 통해 외교의 지혜를 전하고자 하오.';
                break;
            case '이성계':
                greeting = '나는 이성계요. 새 시대를 연 경험을 그대와 나누고자 하오.';
                break;
            case '세종대왕':
                greeting = '나는 세종이라 하오. 백성을 사랑하는 마음으로 그대의 질문에 답하겠소.';
                break;
            case '이순신':
                greeting = '나는 이순신 장군이다. 바다에서 나라를 지킨 경험을 전하고자 하니, 편히 물어보게.';
                break;
            case '정약용':
                greeting = '나는 정약용이라 하오. 실학의 정신으로 그대의 궁금증을 풀어드리겠소.';
                break;
            case '김구':
                greeting = '나는 백범 김구요. 독립을 위해 싸운 이야기를 나누고 싶소이다.';
                break;
            case '안중근':
                greeting = '나는 안중근이오. 동양평화를 위한 뜻을 함께 나누고자 하오.';
                break;
            case '유관순':
                greeting = '저는 유관순입니다. 독립을 위해 외친 만세의 정신을 전하고자 합니다.';
                break;
            default:
                greeting = `${name}과(와)의 대화를 시작합니다.`;
        }

        greetingMessage.innerHTML = `
            <div class="message-bubble">
                <p>${greeting}</p>
                <button class="tts-btn" onclick="speakMessage(this)">🔊</button>
            </div>
            <span class="message-time">${getCurrentTime()}</span>
        `;
        messagesContainer.appendChild(greetingMessage);
    }

    // 인물 패널 닫고 인물 채팅 패널 열기
    closePanel('panel-characters');
    openPanel('panel-character-chat');
}

// 인물 대화 메시지 전송
async function sendCharacterMessage() {
    const input = document.getElementById('character-chat-input');
    const messagesContainer = document.getElementById('character-chat-messages');

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

    // AI 응답 생성 (인물 캐릭터)
    await getCharacterAIResponse(messageText, messagesContainer);
}

// 인물 캐릭터 AI 응답
async function getCharacterAIResponse(query, messagesContainer) {
    // 로딩 메시지 추가
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'message character-message';
    loadingMessage.innerHTML = `
        <div class="message-bubble">
            <p>생각 중입니다...</p>
        </div>
        <span class="message-time">${getCurrentTime()}</span>
    `;
    messagesContainer.appendChild(loadingMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
        let response = '';
        const config = appConfig.getConfig();

        if (config.enabled && config.provider === 'openai' && config.apiKey && currentCharacter && characterProfiles[currentCharacter]) {
            // 인물 캐릭터 프롬프트 사용
            const systemPrompt = characterProfiles[currentCharacter].prompt;

            // OpenAI API 호출
            const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        {
                            role: 'user',
                            content: query
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 300
                })
            });

            if (apiResponse.ok) {
                const data = await apiResponse.json();
                response = data.choices[0].message.content;
            } else {
                throw new Error('API 요청 실패');
            }
        } else {
            // 기본 응답
            response = '죄송합니다. 현재 AI 기능을 사용할 수 없습니다.';
        }

        // 로딩 메시지 제거
        loadingMessage.remove();

        // AI 응답 메시지 추가
        const aiMessage = document.createElement('div');
        aiMessage.className = 'message character-message';
        aiMessage.innerHTML = `
            <div class="message-bubble">
                <p>${response}</p>
                <button class="tts-btn" onclick="speakMessage(this)">🔊</button>
            </div>
            <span class="message-time">${getCurrentTime()}</span>
        `;
        messagesContainer.appendChild(aiMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

    } catch (error) {
        console.error('AI 응답 생성 실패:', error);

        // 로딩 메시지 제거
        loadingMessage.remove();

        // 오류 메시지
        const errorMessage = document.createElement('div');
        errorMessage.className = 'message character-message';
        errorMessage.innerHTML = `
            <div class="message-bubble">
                <p>죄송합니다. 응답 생성 중 오류가 발생했습니다. 다시 시도해주세요.</p>
            </div>
            <span class="message-time">${getCurrentTime()}</span>
        `;
        messagesContainer.appendChild(errorMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// 인물 대화 추천 질문 클릭
function askCharacterQuestion(question) {
    const input = document.getElementById('character-chat-input');
    if (input) {
        input.value = question;
        sendCharacterMessage();
    }
}

function selectDebateSide(side) {
    const message = side === 'agree'
        ? '진정한 통일이라는 의견에 동의하셨습니다.'
        : '불완전한 통일이라는 의견에 동의하셨습니다.';
    alert(message + '\n\n의견 작성 기능은 추후 업데이트 예정입니다.');
}

function selectOption(button, optionNum) {
    // 모든 옵션에서 selected 제거
    const options = document.querySelectorAll('.option-btn');
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
        explanation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function nextQuestion() {
    alert('다음 문제 기능은 개발 중입니다.');

    // 정답 해설 숨기기
    const explanation = document.getElementById('answer-explanation');
    if (explanation) {
        explanation.style.display = 'none';
    }

    // 선택 초기화
    const options = document.querySelectorAll('.option-btn');
    options.forEach(opt => opt.classList.remove('selected'));
}

function startQuiz() {
    // 이미 퀴즈가 표시되어 있으므로 아무것도 안 함
    const quizQuestion = document.getElementById('quiz-question');
    if (quizQuestion) {
        quizQuestion.style.display = 'block';
    }
}

// ===================================
// D. 인물 대화 화면 기능
// ===================================
async function sendMessage() {
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

    // 명령어 파싱
    const lowerMsg = messageText.toLowerCase();

    // 특정 사건 위치 질문 ("612년 살수대첩 어디야?", "임진왜란 어디?")
    if (lowerMsg.includes('어디') || lowerMsg.includes('위치')) {
        await findAndShowEvent(messageText, messagesContainer);
        return;
    }

    // 다중 사건 표시 ("고구려 전투들 다 보여줘", "조선시대 전투 보여줘")
    if (lowerMsg.includes('다 보여') || lowerMsg.includes('전부 보여') || lowerMsg.includes('모두 보여') ||
        (lowerMsg.includes('보여') && (lowerMsg.includes('전투') || lowerMsg.includes('무역') || lowerMsg.includes('인물')))) {
        await showMultipleEvents(messageText, messagesContainer);
        return;
    }

    // 사건 추가 명령어
    if (lowerMsg.includes('추가') || lowerMsg.includes('등록') || lowerMsg.includes('입력')) {
        addEventWithAI(messageText);
        return;
    }

    // 검색 명령어
    if (lowerMsg.includes('검색') || lowerMsg.includes('찾아')) {
        const query = messageText.replace(/검색|찾아|에|서/g, '').trim();
        smartSearchInChat(query);
        return;
    }

    // 특정 역사 사건명 감지 (명확한 사건 키워드만)
    // "지도자", "왕", "정책", "업적" 같은 일반 질문 키워드는 제외
    const isGeneralQuestion = lowerMsg.includes('지도자') || lowerMsg.includes('누구') ||
        lowerMsg.includes('왕') || lowerMsg.includes('정책') ||
        lowerMsg.includes('업적') || lowerMsg.includes('무엇') ||
        lowerMsg.includes('어떻게') || lowerMsg.includes('왜') ||
        lowerMsg.includes('이유') || lowerMsg.includes('배경');

    if (!isGeneralQuestion && (
        lowerMsg.includes('전투') || lowerMsg.includes('전쟁') || lowerMsg.includes('대첩') ||
        lowerMsg.includes('의병') || lowerMsg.includes('봉기') || lowerMsg.includes('혁명'))) {
        // 특정 사건명이 있을 때만 지도 검색
        await findAndShowEvent(messageText, messagesContainer);
        return;
    }

    // AI 응답 생성 (일반 질문)
    await getAIResponse(messageText, messagesContainer);
}

// AI 응답 함수 (일반 채팅용)
async function getAIResponse(query, messagesContainer) {
    // 로딩 메시지 추가
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'message character-message';
    loadingMessage.innerHTML = `
        <div class="message-bubble">
            <p>생각 중입니다...</p>
        </div>
        <span class="message-time">${getCurrentTime()}</span>
    `;
    messagesContainer.appendChild(loadingMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
        let response = '';

        // Config 객체에서 설정 가져오기
        const config = appConfig.getConfig();

        if (config.enabled && config.provider === 'openai' && config.apiKey && config.apiKey !== 'YOUR_OPENAI_API_KEY_HERE') {
            // 일반 역사 전문가 프롬프트 사용
            const systemPrompt = `당신은 한국 역사 전문가입니다. 사용자의 역사 질문에 대해 정확하고 간결하게 답변해주세요. 

중요한 규칙:
1. 답변은 한국어로 하며, 2-4문장으로 핵심만 설명
2. 역사적 사실을 정확하게 전달 (연도, 인물, 장소 확인)
3. 안시성 전투(645년)는 양만춘 장군이 당 태종의 침입을 막은 전투
4. 강감찬 장군은 귀주대첩(1019년)의 영웅
5. 불확실한 정보는 추측하지 말 것`;

            // OpenAI API 호출
            const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        {
                            role: 'user',
                            content: query
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 400
                })
            });

            if (apiResponse.ok) {
                const data = await apiResponse.json();
                response = data.choices[0].message.content;
            } else {
                throw new Error('API 요청 실패');
            }
        } else {
            // 기본 응답 (API 키 없을 때)
            if (query.includes('고구려') || query.includes('광개토대왕')) {
                response = '광개토대왕은 고구려 제19대 왕으로, 391년부터 413년까지 재위하며 고구려를 동아시아 최강국으로 만들었습니다. 그의 업적은 광개토대왕릉비에 상세히 기록되어 있습니다.';
            } else if (query.includes('백제')) {
                response = '백제는 기원전 18년 온조왕에 의해 건국되었으며, 한성, 웅진, 사비를 거쳐 수도를 옮기며 발전했습니다. 660년 나당연합군에 의해 멸망했습니다.';
            } else if (query.includes('신라')) {
                response = '신라는 박혁거세에 의해 건국되어 경주를 수도로 삼았습니다. 김춘추와 김유신의 활약으로 삼국통일을 이루었고, 통일신라 시대를 열었습니다.';
            } else if (query.includes('조선')) {
                response = '조선은 1392년 이성계에 의해 건국되어 1910년까지 518년간 지속된 왕조입니다. 한양을 수도로 정하고 유교를 통치이념으로 삼았습니다.';
            } else if (query.includes('살수대첩') || query.includes('살수')) {
                response = '살수대첩(612년)은 고구려의 을지문덕 장군이 살수(청천강)에서 수나라 113만 대군을 격퇴한 전투입니다. 후퇴하는 수나라군을 추격하여 살수에서 대승을 거두었으며, 이는 고구려 역사상 가장 위대한 승리 중 하나로 평가됩니다.';
            } else {
                response = `흥미로운 질문이네요!<br><br>
                💡 <strong>사용 가능한 기능:</strong><br>
                • "[사건명] 추가" - AI로 역사 사건 추가<br>
                • "[키워드] 검색" - 사건 검색 및 지도 표시<br>
                • "살수대첩 어디?" - 위치 검색<br>
                • "고구려 전투들 다 보여줘" - 다중 표시`;
            }
        }

        // 로딩 메시지 제거
        loadingMessage.remove();

        // AI 응답 메시지 추가
        const aiMessage = document.createElement('div');
        aiMessage.className = 'message character-message';
        aiMessage.innerHTML = `
            <div class="message-bubble">
                <p>${response}</p>
                <button class="tts-btn" onclick="speakMessage(this)">🔊</button>
            </div>
            <span class="message-time">${getCurrentTime()}</span>
        `;
        messagesContainer.appendChild(aiMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

    } catch (error) {
        console.error('AI 응답 생성 실패:', error);

        // 로딩 메시지 제거
        loadingMessage.remove();

        // 오류 메시지
        const errorMessage = document.createElement('div');
        errorMessage.className = 'message character-message';
        errorMessage.innerHTML = `
            <div class="message-bubble">
                <p>죄송합니다. 응답 생성 중 오류가 발생했습니다. 다시 시도해주세요.</p>
            </div>
            <span class="message-time">${getCurrentTime()}</span>
        `;
        messagesContainer.appendChild(errorMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
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
// AI 기능
// ===================================

// AI 설정 로드
function loadAIConfig() {
    // localStorage에서 사용자가 추가한 사건만 로드
    // API 키는 코드에 하드코딩되어 있으므로 로드하지 않음
    const savedEvents = localStorage.getItem('userAddedEvents');
    if (savedEvents) {
        userAddedEvents = JSON.parse(savedEvents);
    }
}

// AI 설정 저장 (사용자는 API 키 변경 불가)
function saveAIConfig() {
    // API 키는 저장하지 않음 (코드에 하드코딩)
    // 사용자 추가 사건만 저장
}

// 사용자 추가 사건 저장
function saveUserEvents() {
    localStorage.setItem('userAddedEvents', JSON.stringify(userAddedEvents));
}

// LLM으로 자연어 파싱
async function parseHistoricalEventWithAI(userInput) {
    const config = appConfig.getConfig();
    if (!config.enabled) {
        return null;
    }

    try {
        let response;

        if (config.provider === 'openai') {
            response = await parseWithOpenAI(userInput);
        } else if (config.provider === 'ollama') {
            response = await parseWithOllama(userInput);
        }

        return response;
    } catch (error) {
        console.error('AI 파싱 오류:', error);
        return null;
    }
}

// OpenAI API로 파싱
async function parseWithOpenAI(userInput) {
    const config = appConfig.getConfig();
    if (!config.apiKey) {
        alert('OpenAI API 키를 설정해주세요.');
        return null;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [{
                role: 'system',
                content: `당신은 동아시아 역사 전문가입니다. 사용자의 입력에서 역사적 사건을 파악하고 다음 JSON 형식으로 응답하세요:
{
  "type": "battle|trade|person",
  "name": "사건명",
  "year": 연도(숫자),
  "location": "지명",
  "lat": 위도(숫자),
  "lng": 경도(숫자),
  "details": {
    "participants": ["참여자1", "참여자2"],
    "outcome": "결과" (전투의 경우),
    "goods": ["품목1", "품목2"] (무역의 경우),
    "title": "직위", (인물의 경우)
    "achievements": "업적" (인물의 경우)
  }
}

위도/경도는 실제 지리 좌표를 사용하세요. 모르는 정보는 합리적으로 추정하세요.`
            }, {
                role: 'user',
                content: userInput
            }],
            temperature: 0.3
        })
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
}

// Ollama로 파싱
async function parseWithOllama(userInput) {
    const config = appConfig.getConfig();
    const response = await fetch(`${config.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama3.2',
            prompt: `당신은 동아시아 역사 전문가입니다. 다음 사용자 입력에서 역사적 사건을 파악하고 JSON 형식으로만 응답하세요:

사용자 입력: ${userInput}

JSON 형식:
{
  "type": "battle|trade|person",
  "name": "사건명",
  "year": 연도,
  "location": "지명",
  "lat": 위도,
  "lng": 경도,
  "details": {...}
}

JSON만 출력:`,
            stream: false,
            format: 'json'
        })
    });

    const data = await response.json();
    return JSON.parse(data.response);
}

// AI로 사건 추가
async function addEventWithAI(userInput, messagesContainer) {
    // 메시지 컨테이너가 없으면 기본값 사용
    if (!messagesContainer) {
        messagesContainer = document.getElementById('chat-messages');
    }

    // 로딩 표시
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'message character-message';
    loadingMsg.innerHTML = `
        <div class="message-bubble">
            <p>🤔 AI가 정보를 분석 중입니다...</p>
        </div>
        <span class="message-time">${getCurrentTime()}</span>
    `;
    messagesContainer.appendChild(loadingMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
        const event = await parseHistoricalEventWithAI(userInput);

        // 로딩 메시지 제거
        loadingMsg.remove();

        if (!event) {
            const config = appConfig.getConfig();
            const errorMsg = document.createElement('div');
            errorMsg.className = 'message character-message';

            let helpText = '';
            if (!config.enabled || !config.apiKey) {
                helpText = '<br><br><span style="color: #ef4444;">💡 AI 기능을 사용하려면 API 키를 설정해주세요.</span><br><small>콘솔: appConfig.setApiKey("your-key")</small>';
            }

            errorMsg.innerHTML = `
                <div class="message-bubble">
                    <p>죄송합니다. 해당 정보를 찾을 수 없습니다.${helpText}</p>
                </div>
                <span class="message-time">${getCurrentTime()}</span>
            `;
            messagesContainer.appendChild(errorMsg);
            return;
        }

        // 사건을 지도에 추가
        addEventToMap(event);

        // 사용자 추가 사건 목록에 저장
        userAddedEvents.push(event);
        saveUserEvents();

        // 성공 메시지
        const successMsg = document.createElement('div');
        successMsg.className = 'message character-message';

        let icon = event.type === 'battle' ? '⚔️' : event.type === 'trade' ? '🚢' : '👑';
        let yearText = event.year > 0 ? event.year + '년' : 'BC ' + Math.abs(event.year) + '년';

        successMsg.innerHTML = `
            <div class="message-bubble">
                <p><strong>${icon} ${event.name}</strong>을(를) 추가했습니다!<br>
                📅 ${yearText}<br>
                📍 ${event.location}<br>
                <span style="color: #10b981;">✓ AI가 자동으로 위치를 찾아 지도에 표시했습니다.</span></p>
            </div>
            <span class="message-time">${getCurrentTime()}</span>
        `;
        messagesContainer.appendChild(successMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // 지도 이동
        updateYear(event.year);
        map.setView([event.lat, event.lng], 7);

    } catch (error) {
        console.error('AI 추가 실패:', error);
        loadingMsg.remove();

        const config = appConfig.getConfig();
        const errorMsg = document.createElement('div');
        errorMsg.className = 'message character-message';

        let errorDetail = '';
        if (!config.enabled || !config.apiKey) {
            errorDetail = '<br><br><span style="color: #ef4444;">💡 AI 기능을 사용하려면 API 키를 설정해주세요.</span>';
        } else {
            errorDetail = `<br><small style="color: #ef4444;">오류: ${error.message}</small>`;
        }

        errorMsg.innerHTML = `
            <div class="message-bubble">
                <p>죄송합니다. 정보 추가 중 오류가 발생했습니다.${errorDetail}</p>
            </div>
            <span class="message-time">${getCurrentTime()}</span>
        `;
        messagesContainer.appendChild(errorMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// 사건을 지도에 추가
function addEventToMap(event) {
    let icon, popupContent;

    switch (event.type) {
        case 'battle':
            icon = L.divIcon({
                className: 'battle-marker',
                html: `
                    <div class="event-marker-content" style="background: #ef4444;">
                        <div class="event-icon">⚔️</div>
                        <div class="event-label">${event.name}</div>
                    </div>
                `,
                iconSize: [100, 40],
                iconAnchor: [50, 20]
            });
            popupContent = `
                <div style="font-family: sans-serif; padding: 12px; min-width: 250px;">
                    <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #1f2937; font-weight: 700;">⚔️ ${event.name}</h3>
                    <p style="margin: 0 0 6px 0; font-size: 14px; color: #ef4444;">📅 ${event.year > 0 ? event.year + '년' : 'BC ' + Math.abs(event.year) + '년'}</p>
                    ${event.details.participants ? `<p style="margin: 0 0 6px 0; font-size: 13px; color: #374151;"><strong>참전:</strong> ${event.details.participants.join(', ')}</p>` : ''}
                    ${event.details.outcome ? `<p style="margin: 0; font-size: 13px; color: #6b7280;"><strong>결과:</strong> ${event.details.outcome}</p>` : ''}
                    <p style="margin: 8px 0 0 0; font-size: 11px; color: #9ca3af;">👤 사용자 추가</p>
                </div>
            `;
            break;

        case 'trade':
            icon = L.divIcon({
                className: 'trade-marker',
                html: `
                    <div class="event-marker-content" style="background: #3b82f6;">
                        <div class="event-icon">🚢</div>
                        <div class="event-label">${event.name}</div>
                    </div>
                `,
                iconSize: [100, 40],
                iconAnchor: [50, 20]
            });
            popupContent = `
                <div style="font-family: sans-serif; padding: 12px; min-width: 250px;">
                    <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #1f2937; font-weight: 700;">🚢 ${event.name}</h3>
                    <p style="margin: 0 0 6px 0; font-size: 14px; color: #3b82f6;">📅 ${event.year > 0 ? event.year + '년' : 'BC ' + Math.abs(event.year) + '년'}</p>
                    ${event.details.goods ? `<p style="margin: 0; font-size: 13px; color: #6b7280;"><strong>품목:</strong> ${event.details.goods.join(', ')}</p>` : ''}
                    <p style="margin: 8px 0 0 0; font-size: 11px; color: #9ca3af;">👤 사용자 추가</p>
                </div>
            `;
            break;

        case 'person':
            icon = L.divIcon({
                className: 'people-marker',
                html: `
                    <div class="event-marker-content" style="background: #f59e0b;">
                        <div class="event-icon">👑</div>
                        <div class="event-label">${event.name}</div>
                    </div>
                `,
                iconSize: [100, 40],
                iconAnchor: [50, 20]
            });
            popupContent = `
                <div style="font-family: sans-serif; padding: 12px; min-width: 250px;">
                    <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #1f2937; font-weight: 700;">👑 ${event.name}</h3>
                    ${event.details.title ? `<p style="margin: 0 0 6px 0; font-size: 14px; color: #f59e0b;"><strong>직위:</strong> ${event.details.title}</p>` : ''}
                    ${event.details.achievements ? `<p style="margin: 0; font-size: 13px; color: #6b7280;"><strong>업적:</strong> ${event.details.achievements}</p>` : ''}
                    <p style="margin: 8px 0 0 0; font-size: 11px; color: #9ca3af;">👤 사용자 추가</p>
                </div>
            `;
            break;
    }

    const marker = L.marker([event.lat, event.lng], { icon: icon })
        .addTo(map)
        .bindPopup(popupContent);

    eventMarkers.push(marker);

    // 지도를 해당 위치로 이동
    map.setView([event.lat, event.lng], 7);
    marker.openPopup();
}

// 특정 위치로 지도 포커스
function focusOnEvent(lat, lng) {
    map.setView([lat, lng], 7);
    // 해당 위치의 마커 찾아서 팝업 열기
    eventMarkers.forEach(marker => {
        const pos = marker.getLatLng();
        if (Math.abs(pos.lat - lat) < 0.1 && Math.abs(pos.lng - lng) < 0.1) {
            marker.openPopup();
        }
    });
}

// 스마트 검색 (자연어로 사건 검색)
async function smartSearch(query) {
    const chatMessages = document.getElementById('chat-messages');

    // 기존 데이터에서 검색
    const allData = {
        ...battleData,
        ...tradeData,
        ...peopleData
    };

    let found = [];
    for (let period in allData) {
        const events = allData[period];
        if (Array.isArray(events)) {
            events.forEach(event => {
                if (event.name.includes(query) ||
                    (event.participants && event.participants.some(p => p.includes(query))) ||
                    (event.title && event.title.includes(query))) {
                    found.push(event);
                }
            });
        }
    }

    // 사용자 추가 사건에서도 검색
    userAddedEvents.forEach(event => {
        if (event.name.includes(query)) {
            found.push(event);
        }
    });

    if (found.length > 0) {
        const resultMsg = document.createElement('div');
        resultMsg.className = 'message-bubble ai';
        let html = `<div><strong>🔍 "${query}" 검색 결과:</strong><br><br>`;
        found.forEach((event, idx) => {
            html += `${idx + 1}. <strong>${event.name}</strong> ${event.year ? `(${event.year > 0 ? event.year + '년' : 'BC ' + Math.abs(event.year) + '년'})` : ''}`;
            if (event.lat && event.lng) {
                html += ` <button onclick="focusOnEvent(${event.lat}, ${event.lng})" style="padding: 4px 8px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">보기</button>`;
            }
            html += '<br>';
        });
        html += '</div>';
        resultMsg.innerHTML = html;
        chatMessages.appendChild(resultMsg);
    } else {
        const notFoundMsg = document.createElement('div');
        notFoundMsg.className = 'message-bubble ai';
        notFoundMsg.innerHTML = `<div>"${query}"에 대한 검색 결과가 없습니다. AI로 검색하시겠습니까?</div>`;
        chatMessages.appendChild(notFoundMsg);

        const config = appConfig.getConfig();
        if (config.enabled) {
            // AI로 검색 시도
            await addEventWithAI(query, chatMessages);
        }
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 특정 사건 찾아서 지도에 표시 ("612년 살수대첩 어디야?")
async function findAndShowEvent(query, messagesContainer) {
    // 키워드 추출
    const keywords = query.replace(/어디|위치|있어|있나|보여|줘|에|서|년|가|는|을|를|때|전투|주라|찾아|전체|목록/g, ' ').trim().split(/\s+/);
    const lowerQuery = query.toLowerCase();

    // 큰 전쟁의 관련 전투들을 찾기 위한 검색
    const isSearchingRelatedBattles = /때.*전투|전투.*목록|전투.*찾|관련.*전투|주요.*전투/.test(lowerQuery);

    // 모든 데이터에서 검색
    let found = null;
    let foundYear = null;
    let maxScore = 0;
    let relatedBattles = []; // 관련 전투 목록

    // 전투 데이터 검색
    for (let period in battleData) {
        const battles = battleData[period];
        for (let battle of battles) {
            let score = 0;

            // 전투 이름이 검색어에 포함되어 있으면 높은 점수
            if (lowerQuery.includes(battle.name.toLowerCase())) {
                score += 100;
            }

            // 참가국이 모두 포함되어 있으면 높은 점수
            if (battle.participants) {
                const matchedParticipants = battle.participants.filter(p =>
                    lowerQuery.includes(p.toLowerCase())
                );
                score += matchedParticipants.length * 50;
            }

            // 키워드 매칭
            const keywordMatches = keywords.filter(k =>
                battle.name.includes(k) ||
                (battle.participants && battle.participants.some(p => p.includes(k)))
            );
            score += keywordMatches.length * 10;

            // 가장 높은 점수의 전투 선택
            if (score > maxScore) {
                maxScore = score;
                found = { ...battle, type: 'battle', period };
                foundYear = battle.year;
            }

            // 관련 전투 수집 (war 속성이 검색어와 일치하거나 이름에 검색 키워드 포함)
            if (isSearchingRelatedBattles) {
                const isRelated = battle.war && keywords.some(k => battle.war.includes(k)) ||
                    keywords.some(k => k.length > 1 && battle.name.includes(k));
                if (isRelated && score > 20) {
                    relatedBattles.push({ ...battle, type: 'battle', period });
                }
            }
        }
    }

    // 무역 데이터 검색
    if (!found || maxScore < 50) {
        for (let period in tradeData) {
            const trades = tradeData[period];
            for (let trade of trades) {
                let score = 0;
                if (lowerQuery.includes(trade.name.toLowerCase())) score += 100;
                if (keywords.some(k => trade.name.includes(k))) score += 10;

                if (score > maxScore) {
                    maxScore = score;
                    found = { ...trade, type: 'trade', period };
                }
            }
        }
    }

    // 인물 데이터 검색
    if (!found || maxScore < 50) {
        for (let period in peopleData) {
            const people = peopleData[period];
            for (let person of people) {
                let score = 0;
                if (lowerQuery.includes(person.name.toLowerCase())) score += 100;
                if (keywords.some(k => person.name.includes(k))) score += 10;

                if (score > maxScore) {
                    maxScore = score;
                    found = { ...person, type: 'person', period };
                }
            }
        }
    }

    if (found) {
        // 관련 전투가 있으면 목록으로 표시
        if (relatedBattles.length > 0) {
            const responseMsg = document.createElement('div');
            responseMsg.className = 'message character-message';

            let battleList = relatedBattles.map((battle, idx) => {
                const safeName = battle.name.replace(/'/g, "\\'");
                const yearText = battle.year > 0 ? battle.year + '년' : 'BC ' + Math.abs(battle.year) + '년';
                return `${idx + 1}. <strong>${battle.name}</strong> (${yearText})<br>
                        📍 ${battle.location || battle.participants?.join(' vs ') || ''}<br>
                        <button onclick="showEventOnMap('battle', '${battle.period}', '${safeName}')" 
                                style="margin: 4px 0; padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                            지도에서 보기
                        </button>`;
            }).join('<br>');

            responseMsg.innerHTML = `
                <div class="message-bubble">
                    <p><strong>⚔️ ${found.name} 관련 전투 ${relatedBattles.length}개</strong>를 찾았습니다!<br><br>
                    ${battleList}</p>
                </div>
                <span class="message-time">${getCurrentTime()}</span>
            `;
            messagesContainer.appendChild(responseMsg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // 전투 레이어 활성화
            toggleLayer('battles');

            // 첫 번째 전투 위치로 지도 이동
            if (relatedBattles[0].year) {
                updateYear(relatedBattles[0].year);
            }
            if (relatedBattles[0].lat && relatedBattles[0].lng) {
                map.setView([relatedBattles[0].lat, relatedBattles[0].lng], 6);
            }

            return;
        }

        // 단일 사건 표시 (기존 로직)
        const responseMsg = document.createElement('div');
        responseMsg.className = 'message character-message';

        let icon = found.type === 'battle' ? '⚔️' : found.type === 'trade' ? '🚢' : '👑';
        let yearText = found.year ? (found.year > 0 ? found.year + '년' : 'BC ' + Math.abs(found.year) + '년') : found.years || '';

        // 이름에서 특수문자 이스케이프 처리
        const safeName = found.name.replace(/'/g, "\\'");

        responseMsg.innerHTML = `
            <div class="message-bubble">
                <p><strong>${icon} ${found.name}</strong>을(를) 찾았습니다!<br>
                📅 ${yearText}<br>
                📍 ${found.location || '정보 제공'}<br>
                <button onclick="showEventOnMap('${found.type}', '${found.period}', '${safeName}')" 
                        style="margin-top: 8px; padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">
                    지도에서 보기
                </button></p>
            </div>
            <span class="message-time">${getCurrentTime()}</span>
        `;
        messagesContainer.appendChild(responseMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // 자동으로 지도 이동 및 마커 표시
        if (foundYear) {
            updateYear(foundYear);
        }

        // 해당 레이어 활성화
        if (found.type === 'battle') {
            toggleLayer('battles');
        } else if (found.type === 'trade') {
            toggleLayer('trade');
        } else if (found.type === 'person') {
            toggleLayer('people');
        }

        // 지도 포커스
        setTimeout(() => {
            if (found.lat && found.lng) {
                map.setView([found.lat, found.lng], 7);
                // 해당 마커의 팝업 열기
                eventMarkers.forEach(marker => {
                    if (marker && typeof marker.getLatLng === 'function') {
                        const pos = marker.getLatLng();
                        if (Math.abs(pos.lat - found.lat) < 0.1 && Math.abs(pos.lng - found.lng) < 0.1) {
                            marker.openPopup();
                        }
                    }
                });
            }
        }, 500);

    } else {
        // 찾지 못한 경우 AI로 자동 추가 시도
        const notFoundMsg = document.createElement('div');
        notFoundMsg.className = 'message character-message';
        notFoundMsg.innerHTML = `
            <div class="message-bubble">
                <p>데이터에서 찾을 수 없어 AI로 정보를 검색하고 있습니다... ⏳</p>
            </div>
            <span class="message-time">${getCurrentTime()}</span>
        `;
        messagesContainer.appendChild(notFoundMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // AI로 사건 정보 추출 및 지도에 추가
        try {
            const event = await parseHistoricalEventWithAI(query);

            if (event && event.lat && event.lng) {
                // 지도에 마커 추가
                addEventToMap(event);

                // 성공 메시지로 교체
                notFoundMsg.remove();

                const successMsg = document.createElement('div');
                successMsg.className = 'message character-message';

                let icon = event.type === 'battle' ? '⚔️' : event.type === 'trade' ? '🚢' : '👑';
                let yearText = event.year > 0 ? event.year + '년' : 'BC ' + Math.abs(event.year) + '년';

                successMsg.innerHTML = `
                    <div class="message-bubble">
                        <p><strong>${icon} ${event.name}</strong>을(를) 추가했습니다!<br>
                        📅 ${yearText}<br>
                        📍 ${event.location}<br>
                        <span style="color: #10b981;">✓ AI가 자동으로 위치를 찾아 지도에 표시했습니다.</span></p>
                    </div>
                    <span class="message-time">${getCurrentTime()}</span>
                `;
                messagesContainer.appendChild(successMsg);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;

                // 지도 이동
                updateYear(event.year);
                map.setView([event.lat, event.lng], 7);

            } else {
                throw new Error('위치 정보를 찾을 수 없습니다');
            }

        } catch (error) {
            console.error('AI 검색 실패:', error);
            notFoundMsg.remove();

            const config = appConfig.getConfig();
            const errorMsg = document.createElement('div');
            errorMsg.className = 'message character-message';

            let errorDetail = '';
            if (!config.enabled || !config.apiKey) {
                errorDetail = '<br><br><span style="color: #ef4444;">💡 AI 기능을 사용하려면 OpenAI API 키를 설정해주세요.</span><br><small>콘솔에서: appConfig.setApiKey("your-api-key")</small>';
            } else {
                errorDetail = `<br><br><small style="color: #ef4444;">오류: ${error.message}</small>`;
            }

            errorMsg.innerHTML = `
                <div class="message-bubble">
                    <p>죄송합니다. "${query}"에 대한 정보를 찾을 수 없습니다.${errorDetail}</p>
                </div>
                <span class="message-time">${getCurrentTime()}</span>
            `;
            messagesContainer.appendChild(errorMsg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
}

// 다중 사건 표시 ("고구려 전투들 다 보여줘")
async function showMultipleEvents(query, messagesContainer) {
    const lowerQuery = query.toLowerCase();
    let foundEvents = [];
    let category = null;
    let keyword = null;

    // 카테고리 파악
    if (lowerQuery.includes('전투')) {
        category = 'battle';
        // 키워드 추출 (고구려, 조선, 백제 등)
        if (lowerQuery.includes('고구려')) keyword = '고구려';
        else if (lowerQuery.includes('신라')) keyword = '신라';
        else if (lowerQuery.includes('백제')) keyword = '백제';
        else if (lowerQuery.includes('조선')) keyword = '조선';
        else if (lowerQuery.includes('고려')) keyword = '고려';

        // 전투 데이터 검색
        for (let period in battleData) {
            battleData[period].forEach(battle => {
                // 전투 이름 또는 참가국에 검색어가 포함되어 있는지 확인
                const battleNameMatch = battle.name.toLowerCase().includes(lowerQuery) ||
                    lowerQuery.includes(battle.name.toLowerCase());
                const participantMatch = battle.participants?.some(p => lowerQuery.includes(p.toLowerCase()));
                const keywordMatch = !keyword || battle.participants?.some(p => p.includes(keyword)) || battle.name.includes(keyword);

                // 더 구체적인 검색어가 있으면 우선 사용
                if (battleNameMatch || (participantMatch && lowerQuery.split(' ').length > 1)) {
                    foundEvents.push({ ...battle, type: 'battle', period });
                } else if (keywordMatch && lowerQuery.split(' ').length === 1) {
                    foundEvents.push({ ...battle, type: 'battle', period });
                }
            });
        }
    } else if (lowerQuery.includes('무역')) {
        category = 'trade';
        for (let period in tradeData) {
            tradeData[period].forEach(trade => {
                foundEvents.push({ ...trade, type: 'trade', period });
            });
        }
    } else if (lowerQuery.includes('인물')) {
        category = 'person';
        if (lowerQuery.includes('고구려')) keyword = '고구려';
        else if (lowerQuery.includes('신라')) keyword = '신라';
        else if (lowerQuery.includes('백제')) keyword = '백제';
        else if (lowerQuery.includes('조선')) keyword = '조선';

        for (let period in peopleData) {
            peopleData[period].forEach(person => {
                if (!keyword || person.title?.includes(keyword) || person.country?.includes(keyword)) {
                    foundEvents.push({ ...person, type: 'person', period });
                }
            });
        }
    }

    if (foundEvents.length > 0) {
        // 응답 메시지
        const responseMsg = document.createElement('div');
        responseMsg.className = 'message character-message';

        let icon = category === 'battle' ? '⚔️' : category === 'trade' ? '🚢' : '👑';
        let categoryName = category === 'battle' ? '전투' : category === 'trade' ? '무역' : '인물';

        let html = `<div><strong>${icon} ${keyword ? keyword + ' ' : ''}${categoryName} ${foundEvents.length}개</strong>를 찾았습니다!<br><br>`;

        foundEvents.slice(0, 10).forEach((event, idx) => {
            let yearText = event.year ? (event.year > 0 ? event.year + '년' : 'BC ' + Math.abs(event.year) + '년') : event.years || '';
            html += `${idx + 1}. <strong>${event.name}</strong> (${yearText})<br>`;
        });

        if (foundEvents.length > 10) {
            html += `<br>... 외 ${foundEvents.length - 10}개`;
        }

        html += `<br><br><button onclick="showAllEventsOnMap('${category}')" 
                style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">
                지도에 모두 표시
            </button></div>`;

        responseMsg.innerHTML = `
            <div class="message-bubble">${html}</div>
            <span class="message-time">${getCurrentTime()}</span>
        `;
        messagesContainer.appendChild(responseMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

    } else {
        const notFoundMsg = document.createElement('div');
        notFoundMsg.className = 'message character-message';
        notFoundMsg.innerHTML = `
            <div class="message-bubble">
                <p>"${query}"에 해당하는 사건을 찾을 수 없습니다.</p>
            </div>
            <span class="message-time">${getCurrentTime()}</span>
        `;
        messagesContainer.appendChild(notFoundMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// 지도에 특정 사건 표시
function showEventOnMap(type, period, name) {
    // 해당 시대로 이동
    let yearMap = {
        '-2000_-1000': -1500,
        '-1000_-500': -750,
        '-500_0': -250,
        '0_300': 150,
        '300_500': 400,
        '500_700': 600,
        '700_900': 800,
        '900_1100': 1000,
        '1100_1300': 1200,
        '1300_1400': 1350,
        '1400_1600': 1500,
        '1600_1800': 1700,
        '1800_1900': 1850,
        '1900_1945': 1920,
        '1945_2024': 2000
    };

    if (yearMap[period]) {
        updateYear(yearMap[period]);
    }

    // 레이어 활성화
    if (type === 'battle') {
        toggleLayer('battles');
    } else if (type === 'trade') {
        toggleLayer('trade');
    } else if (type === 'person') {
        toggleLayer('people');
    }

    // 채팅 패널 닫기
    closePanel('panel-chat');
}

// 지도에 모든 사건 표시
function showAllEventsOnMap(category) {
    if (category === 'battle') {
        toggleLayer('battles');
    } else if (category === 'trade') {
        toggleLayer('trade');
    } else if (category === 'person') {
        toggleLayer('people');
    }

    // 채팅 패널 닫기
    closePanel('panel-chat');
}

// ===================================
// 그리기 패널 및 도구
// ===================================

// 그리기 패널 토글
function toggleDrawPanel() {
    try {
        alert('함수 시작!');
        const panel = document.getElementById('draw-panel');
        alert('panel 찾음: ' + (panel ? 'O' : 'X'));

        if (panel) {
            const isActive = panel.classList.contains('active');
            if (isActive) {
                panel.classList.remove('active');
                alert('패널 닫음');
            } else {
                panel.classList.add('active');
                alert('패널 열림');
            }
        } else {
            alert('패널을 찾을 수 없습니다!');
        }
    } catch (error) {
        alert('에러 발생: ' + error.message);
    }
}

// 지우개 관련 변수
let isEraserActive = false;
let eraserBrush = null;
const ERASER_RADIUS = 20; // 지우개 반경 (픽셀)

// 지우개 활성화
function activateEraser() {
    isEraserActive = true;
    map.dragging.disable(); // 드래그 방지

    // 커서 변경 (없음으로 설정하고 커스텀 브러시 사용)
    map.getContainer().style.cursor = 'none';

    // 지우개 브러시 생성
    if (!eraserBrush) {
        eraserBrush = document.createElement('div');
        eraserBrush.className = 'eraser-brush';
        eraserBrush.style.width = (ERASER_RADIUS * 2) + 'px';
        eraserBrush.style.height = (ERASER_RADIUS * 2) + 'px';
        eraserBrush.style.border = '2px solid #ef4444';
        eraserBrush.style.borderRadius = '50%';
        eraserBrush.style.position = 'fixed';
        eraserBrush.style.pointerEvents = 'none'; // 클릭 통과
        eraserBrush.style.zIndex = '9999';
        eraserBrush.style.transform = 'translate(-50%, -50%)';
        eraserBrush.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
        document.body.appendChild(eraserBrush);
    }
    eraserBrush.style.display = 'block';

    // 이벤트 리스너 등록
    map.on('mousemove', onEraserMove);
    map.on('mousedown', onEraserDown);
    document.addEventListener('mouseup', onEraserUp);
}

// 지우개 비활성화
function deactivateEraser() {
    isEraserActive = false;
    map.dragging.enable();
    map.getContainer().style.cursor = '';

    if (eraserBrush) {
        eraserBrush.style.display = 'none';
    }

    map.off('mousemove', onEraserMove);
    map.off('mousedown', onEraserDown);
    document.removeEventListener('mouseup', onEraserUp);
}

let isErasing = false;

function onEraserDown(e) {
    isErasing = true;
    eraseAtPoint(e.containerPoint);
}

function onEraserUp() {
    isErasing = false;
}

function onEraserMove(e) {
    // 브러시 위치 업데이트
    if (eraserBrush) {
        eraserBrush.style.left = e.containerPoint.x + map.getContainer().getBoundingClientRect().left + 'px';
        eraserBrush.style.top = e.containerPoint.y + map.getContainer().getBoundingClientRect().top + 'px';
    }

    if (isErasing) {
        eraseAtPoint(e.containerPoint);
    }
}

// 지우개 로직 (벡터 자르기)
function eraseAtPoint(point) {
    if (!drawnItems) return;

    const layersToRemove = [];
    const layersToAdd = [];

    drawnItems.eachLayer(function (layer) {
        // 자유 그리기 선(Polyline)만 대상
        if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
            const latlngs = layer.getLatLngs();
            if (!latlngs || latlngs.length < 2) return;

            // 화면 좌표로 변환
            const points = latlngs.map(ll => map.latLngToContainerPoint(ll));

            // 지우개 범위 내에 있는 점 찾기
            let hasIntersection = false;
            const segments = [];
            let currentSegment = [];

            for (let i = 0; i < points.length; i++) {
                const p = points[i];
                const dist = p.distanceTo(point);

                if (dist <= ERASER_RADIUS) {
                    // 지워지는 점
                    hasIntersection = true;
                    if (currentSegment.length > 0) {
                        segments.push(currentSegment);
                        currentSegment = [];
                    }
                } else {
                    // 남는 점
                    currentSegment.push(latlngs[i]);
                }
            }

            // 마지막 세그먼트 추가
            if (currentSegment.length > 0) {
                segments.push(currentSegment);
            }

            // 변경사항이 있으면 적용
            if (hasIntersection) {
                layersToRemove.push(layer);

                segments.forEach(seg => {
                    if (seg.length >= 2) { // 점 2개 이상이어야 선이 됨
                        const newPolyline = L.polyline(seg, {
                            color: layer.options.color,
                            weight: layer.options.weight,
                            opacity: layer.options.opacity,
                            pane: 'drawPane'
                        });
                        newPolyline.layerType = 'freehand'; // 타입 유지
                        layersToAdd.push(newPolyline);
                    }
                });
            }
        }
    });

    // 레이어 업데이트
    if (layersToRemove.length > 0) {
        layersToRemove.forEach(l => drawnItems.removeLayer(l));
        layersToAdd.forEach(l => drawnItems.addLayer(l));
        saveDrawings(); // 저장
    }
}



function activateEditMode() {
    console.log('편집 모드 활성화');
}

function activateDeleteMode() {
    console.log('삭제 모드 활성화');
}

function clearAllDrawings() {
    if (drawnItems && confirm('모든 그림을 지우시겠습니까?')) {
        drawnItems.clearLayers();
        alert('✅ 모든 그림이 삭제되었습니다.');
    }
}

// ===================================
// GeoJSON 생성 및 다운로드
// ===================================

// 그린 도형들을 GeoJSON으로 변환 (자유 그리기 -> Polygon 자동 변환)
function convertDrawnItemsToGeoJSON() {
    const features = [];
    const name = document.getElementById('geojson-name').value || 'Unnamed';
    const color = document.getElementById('geojson-color').value;

    if (!drawnItems) {
        console.error('drawnItems가 초기화되지 않았습니다');
        return null;
    }

    let convertedCount = 0;

    drawnItems.eachLayer(function (layer) {
        try {
            let feature;

            // 1. Polyline(자유 그리기 포함)을 Polygon으로 변환
            if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
                // Polyline의 좌표를 가져옴
                const latlngs = layer.getLatLngs();

                // 좌표가 중첩 배열인 경우 (MultiPolyline 등) 평탄화 필요할 수 있음
                // 여기서는 단순 Polyline 가정

                // GeoJSON Polygon 형식으로 변환 (첫 점과 끝 점이 같아야 함)
                // Leaflet의 toGeoJSON()은 Polyline을 LineString으로 변환하므로,
                // 수동으로 Polygon Feature를 생성합니다.

                const coordinates = latlngs.map(latlng => [latlng.lng, latlng.lat]);

                // 닫힌 루프가 아니면 첫 점을 끝에 추가
                if (coordinates.length > 2) {
                    const first = coordinates[0];
                    const last = coordinates[coordinates.length - 1];
                    if (first[0] !== last[0] || first[1] !== last[1]) {
                        coordinates.push(first);
                    }

                    feature = {
                        type: "Feature",
                        properties: {},
                        geometry: {
                            type: "Polygon",
                            coordinates: [coordinates]
                        }
                    };
                    console.log('Polyline을 Polygon으로 변환했습니다.');
                } else {
                    // 점이 너무 적으면 그냥 LineString으로
                    feature = layer.toGeoJSON();
                }
            } else {
                // 2. 이미 Polygon이거나 다른 도형인 경우
                feature = layer.toGeoJSON();
            }

            if (!feature) return;

            // 프로젝트 형식에 맞게 속성 설정
            feature.properties = {
                NAME: name,
                name: name,
                color: color,
                fill: color,
                'fill-opacity': 0.5,
                stroke: color,
                'stroke-width': 2,
                // 원래 타입 정보 저장 (참고용)
                originalType: layer instanceof L.Polygon ? 'polygon' : 'polyline'
            };

            features.push(feature);
            convertedCount++;

        } catch (e) {
            console.error('레이어 변환 실패:', e);
        }
    });

    if (convertedCount === 0) {
        alert('변환할 도형이 없습니다. 지도에 그림을 그려주세요.');
        return null;
    }

    console.log(`✅ ${convertedCount}개의 도형을 GeoJSON으로 변환했습니다.`);

    return {
        type: 'FeatureCollection',
        features: features
    };
}

// GeoJSON 다운로드
function exportToGeoJSON() {
    const geojson = convertDrawnItemsToGeoJSON();

    if (!geojson || geojson.features.length === 0) {
        alert('먼저 지도에 영역을 그려주세요!');
        return;
    }

    const name = document.getElementById('geojson-name').value || 'map-data';
    const filename = `${name.replace(/\s+/g, '_').toLowerCase()}.geojson`;

    downloadGeoJSON(geojson, filename);
}

// GeoJSON 파일 다운로드 헬퍼
function downloadGeoJSON(geojson, filename) {
    const dataStr = JSON.stringify(geojson, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);

    alert(`✅ ${filename} 파일이 다운로드되었습니다!\n\ngeojson/ 폴더에 저장하여 사용하세요.`);
}

// 클립보드에 복사
function copyGeoJSONToClipboard() {
    const geojson = convertDrawnItemsToGeoJSON();

    if (!geojson || geojson.features.length === 0) {
        alert('먼저 지도에 영역을 그려주세요!');
        return;
    }

    const dataStr = JSON.stringify(geojson, null, 2);

    navigator.clipboard.writeText(dataStr).then(() => {
        alert('✅ GeoJSON이 클립보드에 복사되었습니다!');
    }).catch(err => {
        console.error('복사 실패:', err);
        // 폴백: textarea 사용
        const textarea = document.createElement('textarea');
        textarea.value = dataStr;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            alert('✅ GeoJSON이 클립보드에 복사되었습니다!');
        } catch (e) {
            alert('❌ 복사에 실패했습니다. 미리보기에서 직접 복사해주세요.');
        }
        document.body.removeChild(textarea);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // AI 설정 로드
    loadAIConfig();

    // 지도 초기화
    initMap();

    // 초기 연도 설정
    updateYear(475);

    // 메인 화면 표시
    showScreen('screen-main-map');

    // 그리기 패널 버튼 이벤트 리스너 추가
    const drawPanelBtn = document.getElementById('draw-panel-btn');
    if (drawPanelBtn) {
        drawPanelBtn.addEventListener('click', function () {
            console.log('버튼 클릭 이벤트 발생!');
            toggleDrawPanel();
        });
        console.log('그리기 패널 버튼 이벤트 리스너 등록 완료');
    } else {
        console.error('draw-panel-btn을 찾을 수 없습니다!');
    }

    console.log('역사 지도 학습 서비스가 시작되었습니다.');
});

// 채팅에서 사용하는 스마트 검색
async function smartSearchInChat(query) {
    const messagesContainer = document.getElementById('chat-messages');

    // 기존 데이터에서 검색
    const allData = {
        ...battleData,
        ...tradeData,
        ...peopleData
    };

    let found = [];
    for (let period in allData) {
        const events = allData[period];
        if (Array.isArray(events)) {
            events.forEach(event => {
                if (event.name.includes(query) ||
                    (event.participants && event.participants.some(p => p.includes(query))) ||
                    (event.title && event.title.includes(query))) {
                    found.push(event);
                }
            });
        }
    }

    // 사용자 추가 사건에서도 검색
    userAddedEvents.forEach(event => {
        if (event.name.includes(query)) {
            found.push(event);
        }
    });

    if (found.length > 0) {
        const resultMsg = document.createElement('div');
        resultMsg.className = 'message character-message';
        let html = `<div><strong>🔍 "${query}" 검색 결과:</strong><br><br>`;
        found.forEach((event, idx) => {
            html += `${idx + 1}. <strong>${event.name}</strong> ${event.year ? `(${event.year > 0 ? event.year + '년' : 'BC ' + Math.abs(event.year) + '년'})` : ''}`;
            if (event.lat && event.lng) {
                html += ` <button onclick="focusOnEvent(${event.lat}, ${event.lng})" style="padding: 4px 8px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">보기</button>`;
            }
            html += '<br>';
        });
        html += '</div>';
        resultMsg.innerHTML = `
            <div class="message-bubble">${html}</div>
            <span class="message-time">${getCurrentTime()}</span>
        `;
        messagesContainer.appendChild(resultMsg);
    } else {
        const notFoundMsg = document.createElement('div');
        notFoundMsg.className = 'message character-message';
        const config = appConfig.getConfig();
        notFoundMsg.innerHTML = `
            <div class="message-bubble">
            <p>"${query}"에 대한 검색 결과가 없습니다. ${config.enabled ? 'AI로 검색해보겠습니다...' : ''}</p>
        </div>
        <span class="message-time">${getCurrentTime()}</span>
    `;
        messagesContainer.appendChild(notFoundMsg);

        if (config.enabled) {
            // AI로 검색 시도
            await addEventWithAI(query, messagesContainer);
        }
    }

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ===================================
// 그리기 기능
// ===================================
function toggleDrawPanel() {
    const panel = document.getElementById('draw-panel');
    const btn = document.getElementById('draw-panel-btn');

    if (panel.classList.contains('open')) {
        panel.classList.remove('open');
        btn.classList.remove('active');
        // 활성 도구 비활성화
        if (currentDrawHandler) {
            currentDrawHandler.disable();
            currentDrawHandler = null;
        }
        // 자유 그리기 모드 비활성화
        if (isFreehandDrawing) {
            deactivateFreehand();
        }
        // 지우개 모드 비활성화
        if (isEraserActive) {
            deactivateEraser();
        }
        // 모든 버튼 비활성화
        document.querySelectorAll('.draw-tool-btn').forEach(b => b.classList.remove('active'));
    } else {
        panel.classList.add('open');
        btn.classList.add('active');
    }
}

function activateDrawTool(type) {
    // 기존 핸들러 비활성화
    if (currentDrawHandler) {
        currentDrawHandler.disable();
    }

    // 자유 그리기 모드 비활성화
    if (isFreehandDrawing) {
        deactivateFreehand();
    }

    // 지우개 모드 비활성화
    if (isEraserActive) {
        deactivateEraser();
    }

    // 모든 버튼 비활성화
    document.querySelectorAll('.draw-tool-btn').forEach(btn => btn.classList.remove('active'));

    // 자유 그리기 모드
    if (type === 'freehand') {
        activateFreehand();
        event.target.classList.add('active');
        return;
    }

    // 지우개 모드
    if (type === 'eraser') {
        activateEraser();
        event.target.classList.add('active');
        return;
    }

    // 새 핸들러 생성 및 활성화
    let options = {};

    switch (type) {
        case 'polyline':
            options = { shapeOptions: { color: '#3b82f6', weight: 4 } };
            currentDrawHandler = new L.Draw.Polyline(map, options);
            break;
        case 'polygon':
            options = { shapeOptions: { color: '#ef4444', fillOpacity: 0.3 } };
            currentDrawHandler = new L.Draw.Polygon(map, options);
            break;
        case 'rectangle':
            options = { shapeOptions: { color: '#f59e0b', fillOpacity: 0.3 } };
            currentDrawHandler = new L.Draw.Rectangle(map, options);
            break;
        case 'circle':
            options = { shapeOptions: { color: '#10b981', fillOpacity: 0.3 } };
            currentDrawHandler = new L.Draw.Circle(map, options);
            break;
        case 'marker':
            currentDrawHandler = new L.Draw.Marker(map, {});
            break;
    }

    if (currentDrawHandler) {
        currentDrawHandler.enable();
        // 활성 버튼 표시
        event.target.classList.add('active');
    }
}

// 자유 그리기 활성화
function activateFreehand() {
    isFreehandDrawing = true;
    freehandPath = [];
    map.getContainer().style.cursor = 'crosshair';

    // 지도 드래그 및 줌 비활성화
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();

    // 역사 지도 레이어의 상호작용 비활성화
    if (historicalLayer) {
        historicalLayer.eachLayer(function (layer) {
            layer.off('mouseover');
            layer.off('mouseout');
            layer.off('click');
            layer.closePopup();
        });
    }

    // 마우스 이벤트 리스너
    map.on('mousedown', onFreehandMouseDown);
    map.on('mousemove', onFreehandMouseMove);
    map.on('mouseup', onFreehandMouseUp);
}

// 자유 그리기 비활성화
function deactivateFreehand() {
    isFreehandDrawing = false;
    freehandPath = [];
    map.getContainer().style.cursor = '';

    // 지도 드래그 및 줌 다시 활성화
    map.dragging.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
    map.boxZoom.enable();
    map.keyboard.enable();

    // 역사 지도 레이어의 상호작용 다시 활성화
    if (historicalLayer) {
        historicalLayer.eachLayer(function (layer) {
            // hover 효과 다시 추가
            layer.on('mouseover', function (e) {
                e.target.setStyle({
                    weight: 3,
                    color: '#3b82f6',
                    fillOpacity: 0.75
                });
                e.target.bringToFront();
            });

            layer.on('mouseout', function (e) {
                if (historicalLayer) {
                    historicalLayer.resetStyle(e.target);
                }
            });

            // 클릭 이벤트 다시 추가
            layer.on('click', function (e) {
                e.target.bringToFront();
                layer.openPopup();
            });
        });
    }

    // 임시 선 제거
    if (freehandPolyline) {
        map.removeLayer(freehandPolyline);
        freehandPolyline = null;
    }

    // 이벤트 리스너 제거
    map.off('mousedown', onFreehandMouseDown);
    map.off('mousemove', onFreehandMouseMove);
    map.off('mouseup', onFreehandMouseUp);
}

// 마우스 다운 이벤트
function onFreehandMouseDown(e) {
    if (!isFreehandDrawing) return;

    freehandPath = [e.latlng];

    // 임시 선 생성
    freehandPolyline = L.polyline(freehandPath, {
        color: '#ef4444',
        weight: 3,
        opacity: 0.8
    }).addTo(map);
}

// 마우스 이동 이벤트
function onFreehandMouseMove(e) {
    if (!isFreehandDrawing || freehandPath.length === 0) return;

    // 경로에 점 추가
    freehandPath.push(e.latlng);

    // 임시 선 업데이트
    if (freehandPolyline) {
        freehandPolyline.setLatLngs(freehandPath);
    }
}

// 마우스 업 이벤트
function onFreehandMouseUp(e) {
    if (!isFreehandDrawing || freehandPath.length < 2) return;

    // 최종 경로에 점 추가
    freehandPath.push(e.latlng);

    // 임시 선 제거
    if (freehandPolyline) {
        map.removeLayer(freehandPolyline);
        freehandPolyline = null;
    }

    // 부드럽게 만들기 (점 간격 최적화)
    const smoothPath = smoothFreehandPath(freehandPath);

    // 최종 선 생성
    const finalLine = L.polyline(smoothPath, {
        color: '#ef4444',
        weight: 3,
        opacity: 1,
        pane: 'drawPane'  // 그리기 전용 pane 사용
    });

    // 타입 정보 저장 (삭제 가능하게)
    finalLine.layerType = 'freehand';

    drawnItems.addLayer(finalLine);

    saveDrawings();

    // 경로 초기화
    freehandPath = [];
}

// 자유 그리기 경로 부드럽게 만들기
// 자유 그리기 경로 부드럽게 만들기 (지우개를 위해 포인트 밀도 유지)
function smoothFreehandPath(path) {
    if (path.length < 3) return path;

    const smoothed = [path[0]];
    let lastPoint = path[0];

    // 픽셀 거리 기반으로 포인트 필터링 (너무 촘촘하지 않게, 하지만 지우개가 먹힐 정도로는 유지)
    for (let i = 1; i < path.length; i++) {
        const point = path[i];
        const dist = map.latLngToContainerPoint(lastPoint).distanceTo(map.latLngToContainerPoint(point));

        // 2픽셀 이상 이동했을 때만 포인트 추가 (부드러움과 데이터 양의 균형)
        if (dist > 2) {
            smoothed.push(point);
            lastPoint = point;
        }
    }

    // 마지막 점 추가
    if (smoothed[smoothed.length - 1] !== path[path.length - 1]) {
        smoothed.push(path[path.length - 1]);
    }

    return smoothed;
}

function activateEditMode() {
    // 기존 핸들러 비활성화
    if (currentDrawHandler) {
        currentDrawHandler.disable();
        currentDrawHandler = null;
    }

    // 편집 모드 활성화
    const editHandler = new L.EditToolbar.Edit(map, {
        featureGroup: drawnItems
    });
    editHandler.enable();

    // 활성 버튼 표시
    document.querySelectorAll('.draw-tool-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function activateDeleteMode() {
    // 기존 핸들러 비활성화
    if (currentDrawHandler) {
        currentDrawHandler.disable();
        currentDrawHandler = null;
    }

    // 삭제 모드 활성화
    const deleteHandler = new L.EditToolbar.Delete(map, {
        featureGroup: drawnItems
    });
    deleteHandler.enable();

    // 활성 버튼 표시
    document.querySelectorAll('.draw-tool-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function clearAllDrawings() {
    if (drawnItems.getLayers().length === 0) {
        alert('지울 메모가 없습니다.');
        return;
    }

    if (confirm('모든 메모를 지우시겠습니까?')) {
        drawnItems.clearLayers();
        saveDrawings();
    }
}

function saveDrawings() {
    const data = [];
    drawnItems.eachLayer(function (layer) {
        let geojson;

        // Polyline이나 Polygon 처리
        if (layer instanceof L.Polyline || layer instanceof L.Polygon) {
            geojson = layer.toGeoJSON();
            geojson.properties = geojson.properties || {};
            geojson.properties.style = {
                color: layer.options.color || '#3b82f6',
                weight: layer.options.weight || 3,
                fillOpacity: layer.options.fillOpacity || 0,
                opacity: layer.options.opacity || 1
            };
            // 자유 그리기 타입 저장
            if (layer.layerType === 'freehand') {
                geojson.properties.shapeType = 'freehand';
            }
        }
        // Circle 처리
        else if (layer instanceof L.Circle) {
            const center = layer.getLatLng();
            const radius = layer.getRadius();
            geojson = {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [center.lng, center.lat]
                },
                properties: {
                    radius: radius,
                    style: {
                        color: layer.options.color || '#10b981',
                        fillOpacity: layer.options.fillOpacity || 0.3
                    },
                    shapeType: 'circle'
                }
            };
        }
        // Marker 처리
        else if (layer instanceof L.Marker) {
            geojson = layer.toGeoJSON();
            geojson.properties = geojson.properties || {};
            geojson.properties.shapeType = 'marker';
        }
        // Rectangle 등 기타
        else {
            geojson = layer.toGeoJSON();
            geojson.properties = geojson.properties || {};
            geojson.properties.style = {
                color: layer.options.color || '#f59e0b',
                weight: layer.options.weight || 2,
                fillOpacity: layer.options.fillOpacity || 0.3
            };
        }

        data.push(geojson);
    });
    localStorage.setItem('mapDrawings', JSON.stringify(data));
}

function loadDrawings() {
    try {
        const data = localStorage.getItem('mapDrawings');
        if (data) {
            const drawings = JSON.parse(data);
            drawings.forEach(geojson => {
                let layer;

                // Circle 복원
                if (geojson.properties?.shapeType === 'circle' && geojson.geometry.type === 'Point') {
                    const center = [geojson.geometry.coordinates[1], geojson.geometry.coordinates[0]];
                    const radius = geojson.properties.radius;
                    const style = geojson.properties.style || {};
                    layer = L.circle(center, {
                        radius: radius,
                        color: style.color || '#10b981',
                        fillOpacity: style.fillOpacity || 0.3
                    });
                    drawnItems.addLayer(layer);
                }
                // Marker 복원
                else if (geojson.properties?.shapeType === 'marker') {
                    layer = L.geoJSON(geojson, {
                        pointToLayer: function (feature, latlng) {
                            return L.marker(latlng);
                        }
                    });
                    layer.eachLayer(function (l) {
                        drawnItems.addLayer(l);
                    });
                }
                // Polyline, Polygon, Rectangle 등 복원
                else {
                    const style = geojson.properties?.style || {};
                    layer = L.geoJSON(geojson, {
                        style: function () {
                            return {
                                color: style.color || '#3b82f6',
                                weight: style.weight || 3,
                                fillOpacity: style.fillOpacity || 0.3,
                                opacity: style.opacity || 1
                            };
                        },
                        pane: 'drawPane'  // 그리기 전용 pane 사용
                    });
                    layer.eachLayer(function (l) {
                        // 자유 그리기 타입 복원
                        if (geojson.properties?.shapeType === 'freehand') {
                            l.layerType = 'freehand';
                        }
                        drawnItems.addLayer(l);
                    });
                }
            });
        }
    } catch (error) {
        console.error('그리기 데이터 로드 실패:', error);
    }
}

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

// ===================================
// 교과서 뷰어 기능
// ===================================

// 다음 페이지
function nextPage() {
    if (currentPage < totalPages - 1) {
        currentPage++;
        updateTextbookPage();
    }
}

// 이전 페이지
function previousPage() {
    if (currentPage > 0) {
        currentPage--;
        updateTextbookPage();
    }
}

// 특정 페이지로 이동
function goToPage(page) {
    page = parseInt(page);
    if (page >= 0 && page < totalPages) {
        currentPage = page;
        updateTextbookPage();
    }
}

// 페이지 업데이트
function updateTextbookPage() {
    const img = document.getElementById('textbook-page-image');
    const pageInput = document.getElementById('page-input');

    if (img) {
        img.src = `img/textbook/historybook/${currentPage}.png`;
        img.style.transform = `scale(${zoomLevel})`;
    }

    if (pageInput) {
        pageInput.value = currentPage;
    }
}

// 확대
function zoomIn() {
    if (zoomLevel < 3.0) {
        zoomLevel += 0.2;
        updateZoom();
    }
}

// 축소
function zoomOut() {
    if (zoomLevel > 0.5) {
        zoomLevel -= 0.2;
        updateZoom();
    }
}

// 줌 초기화
function resetZoom() {
    zoomLevel = 1.0;
    updateZoom();
}

// 줌 업데이트
function updateZoom() {
    const img = document.getElementById('textbook-page-image');
    const zoomText = document.getElementById('zoom-level');

    if (img) {
        img.style.transform = `scale(${zoomLevel})`;
    }

    if (zoomText) {
        zoomText.textContent = Math.round(zoomLevel * 100) + '%';
    }
}

// 페이지 클릭 이벤트 (좌표 표시 - 개발용)
function handlePageClick(event) {
    const img = event.target;
    const rect = img.getBoundingClientRect();

    // 이미지 내 상대 좌표 계산
    const x = Math.round((event.clientX - rect.left) / rect.width * 100 * 100) / 100;
    const y = Math.round((event.clientY - rect.top) / rect.height * 100 * 100) / 100;

    // 좌표 표시 (개발용)
    const coordDiv = document.getElementById('click-coords');
    const coordText = document.getElementById('coord-text');

    if (coordDiv && coordText) {
        coordText.textContent = `${x}%, ${y}%`;
        coordDiv.style.display = 'block';

        setTimeout(() => {
            coordDiv.style.display = 'none';
        }, 3000);
    }

    console.log(`페이지 ${currentPage} 클릭 좌표: ${x}%, ${y}%`);

    // TODO: 나중에 특정 영역 클릭 시 기능 추가
    // 예: checkClickableArea(currentPage, x, y);
}

// 키보드 단축키
document.addEventListener('keydown', function (e) {
    const panel = document.getElementById('panel-textbook');
    if (panel && panel.classList.contains('open')) {
        if (e.key === 'ArrowRight') {
            nextPage();
        } else if (e.key === 'ArrowLeft') {
            previousPage();
        } else if (e.key === '+' || e.key === '=') {
            zoomIn();
        } else if (e.key === '-') {
            zoomOut();
        } else if (e.key === '0') {
            resetZoom();
        }
    }
});

// ===================================
// 교과서 필기 기능
// ===================================
let textbookCanvas = null;
let textbookCtx = null;
let isTextbookDrawing = false;
let textbookDrawMode = false;
let textbookDrawTool = 'pen';
let textbookLastX = 0;
let textbookLastY = 0;
let textbookDrawings = {}; // 페이지별 필기 저장

// 필기 모드 토글
function toggleTextbookDrawMode() {
    textbookDrawMode = !textbookDrawMode;
    const toolbar = document.getElementById('textbook-draw-toolbar');
    const canvas = document.getElementById('textbook-draw-canvas');
    const toggleBtn = document.getElementById('textbook-draw-toggle-btn');

    if (textbookDrawMode) {
        toolbar.style.display = 'block';
        canvas.style.display = 'block';
        canvas.style.pointerEvents = 'auto';
        toggleBtn.style.background = 'var(--primary-color)';
        toggleBtn.style.color = 'white';
        initTextbookCanvas();
        loadTextbookDrawing();
    } else {
        toolbar.style.display = 'none';
        canvas.style.pointerEvents = 'none';
        toggleBtn.style.background = '';
        toggleBtn.style.color = '';
    }
}

// 캔버스 초기화
function initTextbookCanvas() {
    textbookCanvas = document.getElementById('textbook-draw-canvas');
    const img = document.getElementById('textbook-page-image');

    if (!textbookCanvas || !img) return;

    // 캔버스 크기를 이미지와 동일하게 설정
    textbookCanvas.width = img.width;
    textbookCanvas.height = img.height;
    textbookCanvas.style.width = img.offsetWidth + 'px';
    textbookCanvas.style.height = img.offsetHeight + 'px';

    textbookCtx = textbookCanvas.getContext('2d');

    // 이벤트 리스너
    textbookCanvas.addEventListener('mousedown', startTextbookDrawing);
    textbookCanvas.addEventListener('mousemove', drawOnTextbook);
    textbookCanvas.addEventListener('mouseup', stopTextbookDrawing);
    textbookCanvas.addEventListener('mouseout', stopTextbookDrawing);

    // 터치 이벤트
    textbookCanvas.addEventListener('touchstart', handleTextbookTouchStart);
    textbookCanvas.addEventListener('touchmove', handleTextbookTouchMove);
    textbookCanvas.addEventListener('touchend', stopTextbookDrawing);
}

// 그리기 도구 설정
function setTextbookDrawTool(tool) {
    textbookDrawTool = tool;

    // 버튼 활성화 표시
    document.querySelectorAll('.textbook-draw-tool-btn').forEach(btn => {
        btn.style.background = '';
        btn.style.color = '';
    });

    const activeBtn = document.querySelector(`[data-tool="${tool}"]`);
    if (activeBtn) {
        activeBtn.style.background = 'var(--primary-color)';
        activeBtn.style.color = 'white';
    }
}

// 그리기 시작
function startTextbookDrawing(e) {
    if (!textbookDrawMode) return;
    isTextbookDrawing = true;
    const rect = textbookCanvas.getBoundingClientRect();
    textbookLastX = e.clientX - rect.left;
    textbookLastY = e.clientY - rect.top;
}

// 그리기
function drawOnTextbook(e) {
    if (!isTextbookDrawing || !textbookDrawMode) return;

    const rect = textbookCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const colorInput = document.getElementById('textbook-draw-color');
    const widthInput = document.getElementById('textbook-draw-width');

    textbookCtx.beginPath();
    textbookCtx.moveTo(textbookLastX, textbookLastY);
    textbookCtx.lineTo(x, y);

    if (textbookDrawTool === 'pen') {
        textbookCtx.strokeStyle = colorInput.value;
        textbookCtx.lineWidth = widthInput.value;
        textbookCtx.globalAlpha = 1;
        textbookCtx.lineCap = 'round';
    } else if (textbookDrawTool === 'highlighter') {
        textbookCtx.strokeStyle = colorInput.value;
        textbookCtx.lineWidth = widthInput.value * 3;
        textbookCtx.globalAlpha = 0.3;
        textbookCtx.lineCap = 'square';
    } else if (textbookDrawTool === 'eraser') {
        textbookCtx.globalCompositeOperation = 'destination-out';
        textbookCtx.lineWidth = widthInput.value * 3;
        textbookCtx.lineCap = 'round';
    }

    textbookCtx.stroke();
    textbookCtx.globalCompositeOperation = 'source-over';

    textbookLastX = x;
    textbookLastY = y;
}

// 그리기 중지
function stopTextbookDrawing() {
    isTextbookDrawing = false;
}

// 터치 이벤트 처리
function handleTextbookTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    textbookCanvas.dispatchEvent(mouseEvent);
}

function handleTextbookTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    textbookCanvas.dispatchEvent(mouseEvent);
}

// 현재 페이지 필기 저장
function saveTextbookDrawing() {
    if (!textbookCanvas) return;

    textbookDrawings[currentPage] = textbookCanvas.toDataURL();

    // 로컬 스토리지에 저장
    try {
        localStorage.setItem('textbookDrawings', JSON.stringify(textbookDrawings));
        alert('✅ 필기가 저장되었습니다!');
    } catch (e) {
        console.error('필기 저장 실패:', e);
        alert('❌ 필기 저장에 실패했습니다.');
    }
}

// 페이지 필기 불러오기
function loadTextbookDrawing(silent = false) {
    if (!textbookCanvas || !textbookCtx) return;

    // 캔버스 초기화
    textbookCtx.clearRect(0, 0, textbookCanvas.width, textbookCanvas.height);

    // 저장된 필기 불러오기
    if (textbookDrawings[currentPage]) {
        const img = new Image();
        img.onload = function () {
            textbookCtx.drawImage(img, 0, 0, textbookCanvas.width, textbookCanvas.height);
            if (!silent) {
                alert('📂 필기를 불러왔습니다!');
            }
        };
        img.src = textbookDrawings[currentPage];
        console.log('✅ 페이지', currentPage, '필기 불러오기 완료');
    } else {
        if (!silent) {
            alert('ℹ️ 이 페이지에 저장된 필기가 없습니다.');
        }
        console.log('ℹ️ 페이지', currentPage, '에 저장된 필기가 없습니다.');
    }
}

// 현재 페이지 필기 지우기 (화면만 지움, 저장된 데이터는 유지)
function clearTextbookDrawing() {
    if (!textbookCtx) return;

    if (confirm('현재 화면의 필기를 지우시겠습니까?\n(저장된 필기는 유지됩니다)')) {
        textbookCtx.clearRect(0, 0, textbookCanvas.width, textbookCanvas.height);
        alert('✅ 화면이 지워졌습니다. 저장하지 않으면 이전 필기를 불러올 수 있습니다.');
    }
}

// 현재 페이지 저장된 필기 완전 삭제
function deleteTextbookDrawing() {
    if (!textbookCtx) return;

    if (confirm('현재 페이지의 저장된 필기를 완전히 삭제하시겠습니까?\n(이 작업은 되돌릴 수 없습니다)')) {
        textbookCtx.clearRect(0, 0, textbookCanvas.width, textbookCanvas.height);
        delete textbookDrawings[currentPage];
        localStorage.setItem('textbookDrawings', JSON.stringify(textbookDrawings));
        alert('🗑️ 저장된 필기가 삭제되었습니다.');
    }
}

// 앱 시작 시 저장된 필기 불러오기
function loadAllTextbookDrawings() {
    try {
        const saved = localStorage.getItem('textbookDrawings');
        if (saved) {
            textbookDrawings = JSON.parse(saved);
        }
    } catch (e) {
        console.error('필기 불러오기 실패:', e);
    }
}

// 페이지 변경 시 필기도 함께 업데이트
const originalUpdateTextbookPage = updateTextbookPage;
updateTextbookPage = function () {
    originalUpdateTextbookPage();
    if (textbookDrawMode) {
        setTimeout(() => {
            initTextbookCanvas();
            loadTextbookDrawing(true); // silent 모드로 자동 불러오기
        }, 100);
    }
};

// 굵기 슬라이더 값 표시
document.addEventListener('DOMContentLoaded', function () {
    const widthSlider = document.getElementById('textbook-draw-width');
    const widthValue = document.getElementById('textbook-draw-width-value');

    if (widthSlider && widthValue) {
        widthSlider.addEventListener('input', function () {
            widthValue.textContent = this.value + 'px';
        });
    }

    // 저장된 필기 불러오기
    loadAllTextbookDrawings();
});

// ===================================
// 교과서 인터랙티브 기능
// ===================================

// 지도에서 국가 영역 하이라이트
function highlightOnMap(countryName) {
    console.log(`${countryName} 영역 하이라이트`);

    // 패널 닫기
    closePanel('panel-textbook');

    // 지도에 포커스하고 해당 국가 영역을 찾아서 하이라이트
    if (historicalLayer) {
        historicalLayer.eachLayer(function (layer) {
            if (layer.feature && layer.feature.properties) {
                const name = layer.feature.properties.name || '';
                if (name.includes(countryName)) {
                    // 해당 레이어를 일시적으로 하이라이트
                    const originalStyle = {
                        fillColor: layer.options.fillColor,
                        fillOpacity: layer.options.fillOpacity,
                        weight: layer.options.weight
                    };

                    layer.setStyle({
                        fillColor: '#ffff00',
                        fillOpacity: 0.6,
                        weight: 3
                    });

                    // 해당 위치로 지도 이동
                    map.fitBounds(layer.getBounds());

                    // 3초 후 원래 스타일로 복원
                    setTimeout(() => {
                        layer.setStyle(originalStyle);
                    }, 3000);
                }
            }
        });
    }
}

// 지도에서 특정 위치 표시
function showLocationOnMap(lat, lng) {
    console.log(`위치 표시: ${lat}, ${lng}`);

    // 패널 닫기
    closePanel('panel-textbook');

    // 지도 이동
    map.flyTo([lat, lng], 8, {
        duration: 1.5
    });

    // 임시 마커 추가
    const tempMarker = L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'temp-location-marker',
            html: '📍',
            iconSize: [30, 30]
        })
    }).addTo(map);

    // 5초 후 마커 제거
    setTimeout(() => {
        map.removeLayer(tempMarker);
    }, 5000);
}

// 특정 연도로 타임라인 이동
function jumpToYear(year) {
    console.log(`${year}년으로 이동`);

    // 패널 닫기
    closePanel('panel-textbook');

    // 연도 업데이트
    updateYear(year);

    // 애니메이션 효과
    const yearDisplay = document.getElementById('era-year'); // ID 수정됨
    if (yearDisplay) {
        yearDisplay.style.transform = 'scale(1.3)';
        yearDisplay.style.color = 'var(--primary-color)';
        setTimeout(() => {
            yearDisplay.style.transform = 'scale(1)';
            yearDisplay.style.color = '';
        }, 500);
    }
}

// 인물 정보 팝업
function openCharacterInfo(characterName) {
    console.log(`${characterName} 정보 열기`);

    // 인물 대화 패널 열기
    openCharacterChat(characterName);
}

// 용어 정의 팝업
function showTermDefinition(term) {
    const definitions = {
        '남진정책': '고구려가 남쪽으로 영토를 확장하려는 정책으로, 특히 장수왕 시기에 활발히 추진되었습니다. 475년 백제의 수도 한성을 함락시키는 등 큰 성과를 거두었습니다.',
        '평양 천도': '427년(장수왕 15년) 고구려가 국내성에서 평양으로 수도를 옮긴 사건입니다. 이를 통해 한반도 중부 지역으로의 진출이 용이해졌습니다.',
        '삼국통일': '신라가 660년 백제를 멸망시키고, 668년 고구려를 멸망시켜 한반도를 통일한 사건입니다.',
        '화랑도': '신라 시대의 청소년 수련 단체로, 심신 수양과 무예 연마를 통해 인재를 양성했습니다.',
        '골품제': '신라의 신분 제도로, 혈통에 따라 사회적 지위가 결정되었습니다.'
    };

    const definition = definitions[term] || `${term}에 대한 설명입니다.`;

    // 간단한 알림으로 표시
    alert(`📚 ${term}\n\n${definition}`);
}

// ===================================
// 기존 유틸리티 함수
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

// ===================================
// 타임라인 UI 로직 (OldMapsOnline 스타일)
// ===================================
const MIN_YEAR = -2000;
const MAX_YEAR = 2024;
const TOTAL_YEARS = MAX_YEAR - MIN_YEAR;

// 시대 정의
const ERAS = [
    { name: '고조선', start: -2333, end: -108, color: '#9ca3af' },
    { name: '원삼국', start: -108, end: 300, color: '#d1d5db' },
    { name: '삼국', start: 300, end: 668, color: '#fda4af' },
    { name: '남북국', start: 668, end: 918, color: '#7dd3fc' },
    { name: '고려', start: 918, end: 1392, color: '#86efac' },
    { name: '조선', start: 1392, end: 1897, color: '#fde047' },
    { name: '대한제국', start: 1897, end: 1910, color: '#f59e0b' },
    { name: '일제', start: 1910, end: 1945, color: '#dc2626' },
    { name: '현대', start: 1945, end: 2024, color: '#60a5fa' }
];

// 연도로부터 시대 인덱스 찾기
function getEraIndexForYear(year) {
    for (let i = 0; i < ERAS.length; i++) {
        if (year >= ERAS[i].start && year <= ERAS[i].end) {
            return i;
        }
    }
    return 2; // 기본값: 삼국시대
}

// 시대에 맞게 타임라인 재렌더링
function updateTimelineForEra(eraIndex) {
    const axis = document.getElementById('timeline-axis');
    const erasContainer = document.getElementById('timeline-eras');

    if (!axis || !erasContainer) return;

    const era = ERAS[eraIndex];
    const eraStart = era.start;
    const eraEnd = era.end;
    const eraYears = eraEnd - eraStart;

    // 1. 눈금 생성 (시대에 맞는 간격으로)
    axis.innerHTML = '';
    let tickInterval = 100; // 기본 100년 간격
    if (eraYears < 100) tickInterval = 10;
    else if (eraYears < 500) tickInterval = 50;

    for (let year = Math.ceil(eraStart / tickInterval) * tickInterval; year <= eraEnd; year += tickInterval) {
        const percent = ((year - eraStart) / eraYears) * 100;

        const tick = document.createElement('div');
        tick.className = 'timeline-tick major';
        tick.style.left = `${percent}%`;

        const label = document.createElement('div');
        label.className = 'timeline-tick-label';
        label.textContent = year < 0 ? `BC ${Math.abs(year)}` : year;
        label.style.left = `${percent}%`;

        axis.appendChild(tick);
        axis.appendChild(label);
    }

    // 2. 현재 시대 블록만 표시 (전체 너비)
    erasContainer.innerHTML = '';
    const block = document.createElement('div');
    block.className = 'timeline-era-block';
    block.style.left = '0%';
    block.style.width = '100%';
    block.style.backgroundColor = era.color;
    block.textContent = era.name;
    block.title = `${era.name} (${era.start < 0 ? 'BC ' + Math.abs(era.start) : era.start} ~ ${era.end < 0 ? 'BC ' + Math.abs(era.end) : era.end})`;
    erasContainer.appendChild(block);

    // 3. 시대 이름 표시 업데이트
    const eraNameEl = document.getElementById('timeline-era-name');
    if (eraNameEl) {
        eraNameEl.textContent = era.name;
    }

    // 4. 현재 연도가 시대 범위를 벗어나면 시대 중간으로 이동
    if (currentYear < eraStart || currentYear > eraEnd) {
        currentYear = Math.floor((eraStart + eraEnd) / 2);
        updateYear(currentYear);
    } else {
        updateTimelineHandle(currentYear);
    }
}

// 특정 시대로 전환
function switchToEra(eraIndex) {
    if (eraIndex < 0 || eraIndex >= ERAS.length) return;
    if (isEraTransitioning) return;

    isEraTransitioning = true;
    currentEraIndex = eraIndex;

    // 부드러운 전환을 위한 애니메이션
    const wrapper = document.getElementById('timeline-wrapper');
    if (wrapper) {
        wrapper.style.opacity = '0.5';
    }

    setTimeout(() => {
        updateTimelineForEra(eraIndex);
        if (wrapper) {
            wrapper.style.opacity = '1';
        }
        isEraTransitioning = false;
    }, 300);
}

// 다음 시대로 이동
function nextEra() {
    if (currentEraIndex < ERAS.length - 1) {
        switchToEra(currentEraIndex + 1);
    }
}

// 이전 시대로 이동
function prevEra() {
    if (currentEraIndex > 0) {
        switchToEra(currentEraIndex - 1);
    }
}

function initTimeline() {
    const axis = document.getElementById('timeline-axis');
    const erasContainer = document.getElementById('timeline-eras');
    const wrapper = document.getElementById('timeline-wrapper');
    const handle = document.getElementById('timeline-handle');

    if (!axis || !erasContainer || !wrapper || !handle) return;

    console.log('initTimeline called - era-focused mode');

    // 현재 시대 설정
    updateTimelineForEra(currentEraIndex);

    // 3. 이벤트 리스너 (클릭 및 드래그)
    let isDragging = false;

    wrapper.addEventListener('mousedown', (e) => {
        isDragging = true;
        handleTimelineInput(e);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            handleTimelineInput(e);
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // 초기 위치 설정
    updateTimelineHandle(currentYear);
}

function handleTimelineInput(e) {
    const wrapper = document.getElementById('timeline-wrapper');
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    let x = e.clientX - rect.left;

    // 범위 제한
    x = Math.max(0, Math.min(x, rect.width));

    const percent = x / rect.width;

    // 현재 시대 범위 내에서 연도 계산
    const era = ERAS[currentEraIndex];
    let year = Math.round(era.start + (percent * (era.end - era.start)));

    // 경계 도달 시 시대 전환
    const threshold = (era.end - era.start) * 0.02; // 시대 범위의 2%를 임계값으로 사용

    if (year <= era.start + threshold && currentEraIndex > 0) {
        // 시대 시작점에 도달 -> 이전 시대로
        switchToEra(currentEraIndex - 1);
        // 이전 시대의 끝 부분으로 이동
        const prevEra = ERAS[currentEraIndex - 1];
        year = prevEra.end - Math.floor((prevEra.end - prevEra.start) * 0.1);
        setTimeout(() => updateYear(year), 350);
        return;
    } else if (year >= era.end - threshold && currentEraIndex < ERAS.length - 1) {
        // 시대 끝점에 도달 -> 다음 시대로
        switchToEra(currentEraIndex + 1);
        // 다음 시대의 시작 부분으로 이동
        const nextEra = ERAS[currentEraIndex + 1];
        year = nextEra.start + Math.floor((nextEra.end - nextEra.start) * 0.1);
        setTimeout(() => updateYear(year), 350);
        return;
    }

    updateYear(year);
}

function updateTimelineHandle(year) {
    const handle = document.getElementById('timeline-handle');
    const label = document.getElementById('handle-label');

    if (handle && label) {
        // 현재 시대 범위 내에서 위치 계산
        const era = ERAS[currentEraIndex];
        const safeYear = Math.max(era.start, Math.min(year, era.end));
        const percent = ((safeYear - era.start) / (era.end - era.start)) * 100;

        handle.style.left = `${percent}%`;
        label.textContent = safeYear < 0 ? `BC ${Math.abs(safeYear)}` : safeYear;
    }
}


function previewGeoJSON() {
    try {
        console.log('previewGeoJSON called');
        // 기존 유틸리티 함수 사용
        const data = convertDrawnItemsToGeoJSON();
        console.log('GeoJSON data converted:', data);

        if (!data || data.features.length === 0) {
            alert('먼저 지도에 영역을 그려주세요!');
            return;
        }

        const jsonStr = JSON.stringify(data, null, 2);

        const preview = document.getElementById('geojson-preview');
        const modal = document.getElementById('geojson-modal');

        console.log('Modal elements:', { preview, modal });

        if (preview && modal) {
            preview.textContent = jsonStr;
            modal.style.display = 'flex';
            console.log('Modal displayed');
        } else {
            console.error('GeoJSON 모달 요소를 찾을 수 없습니다.');
            alert('오류: GeoJSON 모달 요소를 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('GeoJSON 미리보기 오류:', error);
        alert('미리보기 중 오류가 발생했습니다: ' + error.message);
    }
}

function closeGeoJSONModal() {
    const modal = document.getElementById('geojson-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function copyGeoJSONToClipboard() {
    const preview = document.getElementById('geojson-preview');
    if (preview) {
        const text = preview.textContent;
        navigator.clipboard.writeText(text).then(() => {
            alert('GeoJSON이 클립보드에 복사되었습니다!');
        }).catch(err => {
            console.error('복사 실패:', err);
            alert('복사에 실패했습니다.');
        });
    }
}
