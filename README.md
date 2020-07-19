# ESRUOC
기존의 <b>Course</b>를 뒤집을 수 있는, 새로운 콘텐츠 플랫폼 <b>Esruoc</b>

<br>

## 프로젝트 구조

프로젝트는 구조는 아래의 구조로 되어 있습니다.

```
.
├── README.md
├── client
│   └── package.json
├── package.json
├── server
│   └── package.json
└── shared
    └── package.json
```

3개의 모듈로 이루어져 있으며, 각각의 모듈의 종속성을 추가하려면 터미널에 아래의 명령어를 입력하여 추가합니다.

```bash
$ yarn workspace shared|client|server add library-name # 뒤부터는 yarn add 뒤와 같음
```

<br>

## 클라이언트 프로젝트 실행하는 방법

```bash
cd client
yarn dev
```

<br>

## 백엔드 프로젝트 실행하는 방법

프로젝트를 실행하기 위해서는 credential 파일과 환경변수가 필요합니다.

```bash
docker-compose -f ./docker-compose-local.yaml up
```

