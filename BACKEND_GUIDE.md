# 🚀 ArogyaSagar - Spring Boot Backend Implementation Guide

This guide provides a step-by-step manual to build a production-grade backend for **ArogyaSagar** using **Spring Boot** and connect it to the React Frontend.

---

## 1️⃣ Industry-Standard Project Structure
Organize your Spring Boot project using a **Package-by-Feature** or **Layered Architecture**.

```text
com.arogyasagar.backend
├── config              # SecurityConfig, CorsConfig, SwaggerConfig
├── controller          # REST Controllers (Endpoints)
├── dto                 # Data Transfer Objects (Request/Response)
├── entity              # JPA Entities (Database Tables)
├── exception           # Global Exception Handling
├── repository          # Spring Data JPA Repositories
├── service             # Business Logic
│   ├── impl            # Service Implementations
└── utils               # JwtUtil, Constants
```

---

## 2️⃣ Database Schema (Entities)
You will need to create the following Entity classes (`@Entity`) in Spring Boot.

### A. User Entity
*   `Long id`
*   `String email` (Unique)
*   `String password` (BCrypt Encoded)
*   `String name`
*   `Role role` (enum: USER, ADMIN, DOCTOR)

### B. Product Entity
*   `Long id`
*   `String name`
*   `String description`
*   `Double price`
*   `String category`
*   `String image`
*   `List<String> benefits` (@ElementCollection)
*   `List<String> ingredients`

### C. Doctor Entity
*   `Long id`
*   `String name`
*   `String specialty`
*   `Double consultationFee`
*   `String bio`
*   `Boolean isAvailable`

### D. Appointment Entity
*   `Long id`
*   `User patient` (@ManyToOne)
*   `Doctor doctor` (@ManyToOne)
*   `LocalDateTime dateTime`
*   `String status` (SCHEDULED, COMPLETED, CANCELLED)
*   `String transcript` (Text from video call)

---

## 3️⃣ API Endpoints Specification (Controller Layer)

Here are the specific endpoints you need to create in your Controllers.

### 🔐 Authentication Module (`AuthController.java`)
| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/signup` | Register new user | `SignupRequest` (name, email, password) |
| POST | `/api/auth/login` | Login & get JWT | `LoginRequest` (email, password) |

### 🛍️ E-Commerce Module (`ProductController.java`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/products` | Get all products (support pagination) |
| GET | `/api/products/search?q={query}` | Search products (for autocomplete) |
| GET | `/api/products/{id}` | Get single product details |
| POST | `/api/products/{id}/reviews` | Add a review (Protected) |

### 👨‍⚕️ Consultation Module (`DoctorController.java` & `AppointmentController.java`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/doctors` | List all doctors |
| GET | `/api/doctors/{id}` | Get doctor details |
| POST | `/api/appointments` | Book appointment | `BookingRequest` (docId, date, time) |
| PUT | `/api/appointments/{id}/transcript` | Save AI Transcript after call | `TranscriptRequest` |

### 🤖 AI & Wellness Module (`WellnessController.java`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/ai/chat` | Send message to Gemini (Backend wrapper) |
| POST | `/api/ai/analyze-face` | Process image for Health Scan |

---

## 4️⃣ Connecting Frontend to Backend (Integration Steps)

### Step 1: Configure CORS in Spring Boot
In `config/CorsConfig.java`, allow your frontend URL.
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173", "https://your-vercel-app.vercel.app")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

### Step 2: Create API Utility in Frontend
Create a file `src/services/api.ts` in your React project to manage Axios calls.

```typescript
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
});

// Add JWT Token to requests
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export const fetchProducts = () => api.get('/products');
export const loginUser = (creds) => api.post('/auth/login', creds);
export const bookAppointment = (data) => api.post('/appointments', data);
// ... add other methods
```

### Step 3: Replace Mock Data
In `pages/Shop.tsx` or `context/AppContext.tsx`, replace the usage of `PRODUCTS` from `data.ts` with the API call.

**Example Change in `Shop.tsx`:**
```typescript
// OLD
// import { PRODUCTS } from '../data';
// const [products, setProducts] = useState(PRODUCTS);

// NEW
import { fetchProducts } from '../services/api';

useEffect(() => {
    fetchProducts()
        .then(response => setProducts(response.data))
        .catch(err => console.error(err));
}, []);
```

---

## 5️⃣ Advanced: Handling Video Call Signaling
For the Video Call to work with a real backend (not just peer-to-peer locally):
1.  **Backend:** Implement a **WebSocket Handler** (`/ws`) to relay WebRTC Offer/Answer/ICE Candidate signals between the Patient and Doctor.
2.  **Frontend:** Update `VideoCall.tsx` to connect to `ws://localhost:8080/ws` and listen for signaling events instead of just using local media streams.

## 6️⃣ Deployment
1.  **Database:** Provision a PostgreSQL database on **Supabase** or **AWS RDS**.
2.  **Backend:** Deploy the Spring Boot JAR to **Render**, **Railway**, or **AWS Elastic Beanstalk**.
3.  **Frontend:** Deploy to **Vercel** (see `vercel.json`).
