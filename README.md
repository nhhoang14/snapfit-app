# SnapFit – Fashion & AR Virtual Try‑On Backend

## 🎯 Project Goal
SnapFit is a **fashion‑tech platform** that lets users:
- Upload photos of their clothes (or marketplace items) and have the background automatically removed.
- Organise a personal **digital closet** with tags such as *Owned*, *Wishlist*, *Planned*.
- **Style outfits** by dragging items onto a canvas, positioning, scaling and rotating them.
- **Try on** outfits in real‑time using the mobile AR camera (later integration with a Python AI service).
- Browse other users’ closets, copy outfits, and **offer/pass** garments to each other.

The backend is a **RESTful API** built with **Spring Boot 4.1.1**, **Java 25**, **PostgreSQL**, and **JWT‑based security**.

---

## 🏗️ Architecture Overview
```
snapfit-app/
├─ backend/                     # Spring Boot REST API (Java)
│   ├─ src/main/java/           # Application code
│   │   ├─ com.snapfit/         # Core package
│   │   │   ├─ SnapFitApplication.java
│   │   │   ├─ common/          # ApiResponse, exception handling, config
│   │   │   ├─ storage/         # Local file‑storage implementation
│   │   │   ├─ user/            # Auth, user profile, JWT utils
│   │   │   ├─ clothing/        # Closet entity & CRUD
│   │   │   ├─ outfit/          # Outfit & canvas data
│   │   │   └─ pass/            # Marketplace pass‑offer logic
│   ├─ src/main/resources/      # configuration (application.yml, pom.xml)
│   └─ src/test/java/…          # unit / integration tests
├─ mobile/                      # React Native + TypeScript (iOS / Android)
│   └─ …                        # UI, AR camera, styling canvas
└─ README.md                    # Quick start for the whole repo
```

### Backend Modules
| Module | Responsibility |
|--------|-----------------|
| **Auth** | Register / login, JWT generation, Spring Security filter |
| **User** | Profile & optional body‑measurements |
| **Clothing** | CRUD for closet items, image upload, background‑removal hook |
| **Outfit** | Save outfits, store per‑item canvas metadata (position, scale, rotation) |
| **Pass** | Marketplace‑style offer to transfer a garment between users |
| **Storage** | Local disk storage (`uploads/`) – can be swapped for S3 later |
| **AI Integration (future)** | Calls a Python FastAPI service for background removal / virtual try‑on |

---

## 🛠️ Tech Stack
| Layer | Technology |
|-------|------------|
| **Backend** | Spring Boot 4.1.1, Java 25, Maven, Spring Data JPA, Spring Security, JWT (`io.jsonwebtoken`), Lombok |
| **Database** | PostgreSQL 15 (local), Hibernate ORM |
| **Configuration** | `application.yml` (datasource, JPA, multipart limits, custom `app.*` settings) |
| **Testing** | JUnit 5, Spring Boot Test, MockMvc |
| **Documentation** | Swagger UI (`springdoc-openapi`) – reachable at `http://localhost:8080/api/swagger-ui.html` |
| **Mobile** | React Native, TypeScript, Vision Camera, Skia for real‑time overlay |
| **AI (future)** | Python FastAPI, PyTorch models for background removal & V‑Try‑On |

---

## 🚀 Local Development Setup
1. **Prerequisites**
   - JDK 21+ (you have Java 25 already)
   - Maven 3.9+
   - PostgreSQL 15 (running on `localhost:5432` with database `snapfit`)
   - Node 20+ (for the mobile app later)
2. **Create the database**
   ```bash
   createdb -U postgres snapfit
   ```
3. **Clone the repo** (you already are inside `~/snapfit-app`).
4. **Backend**
   ```bash
   cd backend
   # Install dependencies & compile
   mvn clean install
   # Run the API
   mvn spring-boot:run
   ```
   The service will start at **http://localhost:8080/api**.
5. **Swagger UI**
   Open `http://localhost:8080/api/swagger-ui.html` to explore all endpoints.
6. **Mobile (later)**
   ```bash
   cd ../mobile
   npm install
   npx expo start   # or react-native run‑ios / run‑android
   ```
   The mobile app will call the backend APIs using the JWT token returned by `/auth/login`.

---

## 📦 API Overview (selected endpoints)
| Path | Method | Description |
|------|--------|-------------|
| `/auth/register` | `POST` | Register a new user (email, displayName, password). Returns a JWT. |
| `/auth/login` | `POST` | Login and receive a JWT. |
| `/clothing` | `GET` | List all clothing items of the authenticated user. |
| `/clothing` | `POST` | Upload a new garment (multipart file + metadata). |
| `/outfit` | `POST` | Create a new outfit (canvas layout JSON). |
| `/outfit/{id}` | `GET` | Retrieve a saved outfit with its items and layout data. |
| `/pass/offer` | `POST` | Create a pass‑offer for a public garment. |
| `/pass/{id}/accept` | `POST` | Accept an incoming offer – ownership of the item transfers. |

Full specs are available in Swagger UI.

---

## 📁 Repository Layout (important files)
- `backend/pom.xml` – Maven build file (Spring Boot 4.1.1, dependencies, compiler plugin)
- `backend/src/main/resources/application.yml` – runtime configuration (datasource, JWT secret placeholder, upload dir, AI service URL)
- `backend/src/main/java/com/snapfit/common/ApiResponse.java` – unified JSON response wrapper
- `backend/src/main/java/com/snapfit/common/GlobalExceptionHandler.java` – global error handling
- `backend/src/main/java/com/snapfit/common/config/JwtUtil.java` – JWT creation/validation
- `backend/src/main/java/com/snapfit/storage/LocalFileStorageServiceImpl.java` – stores uploaded images under `./uploads`
- `mobile/` – React‑Native project (still under construction)
- `README.md` – brief high‑level introduction (the file you are reading now)

---

## 🧪 Testing
Run unit and integration tests with:
```bash
mvn test
```
The test suite currently contains a starter SpringBoot test class (`SnapfitBackendApplicationTests`). Add more tests as you implement new features.

---

## 📚 Further Reading / Next Steps
1. **Implement the AI micro‑service** (background removal, V‑Try‑On) and integrate it via `RestTemplate`/`WebClient`.
2. **Add role‑based access** (admin vs regular user) in Spring Security.
3. **Migrate storage** to a cloud bucket (AWS S3, Google Cloud Storage) – abstract the `FileStorageService`.
4. **Expand mobile UI** – real‑time pose detection, garment warping, physics‑based interactions.
5. **CI/CD** – GitHub Actions to run `mvn verify` on each PR and Dockerize the backend.

---

## 📜 License
This project is open‑source under the **Apache 2.0** license.

---

*Created by the Antigravity AI assistant to help you get a clear project overview.*
