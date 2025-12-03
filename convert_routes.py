import json

# GeoJSON 파일 읽기
with open('1235_1239.geojson', 'r', encoding='utf-8') as f:
    data = json.load(f)

routes = []
route_num = 7

for feature in data['features']:
    name = feature['properties']['name']
    coords = feature['geometry']['coordinates'][0]  # Polygon의 첫 번째 링
    
    # 설명 생성
    descriptions = {
        '충주': '몽골군의 2차 침입 시 충주 지역 공격 경로',
        '처인성': '김윤후가 살리타를 사살한 처인성 전투 경로 (1232년)',
        '죽주성': '송문주가 방어한 죽주성 전투 경로 (1232년)',
        '수안': '몽골군의 북방 진격로 (수안 지역)',
        '나주': '몽골군의 호남 지역 침입 경로',
        '동경': '몽골군의 영남 지역 침입 경로 (황룡사 9층탑 소실)',
        '전주': '몽골군의 전라도 침입 경로',
        '합천': '몽골군의 경상도 내륙 침입 경로',
        '삼별초': '삼별초 항쟁 경로'
    }
    
    desc = descriptions.get(name, f'{name} 지역 전투 경로')
    
    route = {
        "type": "Feature",
        "properties": {
            "warId": "WAR_MG",
            "routeType": "resistance" if name == "삼별초" else "invasion",
            "name": f"{route_num}. {desc}",
            "description": desc,
            "stroke": "#0000FF" if name == "삼별초" else "#FF0000",
            "stroke-width": 3
        },
        "geometry": {
            "type": "LineString",
            "coordinates": coords
        }
    }
    
    routes.append(route)
    route_num += 1

# 결과를 JavaScript 형식으로 출력
print("추가할 경로들:")
print()
for route in routes:
    print("        {")
    print(f'            "type": "Feature",')
    print(f'            "properties": {{')
    print(f'                "warId": "{route["properties"]["warId"]}",')
    print(f'                "routeType": "{route["properties"]["routeType"]}",')
    print(f'                "name": "{route["properties"]["name"]}",')
    print(f'                "description": "{route["properties"]["description"]}",')
    print(f'                "stroke": "{route["properties"]["stroke"]}",')
    print(f'                "stroke-width": {route["properties"]["stroke-width"]}')
    print(f'            }},')
    print(f'            "geometry": {{')
    print(f'                "type": "LineString",')
    print(f'                "coordinates": [')
    
    for i, coord in enumerate(route['geometry']['coordinates']):
        comma = ',' if i < len(route['geometry']['coordinates']) - 1 else ''
        print(f'                    [{coord[0]}, {coord[1]}]{comma}')
    
    print(f'                ]')
    print(f'            }}')
    print(f'        }},')
    print()
