// إدارة وتأمين ملفات تعريف الارتباط (Cookie Security)
class CookieSecurity {
    static getSecureCookieOptions(isProduction = true) {
        return {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'Strict' : 'Lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 أيام
        };
    }

    static serializeCookie(name, value, options = {}) {
        const opts = { ...this.getSecureCookieOptions(process.env.NODE_ENV === 'production'), ...options };
        let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

        if (opts.maxAge) cookieStr += `; Max-Age=${Math.floor(opts.maxAge / 1000)}`;
        if (opts.path) cookieStr += `; Path=${opts.path}`;
        if (opts.httpOnly) cookieStr += '; HttpOnly';
        if (opts.secure) cookieStr += '; Secure';
        if (opts.sameSite) cookieStr += `; SameSite=${opts.sameSite}`;

        return cookieStr;
    }

    static parseCookies(cookieHeader) {
        if (!cookieHeader) return {};
        const cookies = {};
        cookieHeader.split(';').forEach(cookie => {
            const parts = cookie.split('=');
            if (parts.length >= 2) {
                const name = decodeURIComponent(parts[0].trim());
                const val = decodeURIComponent(parts.slice(1).join('=').trim());
                cookies[name] = val;
            }
        });
        return cookies;
    }
}

module.exports = CookieSecurity;
