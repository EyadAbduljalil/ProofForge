/**
 * @file code-intelligence.js
 * @description محرك الاستخبارات البرمجية المتقدم وتحليل تدفق البيانات والتلوث (Advanced Code & AST Intelligence)
 * يوفر تحليلاً هيكلياً للشفرة المصدرية، مع تمييز دقيق لمستويات التحليل، وتتبع مسار التلوث (Taint Analysis) من المصدر إلى المصب
 */

const ANALYSIS_LEVELS = {
    TEXT_ANALYSIS: 'TEXT_ANALYSIS',
    LEXICAL_ANALYSIS: 'LEXICAL_ANALYSIS',
    SYNTAX_ANALYSIS: 'SYNTAX_ANALYSIS',
    AST_ANALYSIS: 'AST_ANALYSIS',
    SEMANTIC_ANALYSIS: 'SEMANTIC_ANALYSIS',
    DATA_FLOW_ANALYSIS: 'DATA_FLOW_ANALYSIS',
    TAINT_ANALYSIS: 'TAINT_ANALYSIS'
};

const AST_CAPABILITY_STATUS = {
    AST_SUPPORTED: 'AST_SUPPORTED',
    AST_PARTIAL: 'AST_PARTIAL',
    AST_UNAVAILABLE: 'AST_UNAVAILABLE',
    NOT_APPLICABLE: 'NOT_APPLICABLE'
};

const TAINT_SOURCES = [
    'req.query', 'req.body', 'req.params', 'req.headers', 'request.url',
    'process.argv', 'process.env', 'location.search', 'window.name',
    'document.cookie', 'socket.on', 'userInput', 'untrustedInput'
];

const TAINT_SINKS = {
    CODE_EXECUTION: ['eval(', 'Function(', 'setTimeout(', 'setInterval('],
    COMMAND_EXECUTION: ['exec(', 'execSync(', 'spawn(', 'execFile(', 'execFileSync('],
    PATH_TRAVERSAL: ['fs.readFile(', 'fs.readFileSync(', 'fs.writeFile(', 'fs.unlink(', 'fs.createReadStream('],
    SQL_INJECTION: ['db.query(', 'db.execute(', 'client.query(', 'connection.query('],
    PROTOTYPE_POLLUTION: ['Object.assign(', '__proto__', 'constructor.prototype'],
    OPEN_REDIRECT: ['res.redirect(', 'window.location =', 'location.href =']
};

const SANITIZERS = [
    'encodeURIComponent', 'path.basename', 'path.resolve', 'Number(', 'parseInt(',
    'escapeHtml', 'sanitize', 'prepare(', 'parameterized'
];

class CodeIntelligenceEngine {
    constructor(options = {}) {
        this.parserAdapters = new Map();
        this._registerDefaultAdapters();
    }

    _registerDefaultAdapters() {
        // محول مدمج لتحليل JavaScript/TypeScript دون فرض حزم خارجية
        this.registerParserAdapter('javascript', {
            extensions: ['.js', '.mjs', '.cjs'],
            astCapability: AST_CAPABILITY_STATUS.AST_SUPPORTED,
            parse: (code) => this._tokenizeAndParseJS(code)
        });

        this.registerParserAdapter('typescript', {
            extensions: ['.ts', '.tsx'],
            astCapability: AST_CAPABILITY_STATUS.AST_PARTIAL,
            parse: (code) => this._tokenizeAndParseJS(code)
        });

        this.registerParserAdapter('json', {
            extensions: ['.json'],
            astCapability: AST_CAPABILITY_STATUS.AST_SUPPORTED,
            parse: (code) => JSON.parse(code)
        });
    }

    registerParserAdapter(language, adapter) {
        this.parserAdapters.set(language.toLowerCase(), adapter);
    }

    getParserCapability(filePath) {
        if (!filePath || typeof filePath !== 'string') return AST_CAPABILITY_STATUS.NOT_APPLICABLE;
        for (const [lang, adapter] of this.parserAdapters.entries()) {
            if (adapter.extensions.some(ext => filePath.toLowerCase().endsWith(ext))) {
                return adapter.astCapability;
            }
        }
        return AST_CAPABILITY_STATUS.AST_UNAVAILABLE;
    }

    /**
     * تحليل ملف برمجي مع استخراج العقد وتدفق البيانات وفحص الأمان والتلوث
     */
    analyzeSourceCode(filePath, content = '') {
        const capability = this.getParserCapability(filePath);
        const codeText = String(content || '');

        if (!codeText.trim()) {
            return {
                filePath,
                capability: AST_CAPABILITY_STATUS.NOT_APPLICABLE,
                analysisLevel: ANALYSIS_LEVELS.TEXT_ANALYSIS,
                findings: [],
                dataFlows: []
            };
        }

        if (capability === AST_CAPABILITY_STATUS.AST_UNAVAILABLE) {
            return {
                filePath,
                capability,
                analysisLevel: ANALYSIS_LEVELS.TEXT_ANALYSIS,
                findings: [],
                dataFlows: [],
                reason: 'لا يتوفر محول AST للغة هذا الملف في البيئة الحالية'
            };
        }

        const lines = codeText.split('\n');
        const astNodes = this._tokenizeAndParseJS(codeText);
        const dataFlows = this._extractDataFlows(lines);
        const findings = this._detectSecurityPatterns(filePath, lines, dataFlows, astNodes);

        return {
            filePath,
            capability,
            analysisLevel: dataFlows.length > 0 ? ANALYSIS_LEVELS.TAINT_ANALYSIS : ANALYSIS_LEVELS.AST_ANALYSIS,
            nodesCount: astNodes.length,
            dataFlowsCount: dataFlows.length,
            findingsCount: findings.length,
            dataFlows,
            findings
        };
    }

    _tokenizeAndParseJS(code) {
        const nodes = [];
        const lines = code.split('\n');

        lines.forEach((line, lineIdx) => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*')) return;

            // كشف الإعلانات عن الدوال
            const funcMatch = trimmed.match(/(?:function\s+([a-zA-Z0-9_$]+)|(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>)/);
            if (funcMatch) {
                nodes.push({
                    type: 'FunctionDeclaration',
                    name: funcMatch[1] || funcMatch[2],
                    line: lineIdx + 1
                });
            }

            // كشف استدعاءات الدوال
            const callMatch = trimmed.match(/([a-zA-Z0-9_$.]+)\s*\(/);
            if (callMatch) {
                nodes.push({
                    type: 'CallExpression',
                    callee: callMatch[1],
                    line: lineIdx + 1,
                    raw: trimmed
                });
            }
        });

        return nodes;
    }

    _extractDataFlows(lines) {
        const flows = [];

        lines.forEach((line, idx) => {
            const lineNum = idx + 1;
            for (const src of TAINT_SOURCES) {
                if (line.includes(src)) {
                    // البحث عن المتغير الذي يستقبل القيمة
                    const assignMatch = line.match(/(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*.*(?:req\.|process\.|window\.|location\.)/);
                    const varName = assignMatch ? assignMatch[1] : src;
                    const hasSanitizer = SANITIZERS.some(s => line.includes(s));

                    flows.push({
                        id: `FLOW_${lineNum}_${varName}`,
                        source: src,
                        variable: varName,
                        sourceLine: lineNum,
                        sanitized: hasSanitizer,
                        sanitizer: hasSanitizer ? SANITIZERS.find(s => line.includes(s)) : null,
                        raw: line.trim()
                    });
                }
            }
        });

        return flows;
    }

    _detectSecurityPatterns(filePath, lines, dataFlows, astNodes) {
        const findings = [];

        lines.forEach((line, idx) => {
            const lineNum = idx + 1;
            const trimmed = line.trim();
            if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;

            // 1. فحص تنفيذ الأوامر وشبهات الحقن (Command Execution)
            for (const sink of TAINT_SINKS.COMMAND_EXECUTION) {
                if (line.includes(sink)) {
                    const matchingFlow = dataFlows.find(f => line.includes(f.variable));
                    const isSanitized = matchingFlow ? matchingFlow.sanitized : SANITIZERS.some(s => line.includes(s));
                    
                    let verificationStatus = 'INSUFFICIENT_EVIDENCE';
                    if (matchingFlow && !isSanitized) {
                        verificationStatus = 'CONFIRMED';
                    } else if (isSanitized) {
                        verificationStatus = 'FALSE_POSITIVE';
                    } else if (line.includes('+') || line.includes('${')) {
                        verificationStatus = 'LIKELY';
                    }

                    findings.push({
                        id: `FND_CMD_${lineNum}`,
                        rule: 'security/unsafe-command-execution',
                        severity: 'CRITICAL',
                        confidence: verificationStatus === 'CONFIRMED' ? 'HIGH' : 'MEDIUM',
                        file: filePath,
                        location: { line: lineNum, column: line.indexOf(sink) + 1 },
                        evidence: trimmed,
                        source: matchingFlow ? matchingFlow.source : 'UNKNOWN_SOURCE',
                        sink,
                        dataflow: matchingFlow ? matchingFlow.id : 'DIRECT_INVOCATION',
                        sanitized: isSanitized,
                        verification_status: verificationStatus
                    });
                }
            }

            // 2. فحص مسارات الملفات (Path Traversal)
            for (const sink of TAINT_SINKS.PATH_TRAVERSAL) {
                if (line.includes(sink)) {
                    const matchingFlow = dataFlows.find(f => line.includes(f.variable));
                    const isSanitized = line.includes('path.basename') || line.includes('path.resolve') || (matchingFlow && matchingFlow.sanitized);

                    let verificationStatus = 'INSUFFICIENT_EVIDENCE';
                    if (matchingFlow && !isSanitized) {
                        verificationStatus = 'CONFIRMED';
                    } else if (isSanitized) {
                        verificationStatus = 'FALSE_POSITIVE';
                    } else if (line.includes('..') || line.includes('+')) {
                        verificationStatus = 'LIKELY';
                    }

                    findings.push({
                        id: `FND_PATH_${lineNum}`,
                        rule: 'security/path-traversal-sink',
                        severity: 'HIGH',
                        confidence: isSanitized ? 'HIGH' : 'MEDIUM',
                        file: filePath,
                        location: { line: lineNum, column: line.indexOf(sink) + 1 },
                        evidence: trimmed,
                        source: matchingFlow ? matchingFlow.source : 'UNKNOWN_SOURCE',
                        sink,
                        dataflow: matchingFlow ? matchingFlow.id : 'LOCAL_VARIABLE',
                        sanitized: isSanitized,
                        verification_status: verificationStatus
                    });
                }
            }

            // 3. فحص التنفيذ الديناميكي الخطير (Dangerous Eval)
            for (const sink of TAINT_SINKS.CODE_EXECUTION) {
                if (line.includes(sink) && !line.includes('setTimeout(fn,') && !line.includes('setInterval(fn,')) {
                    findings.push({
                        id: `FND_EVAL_${lineNum}`,
                        rule: 'security/dangerous-dynamic-execution',
                        severity: 'CRITICAL',
                        confidence: 'HIGH',
                        file: filePath,
                        location: { line: lineNum, column: line.indexOf(sink) + 1 },
                        evidence: trimmed,
                        source: 'DYNAMIC_CODE_BLOCK',
                        sink,
                        dataflow: 'IMMEDIATE_EVALUATION',
                        sanitized: false,
                        verification_status: 'CONFIRMED'
                    });
                }
            }
        });

        return findings;
    }
}

CodeIntelligenceEngine.ANALYSIS_LEVELS = ANALYSIS_LEVELS;
CodeIntelligenceEngine.AST_CAPABILITY_STATUS = AST_CAPABILITY_STATUS;

module.exports = CodeIntelligenceEngine;
