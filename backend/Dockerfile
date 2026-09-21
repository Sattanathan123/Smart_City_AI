# Stage 1: Build Java Spring Boot Application
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests -B

# Stage 2: Production JDK 21 Runtime Container
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/smart-city-backend-1.0.0.jar app.jar
RUN mkdir -p uploads/complaints

EXPOSE 8082
ENV PORT=8082

ENTRYPOINT ["java", "-jar", "app.jar"]
