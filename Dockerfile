FROM node:18.20-alpine AS builder
WORKDIR /app

COPY . .
ENV DOC_PARSE_BASE_URL=/doc-parse
ENV CORS_FETCH_BASE_URL=/cors
RUN npm install -g pnpm
RUN pnpm install && pnpm build -m pwa

FROM python:3.12.7-slim
WORKDIR /app

COPY src-backend/ .
COPY --from=builder /app/dist ./app/static
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
