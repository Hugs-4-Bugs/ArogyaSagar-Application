# 🛠 Technology Stack Documentation - ArogyaSagar

## 🎨 Frontend (Current Implementation)
The frontend is built as a highly responsive, animated Single Page Application (SPA).

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | **React 18** | Component-based UI architecture. |
| **Language** | **TypeScript** | Type safety, interfaces, and scalable code. |
| **Build Tool** | **Vite** | Fast bundling and development server. |
| **Styling** | **Tailwind CSS** | Utility-first styling for rapid UI development. |
| **Routing** | **React Router DOM v6** | Client-side routing (SPA). |
| **Animations** | **GSAP (GreenSock)** | Complex timeline animations (Hero section). |
| **Animations** | **Framer Motion** | UI transitions, modal effects, and gestures. |
| **Smooth Scroll** | **Lenis** | Premium smooth scrolling experience. |
| **Icons** | **Lucide React** | Modern, consistent icon set. |
| **AI Integration** | **Google Gemini API** | Chatbot logic and intelligent responses. |
| **Speech** | **Web Speech API** | Native browser API for Speech-to-Text and TTS. |
| **Video/Camera** | **WebRTC (MediaDevices)** | Accessing Camera/Mic for Video Calls and Scans. |
| **State Management** | **React Context API** | Managing User, Cart, and Appointment state. |

---

## ⚙️ Backend (Recommended for Spring Boot Implementation)
To build the industry-level backend as described in `BACKEND_GUIDE.md`, use the following stack:

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **Spring Boot 3.2+** | Rapid application development framework. |
| **Language** | **Java 17 or 21 (LTS)** | Core backend logic. |
| **Build Tool** | **Maven** or **Gradle** | Dependency management. |
| **Database** | **PostgreSQL** | Relational database for Users, Orders, Products. |
| **ORM** | **Spring Data JPA (Hibernate)** | Database interaction and entity mapping. |
| **Security** | **Spring Security + JWT** | Stateless authentication and authorization. |
| **API Documentation** | **Springdoc OpenAPI (Swagger)** | Auto-generated API docs. |
| **Real-time** | **Spring WebSocket (STOMP)** | For Chat and Signaling (Video Call). |
| **Storage** | **AWS S3** or **MinIO** | Storing product images and doctor profiles. |
| **Payment** | **Stripe** or **Razorpay SDK** | Handling payments. |
| **Validation** | **Hibernate Validator** | Input validation (Email, Password strength). |
