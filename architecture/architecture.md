# Architecture

![Project Architecture](https://github.com/user-attachments/assets/124a242a-8541-4cff-adb3-0c0c926d78ee)

# Diagram Omschrijving
> Dit diagram omvat een publicatiesysteem gebouwt in Java Spring Boot.
>
> Het systeem heeft de volgende componenten.

## 1. Angular Frontend
Dit is een web applicatie geschreven in Angular met behulp van Type Script. Twee gebruikers kunnen gebruik make van de applicatie, namelijk 'Redacteur & Gebruiker'.
De Frontend maakt HTPP/HTTPS calls/request naar de Backend services via de Api Gateway.

## 2. Config Service
Deze centrale configuratieservice voorziet elke microservice van configuratiebestanden, waardoor consistentie wordt gewaarborgd en het beheer van applicatie-eigenschappen voor alle services eenvoudig blijft.

## 3. Discovery Service
Deze service is gebouwd met Netflix Eureka en verzorgt de serviceregistratie en -detectie, zodat andere services binnen het systeem elkaar kunnen vinden en met elkaar kunnen communiceren. Dit maakt gebruikt van het Open Feign Protocol en gebruikt synchrone communicatie.

## 4. Gateway Service
Deze component dient als centraal toegangspunt en leidt inkomende verzoeken van de Angular-frontend naar de bijbehorende microservices (zoals de Post Service, Review Service en Comment Service). Daarnaast zorgt het voor veilige communicatie tussen de frontend en backend.

## 5. Micro Services
   ### 5.1 Post Service
   Wordt gebruikt voor het beheren van berichten en communiceert met zijn eigen MySQL Post-database.
   ### 5.2 Review Service
   Is verantwoordelijk voor het beheer van beoordelingen en werkt samen met de MySQL Review-database.
   ### 5.3 Comment Service
   Beheert opmerkingen en maakt gebruik van de MySQL Comment-database.
   ### 5.4 Notification Service
   Verstuurd notificaties wanneer Open Feign endpoint wordt aangeroepen.

Elke microservice voert API-requests uit via de API Gateway en communiceert met de bijbehorende database om CRUD-bewerkingen uit te voeren.
