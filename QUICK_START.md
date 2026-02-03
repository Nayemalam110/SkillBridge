# 🚀 Quick Start Commands

## Starting Development

### Terminal 1: Backend API
```bash
cd SkillBridge_backend_api
npm run dev
# Runs on http://localhost:3000
```

### Terminal 2: Frontend
```bash
cd SkillBridge_frontend
npm run dev
# Runs on http://localhost:5173
```

## Verify Everything is Working

### Check Backend Health
```bash
curl http://localhost:3000/health
```

### Check Frontend Builds
```bash
cd SkillBridge_frontend
npm run build
```

### Test API Integration (in browser console)
1. Open `http://localhost:5173` in browser
2. Open DevTools Console (F12 > Console)
3. Paste the test file code:
   ```javascript
   // Copy entire contents of API_INTEGRATION_TEST.js
   // Then run:
   window.skillBridgeTest.runAllTests()
   ```

## Common Debugging Commands

### Check if backend is running
```bash
lsof -i :3000
```

### Kill backend process if stuck
```bash
pkill -f "ts-node\|node"
```

### Check frontend build output
```bash
cd SkillBridge_frontend
npm run build 2>&1 | tail -20
```

### Clear npm cache
```bash
npm cache clean --force
```

### Reinstall dependencies
```bash
cd SkillBridge_frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## API Testing

### Login (get token)
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Seeker123!"}'
```

### Get Current User (requires token)
```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### List Jobs (no auth needed)
```bash
curl http://localhost:3000/api/v1/jobs | jq .
```

### List Stacks (no auth needed)
```bash
curl http://localhost:3000/api/v1/stacks | jq .
```

## Import Postman Collection

1. Open Postman
2. Click **Import**
3. Select `SkillBridge_backend_api/SkillBridge-API-Collection.postman_collection.json`
4. Also import `SkillBridge_backend_api/SkillBridge-Environment.postman_environment.json`
5. Select "SkillBridge Development Environment"
6. Run **Login** request to auto-save token
7. Run any other request (tokens auto-injected)

## Test Credentials

- **Job Seeker**: john@example.com / Seeker123!
- **Stack Admin**: react-admin@skillbridge.com / Admin123!
- **Super Admin**: superadmin@skillbridge.com / Admin123!

## File Locations

- **Backend API**: `/Users/softvence/Documents/SkillBridget/SkillBridge_backend_api`
- **Frontend**: `/Users/softvence/Documents/SkillBridget/SkillBridge_frontend`
- **API Docs**: `/SkillBridge_frontend/API_INTEGRATION_GUIDE.md`
- **Integration Summary**: `/SkillBridge_frontend/INTEGRATION_SUMMARY.md`
- **Test Script**: `/SkillBridge_frontend/API_INTEGRATION_TEST.js`
- **Postman Collection**: `/SkillBridge_backend_api/SkillBridge-API-Collection.postman_collection.json`

## Ports

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Base URL: http://localhost:3000/api/v1

## Documentation Files

1. **API_INTEGRATION_GUIDE.md** - Comprehensive guide with examples
2. **INTEGRATION_SUMMARY.md** - Complete integration summary
3. **QUICK_START.md** - This file
4. **POSTMAN_GUIDE.md** (Backend) - Postman collection guide

## VS Code Extensions (Optional)

- Thunder Client - API testing in VS Code
- REST Client - Send HTTP requests from .rest files
- Postman - Use Postman extension in VS Code

## Common Issues & Solutions

### Issue: Cannot POST /api/v1/auth/login
**Solution**: Make sure backend is running on port 3000
```bash
lsof -i :3000  # Check what's on port 3000
npm run dev    # Start backend
```

### Issue: 401 Unauthorized errors in frontend
**Solution**: Token may have expired or not stored properly
```javascript
// Check in browser console
localStorage.getItem('access_token')
localStorage.getItem('refresh_token')
```

### Issue: CORS errors
**Solution**: Backend CORS is configured for http://localhost:5173
- Make sure frontend is on correct port
- Check backend has CORS enabled for http://localhost:5173

### Issue: Cannot find module errors
**Solution**: Install dependencies
```bash
npm install
```

### Issue: Build fails with TypeScript errors
**Solution**: Check for type errors
```bash
npm run build
# Fix any TypeScript errors shown
```

## Useful npm Scripts

```bash
# Frontend
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Lint code (if configured)

# Backend
npm run dev       # Start backend with hot reload
npm run build     # Compile TypeScript
npm run seed      # Seed database with test data
npm run test      # Run tests (if configured)
```

## Next Development Steps

1. ✅ Backend API running and tested
2. ✅ Frontend API layer integrated
3. ⬜ Connect UI components to API
4. ⬜ Implement login flow in LoginPage
5. ⬜ Implement dashboard in Dashboard component
6. ⬜ Implement jobs listing in JobsPage
7. ⬜ Implement application submission form
8. ⬜ Implement admin features
9. ⬜ Add Redux state management
10. ⬜ Testing and deployment

---

**Need Help?** Check the detailed guides:
- `API_INTEGRATION_GUIDE.md` - Examples and patterns
- `INTEGRATION_SUMMARY.md` - Complete feature list
