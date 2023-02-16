FROM node:16-alpine AS front-build
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY ["./frontend/package.json",  "./frontend/package-lock.json", "./"]
RUN npm install --verbose

FROM node:16-alpine AS front-export
WORKDIR /app
COPY ./frontend ./
COPY --from=front-build /app/node_modules ./node_modules
RUN npm run build

FROM python:3.10-slim AS runner
ENV PYTHONUNBUFFERED True
#ENV PORT 80

WORKDIR /app
COPY ./backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY ./backend ./
COPY --from=front-export /app/out /app/out
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app
