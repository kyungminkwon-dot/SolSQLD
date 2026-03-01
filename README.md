# SolSQLD

> SQLD 모의고사 및 SQL 실습 플랫폼

SQLD(SQL Developer) 자격증 준비를 위한 웹 기반 학습 플랫폼입니다.
실제 시험과 동일한 50문항 모의고사와 Oracle 환경의 SQL 실습 기능을 제공합니다.

---

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **목표** | 비용을 최소화하면서 실무에 가까운 풀스택 + 인프라 경험 |
| **아키텍처** | 마이크로서비스 지향, K8s 기반 |
| **개발 기간** | 2026.03 ~ |
| **배포 환경** | Kubernetes (로컬 클러스터) + Cloudflare WARP |

## 팀 구성

| 역할 | 담당자 | 범위 |
|------|--------|------|
| **기획 / Frontend** | 권경민 | 요구사항 정의, React UI 개발, CI/CD 구성 |
| **Backend / Infra** | 서현석 | FastAPI 서버, DB 설계, K8s 인프라 구축 |

---

## 기술 스택

### Frontend

| 기술 | 용도 |
|------|------|
| React 18 + TypeScript | UI 프레임워크 |
| Vite 6 | 빌드 도구 |
| Tailwind CSS 3 | 스타일링 |
| CodeMirror (SQL) | SQL 에디터 (구문 강조, Oracle 환경) |
| Recharts | 대시보드 차트 |
| React Router 6 | 클라이언트 라우팅 |

### Backend (계획)

| 기술 | 용도 |
|------|------|
| FastAPI | API 서버 (비동기, Swagger 자동 문서화) |
| Oracle Cloud Free Tier | SQLD 실습 DB (실제 Oracle SQL 문법 호환) |
| PostgreSQL | 유저/로그/채점 데이터, Golden Set 보관 |
| JWT | Stateless 인증 (K8s Pod 확장 대응) |

### Infra / DevOps

| 기술 | 용도 |
|------|------|
| Kubernetes | 컨테이너 오케스트레이션 |
| Cloudflare WARP (Zero Trust) | 인바운드 포트 차단 + 팀원 접근 제어 |
| GitHub Actions | CI (Prettier + ESLint + TypeScript 검사) |
| Airflow + dbt | 데이터 파이프라인 (로그 → 분석 마트) |

---

## 주요 기능

### 회원 관리

| 기능 | 설명 | 비고 |
|------|------|------|
| 회원가입 | 이메일, 비밀번호 입력을 통한 가입. 약관 및 개인정보 동의 필수 | 팝업 창 형태 |
| 닉네임 자동 설정 | 이메일의 @ 앞부분을 자동으로 닉네임으로 설정 | |
| 약관 & 개인정보 동의 토글 | '전문 보기' 클릭 시 전문 노출, 스크롤 후 동의버튼 활성화 | |
| 회원 맞춤 대시보드 | 로그인 시 '최근 푼 문제'와 '과목별 정답률'을 메인에 노출 | |

### 모의고사

| 기능 | 설명 | 비고 |
|------|------|------|
| 문제 리스트 | 회차별 문제 수(50문항), 평균 난이도, 풀이 여부 표시 | 스크롤 가능한 리스트 |
| 문제 풀이 | 문제 번호, 남은 시간 카운트다운, 이전/다음 이동 | A4 스케일 레이아웃 |
| 사이드 메모장 | '메모장' 버튼 클릭 시 우측에 실시간 텍스트 입력 창 | |
| 채점 및 결과 | 제출 시 'nn점으로 합격/불합격' 판정 결과 노출 | 해설/오답 보기 연결 |

### SQL 실습

| 기능 | 설명 | 비고 |
|------|------|------|
| 검색 및 필터 | 문제명 검색, 난이도별/정답률별 정렬 | |
| 쿼리 편집기 | SQL 구문 강조(Highlighting) 입력창 제공 | Oracle 환경 |
| 실시간 실행 | '실행' 버튼 클릭 시 하단에 결과 테이블 또는 에러 메시지 출력 | |
| 제출 결과 팝업 | 정답 시 '정답입니다' 팝업, 오답 시 예상 결과와 실제 결과 비교 노출 | |

---

## 데이터 모델 (ERD)

```
┌─────────────────────────────┐       ┌─────────────────────────────────┐
│         Submission          │       │            Problem              │
├─────────────────────────────┤       ├─────────────────────────────────┤
│ submission_id  BIGINT    PK │       │ problem_id   BIGINT          PK │
│ user_id        BIGINT    FK │──┐    │ title        VARCHAR(255)      │
│ problem_id     BIGINT    FK │──┼──> │ content      TEXT              │
│ submitted_sql  TEXT         │  │    │ category     TEXT (SQL/TEXT)   │
│ is_correct     BOOLEAN      │  │    │ level        INT (1=상/2=중/3=하)│
│ execution_time FLOAT        │  │    │ schema_sql   TEXT              │
│ error_message  TEXT         │  │    │ answer_sql   TEXT              │
│ created_at     TIMESTAMP    │  │    │ explanation  TEXT              │
│ updated_at     TIMESTAMP    │  │    │ created_at   TIMESTAMP        │
└─────────────────────────────┘  │    │ updated_at   TIMESTAMP        │
                                 │    └─────────────────────────────────┘
                                 │
                                 │    ┌─────────────────────────────────┐
                                 │    │             User                │
                                 │    ├─────────────────────────────────┤
                                 └──> │ user_id      BIGINT          PK │
                                      │ email        VARCHAR(255)      │
                                      │ password     VARCHAR(255)      │
                                      │ nickname     VARCHAR(50)       │
                                      │ created_at   TIMESTAMP         │
                                      │ updated_at   TIMESTAMP         │
                                      │ total_points INT               │
                                      └─────────────────────────────────┘

* TIMESTAMP = UTC 표준시 기준
```

---

## 이벤트 로그 정의서

| # | 발생 시점 (Trigger) | 기록 대상 (Data) | 대상 테이블 |
|---|---------------------|-----------------|-------------|
| 1 | 회원가입 버튼 클릭 | 이메일, 암호화된 비번, 닉네임, 약관 동의 여부, 가입 일시 | User |
| 2 | 최초 로그인 성공 | 닉네임 자동 설정값(이메일 ID 부분), 최초 접속 로그 | User |
| 3 | SQL 연습 - '실행' 클릭 | (임시 저장) 유저가 작성한 현재 쿼리문 (자동 저장용) | Local Storage / Submission (Draft) |
| 4 | SQL 연습 - '제출' 클릭 | user_id, problem_id, 제출 쿼리, 정답 여부, 서버 에러 메시지 | Submission |
| 5 | 객관식 문제 - 보기 선택 | 선택한 문항 번호(1~4), 정답 여부 판별 결과 | Submission |
| 6 | 모의고사 - 문제풀이 시작 | 전체 문항에 대한 정답 수, 총 소요 시간, 가장 최근에 푼 문제 | Exam_History |
| 7 | 모의고사 - 최종 제출 | 전체 문항에 대한 정답 수, 총 소요 시간, 합격/불합격 여부 | Exam_History |
| 8 | 사이드 메모장 입력 | 문제별 유저 메모 텍스트 (다음에 다시 볼 때 유지용) | Problem_Memo |
| 9 | 정답 처리 및 해설 확인 | 유저의 total_points 업데이트 (+10점 등) | User |
| 10 | 문제 풀이 종료 (공통) | 해당 문제의 '누적 풀이 횟수' 및 '정답률' 통계 업데이트 | Problem |
| 11 | 프로필/닉네임 수정 | 변경된 닉네임, 수정 일시(updated_at) | User |

---

## 아키텍처 핵심 결정 (ADR 요약)

| ADR | 결정 | 사유 |
|-----|------|------|
| **001** | K8s 기반 인프라 | 마이크로서비스 확장성, 실무 경험 |
| **002** | Cloudflare WARP (Zero Trust) | 인바운드 포트 차단, 이메일 기반 접근 제어 |
| **003** | FastAPI | K8s Pod 경량화, Swagger 자동 문서로 2인 협업 효율화 |
| **004** | Oracle Free Tier + PostgreSQL 이중 구조 | Oracle=SQLD 문법 호환, PostgreSQL=로그/채점/분석 |
| **004-1-1** | CTAS 기반 유저별 테이블 격리 | SQL Interceptor로 접두사 자동 부착 (EMP → U123_EMP) |
| **004-1-2** | 제출 후 무조건 리셋 (Unconditional Reset) | DML/DDL 실습 후 원본 데이터 보존 |
| **005** | Airflow + dbt 파이프라인 | Snowflake 과금 회피, K8s 내부 무료 운영 |
| **006** | JWT 인증 | Stateless, Pod 수평 확장에 유리 |
| **007** | 한글 에러 메시지 매핑 + Slack 알림 | ORA-XXXXX 코드를 유저 친화적 메시지로 변환 |
| **008** | 쿼리 결과 상위 30행 제한 | 브라우저 부하 방지, 채점은 전체 데이터 기준 |
| **009** | Rate Limiting (3초/1회) | 오라클 세션 풀 보호 |

> 전체 ADR 문서는 별도 관리 중입니다.

---

## 프로젝트 구조

```
SolSQLD/
├── src/
│   ├── components/          # 재사용 컴포넌트
│   │   ├── AuthModal.tsx    #   로그인/회원가입 모달
│   │   ├── CountdownTimer.tsx   시험 타이머
│   │   ├── Header.tsx       #   네비게이션 헤더
│   │   ├── Notepad.tsx      #   사이드 메모장
│   │   └── SQLEditor.tsx    #   CodeMirror SQL 에디터
│   ├── contexts/
│   │   └── AuthContext.tsx  # 인증 상태 관리
│   ├── data/
│   │   └── mockExam.ts      # 목업 시험 데이터 (50문항)
│   ├── pages/               # 페이지 컴포넌트
│   │   ├── MainPage.tsx     #   랜딩 페이지
│   │   ├── DashboardPage.tsx    대시보드 (차트/통계)
│   │   ├── ExamListPage.tsx #   모의고사 목록
│   │   ├── ExamTakingPage.tsx   시험 응시 (A4 레이아웃)
│   │   ├── ExamResultPage.tsx   시험 결과
│   │   ├── SQLPracticeListPage.tsx  SQL 문제 목록
│   │   └── SQLPracticePage.tsx  SQL 실습 에디터
│   ├── types/
│   │   └── index.ts         # TypeScript 타입 정의
│   ├── utils/
│   │   └── eventLogger.ts   # 이벤트 로깅
│   ├── App.tsx              # 라우터 & AuthProvider
│   └── main.tsx             # 엔트리포인트
├── .github/workflows/
│   └── ci.yml               # GitHub Actions CI
├── eslint.config.js
├── .prettierrc
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## 시작하기

```bash
# 의존성 설치
cd SolSQLD
npm install

# 개발 서버 (http://localhost:3000)
npm run dev

# 코드 검사
npm run check        # format + lint + typecheck

# 빌드
npm run build
```

---

## CI/CD

GitHub Actions를 통해 `main`, `develop` 브랜치에 대해 자동 검사가 실행됩니다.

```
PR / Push → Prettier Check → ESLint → TypeScript Type Check
```

---

## 브랜치 전략

| 브랜치 | 용도 |
|--------|------|
| `main` | 안정 버전 (머지 후 배포 대상) |
| `develop` | 개발 통합 브랜치 |
| `feature/*` | 기능 개발 브랜치 |

---

## 라이선스

이 프로젝트는 학습 및 포트폴리오 목적으로 제작되었습니다.
