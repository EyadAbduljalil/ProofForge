# Clean Architecture Layer Implementation Example

## Recommended Directory Structure

```text
src/
├── domain/             # Enterprise business rules (Zero external dependencies)
│   ├── entities/       # Pure data models and invariant validation
│   └── value-objects/  # Immutable domain primitives (e.g., Email, Money)
├── application/        # Application business rules
│   ├── use-cases/      # Single-responsibility workflows (e.g., CreateSecretUseCase)
│   └── interfaces/     # Repository & gateway abstractions (ports)
├── infrastructure/     # External adapters & frameworks
│   ├── persistence/    # Database implementations (e.g., PostgresSecretRepo)
│   └── crypto/         # WebCrypto / AES-GCM encryption implementations
└── presentation/       # User interaction & delivery mechanisms
    ├── controllers/    # API routes / HTTP endpoints
    └── ui/             # React/Vue components (View only)
```

## Invariant Dependency Rule
> Dependencies MUST only point inwards. Domain depends on NOTHING. Infrastructure and Presentation depend on Domain & Application.
