// حارس منع تزوير الطلبات من جانب الخادم (SSRF Guard - CWE-918)
const dns = require('dns').promises;
const { URL } = require('url');

class SSRFGuard {
    static isPrivateIp(ip) {
        // IPv4 Local, Private, and Cloud Metadata Ranges
        if (ip === '127.0.0.1' || ip === 'localhost' || ip === '::1' || ip === '0.0.0.0') return true;
        
        // AWS/GCP/Azure Cloud Metadata IP
        if (ip === '169.254.169.254') return true;

        const parts = ip.split('.').map(Number);
        if (parts.length !== 4 || parts.some(isNaN)) return false;

        // 10.0.0.0/8
        if (parts[0] === 10) return true;
        // 172.16.0.0/12
        if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
        // 192.168.0.0/16
        if (parts[0] === 192 && parts[1] === 168) return true;
        // 127.0.0.0/8
        if (parts[0] === 127) return true;
        // 169.254.0.0/16 (Link Local)
        if (parts[0] === 169 && parts[1] === 254) return true;

        return false;
    }

    static async validateUrl(urlString, options = {}) {
        let parsedUrl;
        try {
            parsedUrl = new URL(urlString);
        } catch {
            throw new Error('الرابط المقدم غير صالح بصرياً أو هيكلياً');
        }

        // البروتوكولات المسموح بها حصراً
        const allowedProtocols = options.allowedProtocols || ['http:', 'https:'];
        if (!allowedProtocols.includes(parsedUrl.protocol)) {
            throw new Error(`البروتوكول '${parsedUrl.protocol}' غير مسموح به (خطر SSRF)`);
        }

        // فحص النطاقات المسموحة إن وجدت (Allowlist)
        if (options.allowedDomains && options.allowedDomains.length > 0) {
            const isDomainAllowed = options.allowedDomains.some(domain => 
                parsedUrl.hostname === domain || parsedUrl.hostname.endsWith('.' + domain)
            );
            if (!isDomainAllowed) {
                throw new Error(`النطاق '${parsedUrl.hostname}' غير مصرح بالاتصال به`);
            }
        }

        // حل عنوان DNS لفحص الـ IP الفعلي لمنع DNS Rebinding
        try {
            const addresses = await dns.lookup(parsedUrl.hostname, { all: true });
            for (const addr of addresses) {
                if (this.isPrivateIp(addr.address)) {
                    throw new Error(`محظور: الرابط يوجه إلى شبكة داخلية أو عنوان IP خاص (${addr.address})`);
                }
            }
        } catch (err) {
            if (err.message.includes('محظور:')) throw err;
            throw new Error(`فشل التحقق من عنوان DNS للنطاق ${parsedUrl.hostname}: ${err.message}`);
        }

        return { valid: true, parsedUrl };
    }
}

module.exports = SSRFGuard;
