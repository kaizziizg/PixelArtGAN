FROM python:3
WORKDIR /app
COPY ./python .
# RUN pip install --no-cache-dir -r requirements.txt

CMD [ "python", "./app.py" ]
