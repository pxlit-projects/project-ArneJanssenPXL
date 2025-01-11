# Fullstack Java Project

## Arne Janssen (3AONA)

## Folder structure

- Readme.md
- _architecture_: this folder contains documentation regarding the architecture of your system.
- `docker-compose.yml` : to start the backend (starts all microservices)
- _backend-java_: contains microservices written in java
- _demo-artifacts_: contains images, files, etc that are useful for demo purposes.
- _frontend-web_: contains the Angular webclient

Each folder contains its own specific `.gitignore` file.  
**:warning: complete these files asap, so you don't litter your repository with binary build artifacts!**

## How to setup and run this application

### Frontend
1. Run ``Docker compose up``
2. Serve to localhost on port: 9000

### Backend

1. Start up Docker Desktop
2. Start up Heidi SQL
3. Start up Micro Services (Config - Discovery - Gateway - Post - Review - Comment)

