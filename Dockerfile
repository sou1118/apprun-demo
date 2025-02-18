FROM gcr.io/distroless/cc-debian12:latest

WORKDIR /app

COPY backend/target/release/backend .
COPY backend/static ./static

EXPOSE 3000
CMD ["./backend"]
