const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function writeDoc(filePath, content) {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
    console.log(`[ADAPTER] Created: ${filePath}`);
}

module.exports = function buildAdapters() {
    console.log('>>> Building Adapters Layer...');

    // 1. Antigravity
    writeDoc('adapters/antigravity/instructions.md', `# محول منصة Antigravity (Antigravity Platform Adapter)

## التعليمات الإلزامية للوكيل:
1. اقرأ ملف \`AGENT.md\` فور بدء أي جلسة عمل كمصدر وحيد للحقيقة.
2. التزم التزاماً مطلقاً بجميع القواعد الهندسية والأمنية الموجودة في مجلد \`core/\`.
3. استخدم أدوات الفحص والأوامر المتاحة في Antigravity للتحقق الفعلي والبصري من الواجهات (Evidence-Based Verification).
4. اكتب كافة التقارير والردود باللغة العربية حصراً وفق نموذج التقارير القياسي.
`);

    // 2. Cursor
    writeDoc('adapters/cursor/.cursorrules', `# WebForge OS - Cursor Agent Rules

You are operating under WebForge OS (The Web Engineering Operating System).

MANDATORY RULES:
1. Language: All communications, plans, summaries, and code reviews MUST be in Arabic.
2. Source of Truth: Follow the canonical rules in \`core/\`, \`skills/\`, and \`domains/\`. Do not apply default AI assumptions.
3. Security-First: Zero Trust, Server-side validation, IDOR prevention, Parameterized queries, Default Deny.
4. Anti-Slop: No generic purple/blue gradients, no random cards, no fake content. Craft authentic, high-contrast, accessible UI.
5. Verification: Every completed feature must be verified. No "done" without evidence.
`);

    writeDoc('adapters/cursor/rules.md', `# محول منصة Cursor (Cursor Rules Adapter)
قم بنسخ محتوى \`.cursorrules\` إلى المجلد الجذري للمشروع أو استدعاء ملفات \`core/\` مباشرة.
`);

    // 3. Claude
    writeDoc('adapters/claude/claude_instructions.md', `# محول منصة Claude (Claude Instructions Adapter)

عند العمل في بيئة Claude / Claude Code:
- يتم تفعيل قواعد المستودع المرجعي كمرجع تشغيلي أساسي.
- حظر كتابة أي حلول جزئية أو تعليقات اختصار (\`// TODO\`).
- التحقق المزدوج من كافة الصلاحيات ومنع ثغرات IDOR وحقن الاستعلامات.
- الالتزام التام باللغة العربية في كافة الردود والتقارير.
`);

    // 4. Codex
    writeDoc('adapters/codex/codex_instructions.md', `# محول منصة Codex (Codex Instructions Adapter)

- الالتزام بنظام الأولويات: P0 الأمن ← P1 متطلبات المشروع ← P2 قواعد المستودع.
- كتابة كود محكم وخالٍ من الثغرات، وموثق بالكامل باللغة العربية.
`);

    // 5. Lovable & v0
    writeDoc('adapters/lovable/lovable_guidelines.md', `# محول منصة Lovable (Lovable Guidelines Adapter)

- تخضع كافة الواجهات المولدة آلياً لقواعد \`anti-slop\` وتطهير التصاميم الرديئة.
- فصل منطق الواجهة الخلفية والأمان ومنع الاعتماد على التحقق الواجهي فقط.
`);

    writeDoc('adapters/v0/v0_guidelines.md', `# محول منصة v0 (v0 Guidelines Adapter)

- استخدام الرموز التصميمية المعتمدة في \`references/design/\`.
- منع استخدام التدرجات العشوائية والبطاقات المكدسة غير الضرورية.
`);

    // 6. Replit & Windsurf
    writeDoc('adapters/replit/replit_instructions.md', `# محول منصة Replit (Replit Instructions Adapter)

- تكوين مسار النشر والتشغيل وفق مواصفات الإنتاج في \`templates/deployment/\`.
`);

    writeDoc('adapters/windsurf/windsurf_rules.md', `# محول منصة Windsurf (Windsurf Cascade Rules)

- الالتزام ببروتوكول التنفيذ الموحد الموضح في \`AGENT.md\`.
`);

    // 7. Generic
    writeDoc('adapters/generic/universal_agent_instructions.md', `# المحول العالمي العام لكافة وكلاء الذكاء الاصطناعي (Universal Agent Adapter)

## البروتوكول العام لأي AI Coding Agent:
1. **المرحلة 0**: اقرأ قواعد المستودع \`AGENT.md\` و \`core/\`.
2. **المرحلة 1**: افحص متطلبات المشروع الحالي وحدد نطاقه (Domain).
3. **المرحلة 2**: حمّل المهارات ذات الصلة فقط (Skills).
4. **المرحلة 3**: خطط وصمم المعمارية \`ARCHITECTURE.md\` قبل كتابة أي كود.
5. **المرحلة 4**: نفّذ الميزة بكود كامل بدون كسل.
6. **المرحلة 5**: اختبر، دقق أمنياً، وافحص التجاوب وإمكانية الوصول.
7. **المرحلة 6**: قدم تقريراً مبنياً على الأدلة (Evidence-Based Report) باللغة العربية.
`);

    console.log('>>> Adapters Layer Built Successfully.');
};
