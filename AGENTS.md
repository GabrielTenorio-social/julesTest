# AGENTS.md

## Project Context
This project is a backend application built with NestJS and TypeScript.

- Framework: NestJS
- Language: TypeScript
- Runtime: Node.js
- Database access: TypeORM
- Architecture: feature-based modules
- Style: clean architecture–inspired, with clear separation of concerns

---

## Code Style & Paradigm
- Prefer functional programming patterns when possible
- Avoid unnecessary classes and over-engineering
- Favor immutability and pure functions
- Keep services thin; business rules should be explicit
- Avoid magic values; prefer well-named constants
- Prefer function declaration over const declaration

---

## NestJS Conventions
- Controllers should only handle HTTP concerns
- Business logic must not live in controllers
- DTOs are used for input validation and serialization
- Entities represent persistence models, not domain models
- Use dependency injection explicitly and avoid hidden dependencies

---

## Database & Performance
- Be mindful of N+1 query problems
- Prefer bulk queries over per-item lookups
- Always consider query performance when suggesting repository changes
- Avoid lazy loading unless explicitly justified

---

## Error Handling
- Prefer explicit error handling
- Use domain-specific errors when possible
- Avoid leaking internal errors to controllers

---

## Testing
- Prefer unit tests for business logic
- Suggest tests when refactoring complex logic
- Avoid testing framework internals

---

## Refactoring Rules
- Explain the reasoning before large refactors
- Keep diffs small and incremental
- Do not introduce new libraries without justification

---

## What to Avoid
- Do not change existing architecture without explanation
- Do not add unnecessary abstractions
- Do not assume requirements that were not stated

---

## How to Help
When responding:
1. Explain trade-offs
2. Prefer clarity over cleverness
3. Suggest improvements aligned with this document
