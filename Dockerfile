FROM node:latest AS frontbuild

WORKDIR /app
COPY ./frontend/package.json ./
RUN npm install
COPY ./frontend ./
RUN npm run build

FROM python:3.9-slim-buster
WORKDIR /app
COPY --from=frontbuild /app/out /app/out
COPY ./backend/requirements.txt ./
RUN pip install -r requirements.txt
COPY ./backend ./
CMD ["python", "main.py"]