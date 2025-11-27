# Spring Boot로 실행하기

## 필요한 것
- Java 17 이상
- Maven

## 파일 구조 설정

모든 정적 파일을 `src/main/resources/static/`으로 복사해야 합니다:

```powershell
# Windows
xcopy /E /I history-learning-app.html src\main\resources\static\
xcopy /E /I styles src\main\resources\static\styles
xcopy /E /I scripts src\main\resources\static\scripts
xcopy /E /I geojson src\main\resources\static\geojson
xcopy /E /I lib src\main\resources\static\lib
```

또는 Linux/Mac:
```bash
cp -r history-learning-app.html styles scripts geojson lib src/main/resources/static/
```

## 실행 방법

### Maven 사용
```bash
mvn spring-boot:run
```

### JAR 빌드 후 실행
```bash
mvn clean package
java -jar target/historical-map-1.0.0.jar
```

## 접속
```
http://localhost:8000/
```

자동으로 `history-learning-app.html`이 열립니다.

## 장점
- ✅ Python 불필요
- ✅ 프로덕션 배포 용이
- ✅ REST API 추가 가능
- ✅ 데이터베이스 연동 가능
