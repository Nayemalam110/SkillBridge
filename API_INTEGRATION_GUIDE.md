# SkillBridge Frontend API Integration Guide

## Overview

The frontend is now fully integrated with the SkillBridge backend APIs running on `http://localhost:3000/api/v1`. All API calls include automatic token management, request/response handling, and error management.

## 📁 API Structure

The API layer is organized in `/src/api/` with the following modules:

### Core Modules

1. **`client.ts`** - Axios client with interceptors
   - Base URL: `http://localhost:3000/api/v1`
   - Automatic token injection in Authorization header
   - Automatic token refresh on 401 responses
   - Token storage in localStorage

2. **`auth.ts`** - Authentication API
   - `login(email, password)` - Login user
   - `register(name, email, password)` - Register new account
   - `getCurrentUser()` - Fetch logged-in user
   - `logout()` - Logout and clear tokens
   - `refreshToken(refreshToken)` - Refresh access token
   - `updateProfile(data)` - Update user profile
   - `uploadCV(file)` - Upload CV file

3. **`jobs.ts`** - Job Management API
   - `list(params)` - List all jobs with filtering/pagination
   - `get(id)` - Get single job details
   - `create(data)` - Create new job (admin only)
   - `update(id, data)` - Update job (admin only)
   - `delete(id)` - Delete job (admin only)

4. **`stacks.ts`** - Tech Stack API
   - `list(params)` - List all tech stacks
   - `get(id)` - Get stack details
   - `create(data)` - Create new stack (admin only)
   - `update(id, data)` - Update stack (admin only)
   - `delete(id)` - Delete stack (admin only)

5. **`applications.ts`** - Application Management API
   - `list(params)` - List applications
   - `get(id)` - Get application details
   - `submit(data)` - Submit job application with CV
   - `updateStatus(id, status)` - Change application status (admin)
   - `rateApplication(id, rating)` - Rate application (admin)
   - `exportCSV(params)` - Export applications as CSV
   - `exportExcel(params)` - Export applications as Excel

6. **`users.ts`** - User Profile API
   - `getProfile()` - Get current user profile
   - `updateProfile(data)` - Update profile info
   - `uploadCV(file)` - Upload/update CV
   - `blockUser(userId)` - Block user (admin)
   - `unblockUser(userId)` - Unblock user (admin)
   - `getBlockedUsers()` - List blocked users (admin)

7. **`tasks.ts`** - Task Management API
   - `get(taskId)` - Get task details
   - `assign(applicationId, data)` - Assign task to application (admin)
   - `submit(taskId, data)` - Submit task solution
   - `review(taskId, status)` - Review and approve/reject task (admin)

8. **`admins.ts`** - Admin Management API
   - `list()` - List all admins (super admin)
   - `get(id)` - Get admin details
   - `invite(data)` - Invite new admin (super admin)
   - `acceptInvite(data)` - Accept admin invitation
   - `updatePermissions(id, data)` - Update admin permissions (super admin)
   - `delete(id)` - Remove admin (super admin)
   - `cancelInvite(id)` - Cancel pending invitation

9. **`settings.ts`** - Site Settings API
   - `get()` - Get site settings
   - `update(data)` - Update site settings (admin)

10. **`dashboard.ts`** - Dashboard API
    - `getSeekerDashboard()` - Get job seeker dashboard
    - `getAdminDashboard()` - Get admin dashboard

## 🔐 Authentication & Token Management

### How It Works

1. **Token Storage**
   ```typescript
   localStorage.setItem('access_token', token);     // 1-hour expiry
   localStorage.setItem('refresh_token', token);    // 7-day expiry
   ```

2. **Request Interceptor**
   - Automatically adds `Authorization: Bearer <token>` to all requests
   - Injected via Axios request interceptor in `client.ts`

3. **Response Interceptor**
   - On 401 response, automatically attempts token refresh
   - If refresh succeeds, retries original request with new token
   - If refresh fails, clears tokens and redirects to `/login`

4. **Token Injection During Login/Register**
   ```typescript
   const response = await authAPI.login(email, password);
   // Tokens automatically stored in localStorage
   // AuthContext automatically updates user state
   ```

### Using Auth in Components

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password123');
      // User is now logged in
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

## 📝 Usage Examples

### Example 1: Login and Fetch Dashboard

```typescript
import { useAuth, dashboardAPI } from '@/api';

function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'job_seeker') {
      dashboardAPI.getSeekerDashboard().then((response) => {
        setDashboardData(response.data);
      });
    }
  }, [isAuthenticated, user]);

  return <div>{dashboardData && <p>Applications: {dashboardData.stats.totalApplications}</p>}</div>;
}
```

### Example 2: List and Filter Jobs

```typescript
import { jobsAPI } from '@/api';

function JobsList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    jobsAPI
      .list({
        page: 1,
        limit: 10,
        stackId: 'react-stack-id',
        experienceLevel: 'mid',
      })
      .then((response) => {
        setJobs(response.data);
      });
  }, []);

  return (
    <ul>
      {jobs.map((job) => (
        <li key={job.id}>{job.title}</li>
      ))}
    </ul>
  );
}
```

### Example 3: Submit Job Application

```typescript
import { applicationsAPI } from '@/api';

function ApplicationForm({ jobId }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const cvFile = document.querySelector('#cv-input').files[0];

    try {
      const response = await applicationsAPI.submit({
        jobId,
        coverLetter: 'I am interested in this position...',
        cv: cvFile,
      });
      alert('Application submitted successfully!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea placeholder="Cover letter..." />
      <input id="cv-input" type="file" accept=".pdf,.doc,.docx" />
      <button type="submit">Submit Application</button>
    </form>
  );
}
```

### Example 4: Update User Profile

```typescript
import { usersAPI } from '@/api';

function ProfileEditor() {
  const handleSave = async (profileData) => {
    try {
      const response = await usersAPI.updateProfile({
        name: profileData.name,
        skills: profileData.skills,
        bio: profileData.bio,
      });
      alert('Profile updated!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return <form onSubmit={() => handleSave({/* ... */})} />;
}
```

### Example 5: Upload File

```typescript
import { authAPI, usersAPI } from '@/api';

function CVUpload() {
  const handleUploadCV = async (e) => {
    const file = e.target.files[0];
    try {
      const response = await usersAPI.uploadCV(file);
      console.log('CV uploaded:', response.data.cvUrl);
    } catch (error) {
      alert(`Upload failed: ${error.message}`);
    }
  };

  return <input type="file" onChange={handleUploadCV} accept=".pdf,.doc,.docx" />;
}
```

## 🎯 API Response Format

All API responses follow a consistent format:

### Success Response (200-201)
```json
{
  "success": true,
  "data": {
    // Actual data here
  },
  "meta": {
    "currentPage": 1,
    "totalPages": 10,
    "totalCount": 100,
    "pageSize": 10
  }
}
```

### Error Response (4xx-5xx)
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## 🛡️ Error Handling

### Automatic Error Handling
```typescript
try {
  const response = await jobsAPI.list();
  console.log(response.data);
} catch (error) {
  if (error.response?.status === 401) {
    // Token expired and refresh failed - redirected to login
  } else if (error.response?.status === 403) {
    // Permission denied
  } else if (error.response?.status === 404) {
    // Resource not found
  } else {
    // Network or other error
  }
}
```

### Manual Error Details
```typescript
try {
  await jobsAPI.get('invalid-id');
} catch (error) {
  const errorResponse = error.response?.data;
  console.log(errorResponse.message);     // Error message
  console.log(errorResponse.code);        // Error code
}
```

## 📋 Test Credentials

Use these credentials to test API integration:

| Role | Email | Password |
|------|-------|----------|
| Job Seeker | john@example.com | Seeker123! |
| Stack Admin | react-admin@skillbridge.com | Admin123! |
| Super Admin | superadmin@skillbridge.com | Admin123! |

## 🚀 Starting Development

1. **Ensure Backend is Running**
   ```bash
   cd SkillBridge_backend_api
   npm run dev
   ```

2. **Start Frontend**
   ```bash
   cd SkillBridge_frontend
   npm run dev
   ```

3. **Frontend should be at** `http://localhost:5173`

4. **Backend API at** `http://localhost:3000/api/v1`

## 🧪 Testing API Calls

### Option 1: Use Browser Console
```typescript
// Open browser DevTools > Console
// Try login
const loginRes = await fetch('http://localhost:3000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'john@example.com', password: 'Seeker123!' })
});
console.log(await loginRes.json());
```

### Option 2: Use Postman
Import the Postman collection from `SkillBridge_backend_api/SkillBridge-API-Collection.postman_collection.json`

### Option 3: Direct Component Testing
Add API calls in any component and check browser DevTools Network tab

## 📊 Common API Patterns

### Pagination
```typescript
const response = await jobsAPI.list({
  page: 2,
  limit: 20,
});
// response.meta contains pagination info
```

### Filtering
```typescript
const response = await applicationsAPI.list({
  status: 'submitted',
  jobId: 'specific-job-id',
  userId: 'specific-user-id',
});
```

### Search
```typescript
const response = await jobsAPI.list({
  search: 'react developer',
});
```

### File Upload
```typescript
const file = document.querySelector('input[type="file"]').files[0];
const response = await usersAPI.uploadCV(file);
```

### Export Data
```typescript
const csvBlob = await applicationsAPI.exportCSV({ status: 'hired' });
const link = document.createElement('a');
link.href = URL.createObjectURL(csvBlob);
link.download = 'applications.csv';
link.click();
```

## 🔧 Configuration

### Change API Base URL
Edit `/src/api/client.ts`:
```typescript
const API_BASE_URL = 'http://your-server:3000/api/v1';
```

### Change Token Storage
Modify localStorage keys in `client.ts` interceptor:
```typescript
const token = localStorage.getItem('your_token_key');
```

## 📚 API Documentation

For detailed endpoint specifications, see:
- Backend: `/SkillBridge_backend_api/EXPRESS_API_SPECIFICATION.md`
- Postman: `/SkillBridge_backend_api/POSTMAN_GUIDE.md`

## ✅ Integration Checklist

- [x] API client with Axios configured
- [x] Token management (storage & refresh)
- [x] Auth API with login/register/logout
- [x] Jobs API with CRUD operations
- [x] Stacks API with CRUD operations
- [x] Applications API with submission & management
- [x] Users API with profile management
- [x] Tasks API with assignment & review
- [x] Admins API with management
- [x] Settings API
- [x] Dashboard API
- [x] AuthContext with real API calls
- [x] Error handling & interceptors
- [x] TypeScript types for all APIs
- [x] Frontend build successful

## 🚀 Next Steps

1. **Connect Login Page** - Use `authAPI.login()` in LoginPage component
2. **Connect Dashboard** - Use `dashboardAPI.getSeekerDashboard()` in Dashboard
3. **Connect Jobs List** - Use `jobsAPI.list()` in JobsPage
4. **Connect Application Form** - Use `applicationsAPI.submit()` in application component
5. **Add Redux Integration** - Dispatch API data to Redux store for state management

---

**Happy Coding! 🎉**
