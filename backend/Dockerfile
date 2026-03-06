# ── Estágio 1: build ────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /build
RUN apk add --no-cache maven
COPY pom.xml .
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn -q package -DskipTests

# ── Estágio 2: runtime ──────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /build/target/*.jar app.jar
RUN mkdir -p /app/uploads/fotos
EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=prod

# Shell form permite expansão de variável de ambiente
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT:-8080}"]