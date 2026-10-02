/**
 * @file multi-stack-fixtures.js
 * @description نماذج وبيئات اختبار حقيقية متعددة الـ Stack لاختبار قدرة WebForge على الاستكشاف والتكيف بدون افتراضات
 */

const MultiStackFixtures = [
    {
        name: 'Fixture 1: Next.js + TypeScript + PostgreSQL + Redis',
        files: {
            'package.json': JSON.stringify({
                dependencies: { 'next': '^14.0.0', 'react': '^18.0.0', 'typescript': '^5.0.0', 'pg': '^8.11.0', 'ioredis': '^5.3.0' }
            }),
            'tsconfig.json': '{}'
        },
        expected: {
            languages: ['javascript', 'typescript'],
            frontend: 'nextjs',
            database: 'postgresql',
            cache: 'redis'
        }
    },
    {
        name: 'Fixture 2: Django + Python + MySQL + Celery',
        files: {
            'requirements.txt': 'django>=4.2\nmysqlclient>=2.2.0\ncelery>=5.3.0\n'
        },
        expected: {
            languages: ['python'],
            backend: 'python',
            database: 'mysql'
        }
    },
    {
        name: 'Fixture 3: Laravel + PHP + MariaDB + Redis',
        files: {
            'composer.json': JSON.stringify({
                require: { 'php': '^8.2', 'laravel/framework': '^10.0', 'predis/predis': '^2.0' }
            })
        },
        expected: {
            languages: ['php'],
            backend: 'php'
        }
    },
    {
        name: 'Fixture 4: Spring Boot + Java + MongoDB + Kafka',
        files: {
            'pom.xml': '<project><dependencies><dependency><groupId>org.springframework.boot</groupId></dependency></dependencies></project>'
        },
        expected: {
            languages: ['java'],
            backend: 'jvm'
        }
    },
    {
        name: 'Fixture 5: FastAPI + Python + SQLite',
        files: {
            'requirements.txt': 'fastapi>=0.100.0\nuvicorn>=0.23.0\nsqlite3\n'
        },
        expected: {
            languages: ['python'],
            backend: 'python'
        }
    },
    {
        name: 'Fixture 6: Rust + SQLite (CLI-only)',
        files: {
            'Cargo.toml': '[package]\nname = "cli_tool"\nversion = "0.1.0"\n'
        },
        expected: {
            languages: ['rust'],
            backend: 'native-rust'
        }
    }
];

module.exports = MultiStackFixtures;
