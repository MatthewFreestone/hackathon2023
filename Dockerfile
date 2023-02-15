FROM node:latest AS frontbuild

WORKDIR /app
COPY ./frontend/package.json ./
RUN npm install
COPY ./frontend ./
RUN npm run build

FROM python:3.10-slim
ENV PYTHONUNBUFFERED True

ENV APP_HOME /app
WORKDIR $APP_HOME

COPY --from=frontbuild /app/out /app/out
COPY ./backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY ./backend ./
ENV PORT 80
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app