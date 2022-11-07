FROM python:3
WORKDIR /app
COPY ./python .
RUN pip install websockets

CMD [ "python", "./app.py" ]
