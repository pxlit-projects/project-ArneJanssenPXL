# Architecture

![Project Architecture](https://github.com/user-attachments/assets/124a242a-8541-4cff-adb3-0c0c926d78ee)

# Diagram Overzicht
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

# Communicatie Overzicht

## Synchrone Communicatie

> Synchrone communicatie wordt toegepast wanneer directe interacties tussen microservices vereist zijn. (Open Feign)

Wanneer een redacteur een post aanmaakt, opslaat of bewerkt, communiceert de Post Service direct met de Review Service om te verifiëren of de workflow correct is.
- Dit gebreurt bij US1 - US2 - US3 & US6

Voor het weergeven en filteren van gepubliceerde posts haalt de frontend de gegevens rechtstreeks op van de Post Service via een API.
- Dit gebeurt bij US4 & US5

## Asynchrone Communicatie

> Asynchrone communicatie wordt gebruikt voor langlopende processen of meldingen waarbij directe feedback niet nodig is. Dit gebeurt via RabbitMQ, dat berichten tussen de microservices verzendt zonder dat ze elkaar direct nodig hebben. (Message Bus / RabbitMq)

Wanneer een post door de hoofdredacteur wordt goedgekeurd of afgewezen, stuurt de Review Service een bericht naar RabbitMQ. De Post Service ontvangt dit bericht en genereert een notificatie voor de redacteur.
- Dit gebeurt bij US7

Bij een afwijzing kan de hoofdredacteur opmerkingen toevoegen, die via RabbitMQ naar de Comment Service worden gestuurd.
- Dit gebeurt bij US8

Reacties en wijzigingen in reacties worden verwerkt en opgeslagen via de Comment Service. Voor notificaties over nieuwe reacties of bewerkingen worden berichten naar RabbitMQ gestuurd, zodat de relevante gebruikers hiervan op de hoogte worden gesteld.
- Dit gebeurt bij US9 - US10 & US11
