# Node.js 게임서버 입문 주차 개인 과제

1. **웹 프레임워크**: Node.js에서 가장 대표적인 웹 프레임워크인 **Express.js**를 사용합니다.
2. **패키지 매니저**: 빠른 설치 속도와 우수한 패키지 관리를 지원하는 **yarn** 패키지 매니저를 사용합니다.
3. **모듈 시스템**: 최신 JS 문법을 지원하는 **ES6** 모듈 시스템을 사용합니다.
4. **데이터베이스**: [**MongoDB Cloud**](https://www.mongodb.com/products/platform/cloud)에서 대여한 대표적인 NoSQL인 **MongoDB Atlas**을 사용합니다.
5. **ODM**: **MongoDB**의 데이터를 쉽게 읽고 쓰게 해주는 [**mongoose**](https://mongoosejs.com/docs/guide.html) **ODM**을 사용합니다.

## 🚩 필수 요구사항

- 캐릭터 생성 API : POST ✅
- 캐릭터 목록 조회 API : GET ✅
- 캐릭터 상세 조회 API : GET ✅
- 캐릭터 삭제 API : DELETE ✅
- 아이템 생성 API : POST ✅
- 아이템 목록 조회 API : GET ✅
- 아이템 상세 조회 API: GET ✅
- 아이템 수정 API : PATCH ✅

| 기능             | API URL                  | Method | request                                                                                   | response                                                                                                                                                                               | Response(error)                                                                                                                                                                                                                                                                                           |
| ---------------- | ------------------------ | ------ | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 캐릭터 생성      | /characters              | POST   | { "name": "청순한 붕어빵" }                                                               | { "message": "새로운 캐릭터 ‘청순한 붕어빵’을 생성하셨습니다!" "data": { "character_id": 1 } }                                                                                         | 400 Bad Request (이미 존재하는 이름) -> { "errorMessage": "이미 존재하는 이름입니다." } 400 Bad Request (입력 데이터 검증 실패) -> { "errorMessage": err.message } 500 Internal Server Error (서버 내부 에러 발생 시) -> { "errorMessage": "서버에서 에러가 발생하였습니다." }                            |
| 캐릭터 목록 조회 | /characters              | GET    | { }                                                                                       | [ { "character_id":1,"name":"청순한 붕어빵" },{ "character_id":2,"name":"방먼지" },{ "character_id":3,"name":"제이" },{ "character_id":4,"name":"쩡원" } ]                             |                                                                                                                                                                                                                                                                                                           |
| 캐릭터 상세 조회 | /characters/:characterId | GET    | { }                                                                                       | { "data": { "name":"청순한 붕어빵","health":500,"power":100 } }                                                                                                                        | 404 Not Found (character\*id에 해당하는 캐릭터가 존재하지 않을 때) -> { "errorMessage": "캐릭터 조회에 실패하였습니다." }                                                                                                                                                                                 |
| 캐릭터 삭제      | /characters/:characterId | DELETE | { }                                                                                       | { "message": "캐릭터 ‘청순한 붕어빵’을 삭제하였습니다." }                                                                                                                              | 404 Not Found (character_id에 해당하는 캐릭터가 존재하지 않을 때) -> { "errorMessage": "캐릭터 조회에 실패하였습니다." }                                                                                                                                                                                  |
| 아이템 생성      | /items                   | POST   | { "item_code": 3, "item_name": "파멸의 반지", "item_stat": { "health": 20, "power": 2 } } | { message: "아이템이 생성되었습니다." }                                                                                                                                                | 400 Bad Request (입력 데이터 검증 실패) -> { "message": "입력 데이터가 유효하지 않습니다." } 400 Bad Request (입력 데이터 검증 실패) -> { "errorMessage": err.message } 500 Internal Server Error (서버 내부 에러 발생 시) -> { "errorMessage": "서버에서 에러가 발생하였습니다." }                       |
| 아이템 목록 조회 | /items                   | GET    | { }                                                                                       | [ { "item_code":1,"item_name":"근육파괴술" },{ "item_code":2,"item_name":"잠좀자자" },{ "item_code":3,"item_name":"파멸의 반지*리뉴얼" },{ "item_code":4,"item_name":"레전드 망토" } ] |                                                                                                                                                                                                                                                                                                           |
| 아이템 상세 조회 | /itmes/:itmeId           | GET    | { }                                                                                       | { "item_code":1,"item_name":"근육파괴술","item_stat":{ "health":5,"power":300 } }                                                                                                      | 404 Not Found (item_code에 해당하는 아이템이 존재하지 않을 때) -> { "errorMessage": "아이템 조회에 실패하였습니다." }                                                                                                                                                                                     |
| 아이템 수정      | /itmes/:itmeId           | PATCH  | { "item_code":3,"item_name":"파멸의 반지 리뉴얼","item_stat":{ "health":30 } }            | { message: "아이템이 성공적으로 업데이트되었습니다." }                                                                                                                                 | 404 Not Found (item_code에 해당하는 아이템이 존재하지 않을 때) -> { "errorMessage": "아이템을 찾을 수 없습니다." } 400 Bad Request (입력 데이터 검증 실패) -> { "errorMessage": err.message } 500 Internal Server Error (서버 내부 에러 발생 시) -> { "errorMessage": "서버에서 에러가 발생하였습니다." } |

## 🖊️ 프로젝트 회고

### 1️⃣ 수정 및 삭제 API에서 Resource를 구분하기 위해서 어떤 방식으로 요청(Request) 하셨나요? (param, query, body)

리소스를 구분하기 위해 **경로 변수 (Path Variables)** 방식을 사용하였습니다.

#### 캐릭터 삭제 API :

```javascript
router.delete("/characters/:characterId", async (req, res) => {
  const { characterId } = req.params;
  // 여기서 characterId를 경로 변수로 받아 사용
  ...
});
```

#### 아이템 수정 API :

```javascript
router.patch("/items/:itemId", async (req, res, next) => {
  const { itemId } = req.params;
  // 여기서 itemId를 경로 변수로 받아 사용
  ...
});
```

### 2️⃣ API 설계 시 RESTful한 원칙을 따랐나요? 어떤 부분이 RESTful한 설계를 반영하였고, 어떤 부분이 그렇지 않았나요?

#### 1. 자원 기반 URL 설계:

각 API는 자원을 중심으로 구성된 경로를 사용합니다. 예를 들어, /characters와 /items는 각각 캐릭터와 아이템 리소스를 나타냅니다.
경로 변수를 사용하여 특정 자원을 식별합니다 (/characters/:characterId, /items/:itemId).

#### 2. 표준 HTTP 메소드 사용:

CRUD 작업에 대한 표준 HTTP 메소드를 적절히 사용합니다. GET은 데이터 조회, POST는 데이터 생성, DELETE는 데이터 삭제, PATCH는 데이터 수정에 사용됩니다.

#### 3. 상태 코드를 통한 의미 있는 응답:

각 API 응답에는 상황에 맞는 HTTP 상태 코드가 포함되어 있습니다. 예를 들어, 201 Created는 새로운 자원 생성을, 404 Not Found는 자원을 찾을 수 없음을, 200 OK는 요청 성공을 나타냅니다.

#### (아쉬운 부분) 1. 리소스 간의 관계 표현:

현재 API는 리소스 간의 관계를 명확히 표현하지 않고 있습니다. 예를 들어, 캐릭터가 아이템을 소유하고 있다면, 이를 반영한 URL을 설계할 수 있습니다 (예: /characters/:characterId/items)  
이 부분은 도전 요구 사항: 캐릭터에 아이템 실제로 탈/장착해보기!에서 구현할 수 있을 것 같습니다.

### 3️⃣ 폴더 구조(Directory Structure)를 역할 별로 분리하였다면, 어떤 이점을 가져다 주었을까요?

#### 모듈성

- 각 컴포넌트가 독립적으로 분리되어 있어, 각 부분이 명확한 역할과 책임을 갖습니다.

#### 유지보수성

- 각 컴포넌트가 분리되어 있어, 특정 기능에 문제가 생겼을 때 해당 부분만을 수정할 수 있습니다.

#### 확장성

- 새로운 기능을 추가하거나 기존 기능을 확장할 때, 기존 코드에 큰 영향을 주지 않고 변경할 수 있습니다.

#### 보안

- .env 파일을 사용하여 중요한 설정 값을 안전하게 보호하고, .gitignore를 통해 민감한 정보가 외부에 노출되지 않도록 관리할 수 있습니다.
