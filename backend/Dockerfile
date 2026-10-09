# ==============================================================================
# Multi-Stage Dockerfile for Hypermarketplace Spring Boot Backend
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Application with Maven & OpenJDK
# ------------------------------------------------------------------------------
FROM eclipse-temurin:21-jdk-jammy AS builder

WORKDIR /app

# Copy Maven Wrapper and POM first to leverage Docker layer caching for dependencies
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Make wrapper script executable
RUN chmod +x mvnw

# Resolve dependencies offline
RUN ./mvnw dependency:go-offline -B

# Copy project source code
COPY src ./src

# Build production executable JAR (skipping unit/integration tests during image build)
RUN ./mvnw clean package -DskipTests -B

# ------------------------------------------------------------------------------
# Stage 2: Minimal, Secure Runtime Image
# ------------------------------------------------------------------------------
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Create a non-privileged user and group for running the container
RUN groupadd -r spring && useradd -r -g spring spring

# Copy compiled JAR from the builder stage
COPY --from=builder --chown=spring:spring /app/target/*.jar app.jar

# Run as non-root user
USER spring:spring

# Expose default HTTP port
EXPOSE 8080

# Configure Spring active profile to 'prod' by default (can be overridden)
ENV SPRING_PROFILES_ACTIVE=prod

# Launch the Spring Boot application with optimized JVM flags
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
