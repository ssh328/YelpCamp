# YelpCamp

## 프로젝트 소개
YelpCamp는 캠핑장 리뷰 및 정보 공유 플랫폼입니다. 사용자들이 캠핑장을 등록하고, 리뷰를 작성하며, 위치 정보를 지도에서 확인할 수 있습니다.

## 📌주요 기능

- **사용자 인증**
  - 회원가입/로그인/로그아웃
  - 이메일과 사용자명 기반 계정 관리

- **캠핑장 관리**
  - 캠핑장 등록, 수정, 삭제
  - 이미지 업로드 (다중 이미지 지원)
  - 위치 정보 등록 (Mapbox 지도 연동)
  - 페이지네이션 지원

- **리뷰 시스템**
  - 별점 평가 (1-5점)
  - 리뷰 작성 및 삭제
  - 페이지네이션 지원

- **지도 기능**
  - 캠핑장 위치 클러스터링
  - 인터랙티브 지도 네비게이션
  - 팝업 정보 표시

## ⚙️기술 스택

### Frontend
- EJS (템플릿 엔진)
- Bootstrap 5
- Mapbox GL JS
- 반응형 웹 디자인

### Backend
- Node.js
- Express.js
- Passport.js (인증)

### Database
- MongoDB (Mongoose) 

### 클라우드 서비스
- Cloudinary (이미지 저장)
- Mapbox (지도 서비스)
- MongoDB Atlas (데이터베이스)

### 보안
- Helmet (보안 헤더)
- Express-mongo-sanitize
- JOI (데이터 검증)
- Sanitize-html

## 💻실행 방법
1. Git clone 사용 또는, 다운로드
```
cd YelpCamp
npm install
```
2. .env 파일 생성 후 아래 내용 추가
- CLOUDINARY_CLOUD_NAME=your_cloud_name
- CLOUDINARY_KEY=your_key
- CLOUDINARY_SECRET=your_secret
- MAPBOX_TOKEN=your_mapbox_token
- DB=your_db
```
node app.js
```
4. 웹 브라우저 접속 <http://localhost:3000/>
