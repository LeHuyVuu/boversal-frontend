# Backend Authentication với Cookie - Best Practices

## 🔐 Cấu hình Cookie An toàn

### ASP.NET Core Implementation

```csharp
// Program.cs hoặc Startup.cs
services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "AuthToken";
        options.Cookie.HttpOnly = true;        // Ngăn JavaScript đọc cookie
        options.Cookie.Secure = true;          // Chỉ gửi qua HTTPS
        options.Cookie.SameSite = SameSiteMode.Strict; // CSRF protection
        options.Cookie.MaxAge = TimeSpan.FromDays(7);
        options.ExpireTimeSpan = TimeSpan.FromDays(7);
        options.SlidingExpiration = true;      // Tự động gia hạn
    });

// CORS Configuration
services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:3000", "https://yourdomain.com")
               .AllowCredentials()  // ✅ QUAN TRỌNG: Cho phép gửi cookie
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});
```

### Login Controller Example

```csharp
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequest request)
{
    // Xác thực user
    var user = await _userService.ValidateCredentials(request.Email, request.Password);
    if (user == null)
        return Unauthorized(new { success = false, message = "Invalid credentials" });

    // Tạo claims
    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role)
    };

    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
    var authProperties = new AuthenticationProperties
    {
        IsPersistent = request.RememberMe,
        ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7)
    };

    await HttpContext.SignInAsync(
        CookieAuthenticationDefaults.AuthenticationScheme,
        new ClaimsPrincipal(claimsIdentity),
        authProperties
    );

    return Ok(new 
    { 
        success = true, 
        message = "Đăng nhập thành công",
        data = new { userId = user.Id, email = user.Email }
    });
}
```

## 🛡️ Security Best Practices

### 1. Cookie Attributes
- **HttpOnly**: Ngăn XSS attacks - JavaScript không thể đọc cookie
- **Secure**: Chỉ gửi cookie qua HTTPS trong production
- **SameSite=Strict**: Ngăn CSRF attacks - cookie chỉ gửi từ cùng domain
- **MaxAge/Expires**: Giới hạn thời gian sống của cookie

### 2. HTTPS Required in Production
```csharp
// appsettings.Production.json
{
  "Kestrel": {
    "Endpoints": {
      "Https": {
        "Url": "https://localhost:5001"
      }
    }
  }
}
```

### 3. CORS Configuration
```csharp
// ❌ KHÔNG BAO GIỜ làm thế này trong production
builder.WithOrigins("*").AllowCredentials(); // LỖI!

// ✅ ĐÚNG: Chỉ định rõ domain được phép
builder.WithOrigins("https://yourdomain.com").AllowCredentials();
```

## 🔄 Frontend Integration

### Fetch API với credentials
```typescript
// lib/api-client.ts đã implement
fetch(url, {
  credentials: 'include', // ✅ Gửi cookie mỗi request
  headers: {
    'Content-Type': 'application/json'
  }
});
```

### Axios Alternative
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:44318/api',
  withCredentials: true, // ✅ Tương đương credentials: 'include'
});
```

## 📋 Environment Variables

### Backend (.NET)
```json
// appsettings.json
{
  "Authentication": {
    "CookieName": "AuthToken",
    "CookieExpireDays": 7,
    "CorsOrigins": "http://localhost:3000;https://yourdomain.com"
  }
}
```

### Frontend (Next.js)
```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://localhost:44318/api
```

## 🧪 Testing Cookie Authentication

### Local Development (HTTP)
```csharp
// Chỉ trong Development
if (app.Environment.IsDevelopment())
{
    options.Cookie.Secure = false; // Cho phép HTTP
    options.Cookie.SameSite = SameSiteMode.Lax; // Lỏng hơn cho testing
}
```

### Production (HTTPS)
```csharp
if (app.Environment.IsProduction())
{
    options.Cookie.Secure = true;           // Bắt buộc HTTPS
    options.Cookie.SameSite = SameSiteMode.Strict; // Bảo mật tối đa
}
```

## ⚡ Comparison: Cookie vs JWT

| Tiêu chí | Cookie (HttpOnly) | JWT (localStorage) |
|----------|-------------------|-------------------|
| **XSS Protection** | ✅ Excellent | ❌ Vulnerable |
| **CSRF Protection** | ⚠️ Need SameSite | ✅ Not vulnerable |
| **Scalability** | ⚠️ Server state | ✅ Stateless |
| **Mobile Apps** | ❌ Difficult | ✅ Easy |
| **Best for** | Web apps | APIs/Mobile |

## 🎯 Recommendation

**Dùng Cookie-based Auth khi:**
- Web application chính (không phải mobile app)
- Cần bảo mật cao chống XSS
- Single domain hoặc subdomain
- User session management

**Dùng JWT khi:**
- Mobile apps hoặc native apps
- Microservices architecture
- Cross-domain authentication
- API-only backend

## 🚀 Current Implementation

Project hiện tại đã implement:
1. ✅ API Client với `credentials: 'include'`
2. ✅ Centralized API endpoints
3. ✅ TypeScript types cho API responses
4. ✅ Environment variables support

**Next steps cho backend:**
- Implement cookie authentication như examples trên
- Configure CORS với AllowCredentials
- Set HttpOnly, Secure, SameSite attributes
- Add authentication middleware cho protected routes
