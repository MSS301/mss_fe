# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

---

## Hướng dẫn nhanh: Đăng nhập (Auth)

Ứng dụng front-end đã được bổ sung một giao diện đăng nhập đơn giản để gọi API xác thực hiện có.

- Endpoint: POST http://localhost:8080/auth-service/auth/token
- Payload JSON: { "username": "email", "password": "password" }
- Kết quả mong đợi: { code: 1000, result: { token: "..." } }

Hướng dẫn chạy:

1. Cài đặt phụ thuộc:

```powershell
npm install
```

2. Chạy dev server:

```powershell
npm start
```

3. Mở http://localhost:3000 và đăng nhập bằng tài khoản demo hoặc tài khoản thật nếu backend đang chạy.

Lưu ý: token được lưu trong localStorage với key `token`.

---

## Cấu trúc thư mục (TypeScript)

Dự án đã được refactor sang **TypeScript** với cấu trúc thư mục chuẩn:

```
src/
├── api/              # API services (auth.ts)
├── components/       # React components (Login.tsx, Dashboard.tsx)
├── css/              # Stylesheets (login.css)
├── assets/           # Static assets (images, fonts, etc.) - tạo khi cần
├── contexts/         # React contexts - tạo khi cần
├── hooks/            # Custom hooks - tạo khi cần
├── router/           # Routing configuration - tạo khi cần
├── types/            # TypeScript type definitions - tạo khi cần
├── utils/            # Utility functions - tạo khi cần
├── App.tsx           # Main App component
├── index.tsx         # Entry point
└── reportWebVitals.ts
```

### Các file chính:

- `src/api/auth.ts` - Authentication service (login API call)
- `src/components/Login.tsx` - Login form component
- `src/components/Dashboard.tsx` - Dashboard placeholder
- `src/App.tsx` - Main app with auth state management
- `tsconfig.json` - TypeScript configuration

---

## 🎨 Giao diện UI/UX

Hệ thống đã được thiết kế hoàn toàn mới với:

### Design System

- **CSS Variables** cho theming và customization dễ dàng
- **Responsive Design** hoạt động tốt trên mobile, tablet, desktop
- **Modern Components** với animations và transitions mượt mà
- **Dark Mode Ready** (có thể bật bằng data-theme="dark")

### Các trang đã implement:

1. **Login Page**

   - Gradient background với animation
   - Form validation real-time
   - Loading states và error handling
   - Demo credentials sẵn có

2. **Dashboard**

   - Statistics cards với số liệu tổng quan
   - Quick actions cho các tác vụ phổ biến
   - Recent slides và activity feed
   - Wallet balance display

3. **Layout với Sidebar**

   - Sidebar navigation cố định với nhóm menu rõ ràng
   - Header với search, notifications, user menu
   - Breadcrumb navigation
   - Mobile-responsive với hamburger menu

4. **Curriculum Browser**
   - 3-step wizard: Chọn môn → Chọn lớp → Chọn chủ đề
   - Visual cards với icons và colors
   - Smooth transitions giữa các bước

### Components có sẵn:

- Buttons (primary, secondary, outline, ghost)
- Cards với header/body/footer
- Inputs với focus states
- Badges cho status
- Modal overlays
- Toast notifications
- Loading spinners
- Avatars

### Color Palette:

- Primary: #4F46E5 (Indigo)
- Secondary: #10B981 (Green)
- Success: #10B981
- Warning: #F59E0B
- Error: #EF4444
- Info: #3B82F6

---

## 📁 Cấu trúc mới

```
src/
├── styles/           # Design system
│   ├── variables.css # CSS variables
│   ├── global.css    # Global styles & utilities
│   └── components.css # Reusable component styles
├── components/       # React components
│   ├── Layout.tsx/css # Main layout với sidebar
│   ├── Login.tsx     # Login component
│   └── Dashboard.tsx # Dashboard component
├── pages/            # Page-level components
│   ├── Dashboard.css # Dashboard styles
│   ├── Curriculum.tsx/css # Curriculum browser
│   └── ...
└── ...
```

### Tiếp theo cần làm:

- ✅ Design System & Layout
- ✅ Login & Dashboard UI
- ✅ Curriculum Browser
- ⏳ Slide Creation Wizard (multi-step form)
- ⏳ My Slides Page (grid/list view, filters)
- ⏳ Wallet & Payment UI
- ⏳ Notifications Center
- ⏳ User Profile & Settings
- ⏳ React Router integration
- ⏳ AuthContext & Protected Routes
