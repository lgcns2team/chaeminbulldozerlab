# API 키 보안 설정 가이드

## 📌 API 키 안전하게 사용하기

이 프로젝트는 API 키를 안전하게 관리하기 위해 브라우저의 localStorage를 사용합니다.

### 🔐 API 키 설정 방법

1. **웹 앱 실행**
2. **브라우저 개발자 도구 열기** (F12)
3. **Console 탭**에서 다음 명령어 실행:

```javascript
// OpenAI API 키 설정
appConfig.setApiKey('your-api-key-here');

// Provider 설정 (openai 또는 ollama)
appConfig.setProvider('openai');
```

### ✅ 설정 확인

```javascript
// 현재 설정 확인
appConfig.getConfig();
```

### 🔒 보안 특징

- ✅ API 키가 코드에 포함되지 않음
- ✅ GitHub에 업로드되지 않음
- ✅ 브라우저 localStorage에 안전하게 저장
- ✅ 각 사용자가 자신의 키 사용

### 📝 주의사항

- API 키는 절대 공개 저장소에 커밋하지 마세요
- `.env` 파일은 `.gitignore`에 포함되어 있습니다
- 키가 노출되었다면 즉시 폐기하고 새로 발급받으세요

### 🌐 Ollama 사용 (로컬 AI)

API 키 없이 로컬에서 AI를 사용하려면:

```javascript
appConfig.setProvider('ollama');
appConfig.setOllamaUrl('http://localhost:11434');
```
