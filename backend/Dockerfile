# ── Estágio 1: build ────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /build

# Instala Maven (projeto não tem mvnw)
RUN apk add --no-cache maven

# Copia apenas o pom.xml primeiro para aproveitar cache de dependências
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Copia o código e compila
COPY src ./src
RUN mvn -q package -DskipTests

# ── Estágio 2: runtime ──────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=builder /build/target/*.jar app.jar

# Diretório de uploads de fotos
RUN mkdir -p /app/uploads/fotos

EXPOSE 8080

# Perfil de produção ativado por padrão no container
ENV SPRING_PROFILES_ACTIVE=prod

ENTRYPOINT ["java", "-jar", "app.jar"]
