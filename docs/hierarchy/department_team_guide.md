# Department & Team Management Guide

## Overview
Departments and Teams are the granular operational nodes of a Factory. They are designed to map real-world industrial fault routing (e.g., "Assign the Motor Vibration issue to the Mechanical Department -> Rotating Equipment Team").

## Industrial Predefined Types
To standardize AI analysis across organizations, MechaMind OS enforces specific Department Types:
- `MECHANICAL`, `ELECTRICAL`, `INSTRUMENTATION`, `PRODUCTION`, `SAFETY`, `QUALITY`, `MAINTENANCE`

## User Assignments
Users are assigned to Departments via `UserDepartmentRole`, granting them scoped RBAC permissions (e.g., `Technician` role in the `Mechanical` department).
Users are assigned to Teams via the `UserTeam` table strictly to denote execution membership for task assignment (not security privileges).

## API Overview
- `POST /api/v1/departments/{id}/users` (Assigns User + Role to Dept)
- `POST /api/v1/teams/{id}/users` (Adds User to execution Team)
