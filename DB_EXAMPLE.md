# 교과서 필기 DB 저장 예시

## 현재 localStorage 데이터 (JSON)
```json
{
  "0": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABaAAAAOgCAYAAADSr...",
  "5": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABaAAAAOgCAYAAADSr...",
  "12": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABaAAAAOgCAYAAADSr..."
}
```

---

## DB 테이블 설계

### 테이블 스키마 (MySQL/MariaDB)
```sql
CREATE TABLE textbook_drawings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    page_number INT NOT NULL,
    drawing_data LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_page (user_id, page_number),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## DB에 저장된 실제 데이터 예시

### 레코드 1: 0페이지 필기
```
id: 1
user_id: "student_kim"
page_number: 0
drawing_data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABaAAAAOgCAYAAADSrD0AAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAACAASURBVHhe7d0HmFxl2f7x3/..." (약 50,000자)
created_at: 2025-11-25 14:30:15
updated_at: 2025-11-25 14:30:15
```

### 레코드 2: 5페이지 필기
```
id: 2
user_id: "student_kim"
page_number: 5
drawing_data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABaAAAAOgCAYAAADSrD0AAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAACAASURBVHhe7d0HmFxl2f7x3/..." (약 45,000자)
created_at: 2025-11-25 14:35:22
updated_at: 2025-11-25 14:35:22
```

### 레코드 3: 12페이지 필기
```
id: 3
user_id: "student_kim"
page_number: 12
drawing_data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABaAAAAOgCAYAAADSrD0AAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAACAASURBVHhe7d0HmFxl2f7x3/..." (약 60,000자)
created_at: 2025-11-25 14:40:08
updated_at: 2025-11-25 14:40:08
```

---

## SQL 쿼리 예시

### 1. 저장 (INSERT/UPDATE)
```sql
INSERT INTO textbook_drawings (user_id, page_number, drawing_data) 
VALUES (
    'student_kim', 
    0, 
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABaAAAAOg...'
)
ON DUPLICATE KEY UPDATE 
    drawing_data = VALUES(drawing_data),
    updated_at = CURRENT_TIMESTAMP;
```

### 2. 불러오기 (SELECT)
```sql
SELECT drawing_data 
FROM textbook_drawings 
WHERE user_id = 'student_kim' 
  AND page_number = 0;
```

**결과:**
```
drawing_data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABaAAAAOg..."
```

### 3. 삭제 (DELETE)
```sql
DELETE FROM textbook_drawings 
WHERE user_id = 'student_kim' 
  AND page_number = 0;
```

### 4. 사용자의 모든 필기 조회
```sql
SELECT page_number, 
       LENGTH(drawing_data) as data_size,
       created_at,
       updated_at
FROM textbook_drawings 
WHERE user_id = 'student_kim'
ORDER BY page_number;
```

**결과:**
```
page_number | data_size | created_at          | updated_at
------------|-----------|---------------------|--------------------
0           | 52,341    | 2025-11-25 14:30:15 | 2025-11-25 14:30:15
5           | 47,892    | 2025-11-25 14:35:22 | 2025-11-25 14:35:22
12          | 61,204    | 2025-11-25 14:40:08 | 2025-11-25 14:40:08
```

---

## 데이터 크기 예시

### Base64 인코딩된 PNG 이미지
- 1개 페이지 필기: 약 20-100 KB (텍스트)
- 220페이지 모두 필기 시: 약 5-20 MB
- LONGTEXT 컬럼 최대: 4 GB (충분함)

### 실제 drawing_data 컬럼 내용 (일부)
```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABaAAAAOgCAYAAADSrD0AAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAACAASURBVHhe7d0HmFxl2f7x3/bcZ2dn+jbbN5vNZnvPZpNNSCAJCQktQOggiCgqKCqKqKgoimJBBEFFRUREURFFBUVQQRREkCYlhYSEhPRke2Z3Zu/3OWfuzGYT...
(총 50,000~100,000자 계속...)
```

---

## 용량 비교

| 저장 방식 | 1페이지 크기 | 220페이지 크기 | 장점 |
|---------|-----------|--------------|-----|
| localStorage (현재) | 50 KB | ~10 MB | 서버 불필요 |
| DB Base64 TEXT | 50 KB | ~10 MB | 다중 기기 공유 |
| DB BLOB 바이너리 | 35 KB | ~7 MB | 30% 용량 절약 |
| 파일 시스템 | 35 KB | ~7 MB | 가장 효율적 |

---

## 추천: Base64 TEXT 방식

**장점:**
✅ 현재 코드 거의 수정 불필요  
✅ `textbookCanvas.toDataURL()` 결과를 그대로 저장  
✅ 불러올 때도 `img.src = drawing_data` 그대로 사용  
✅ 구현 간단, 디버깅 쉬움  

**단점:**
❌ 바이너리보다 30% 큰 용량  
❌ 하지만 LONGTEXT(4GB)로 충분함  
