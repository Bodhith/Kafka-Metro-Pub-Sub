FROM python:3.7-alpine
RUN pip install --upgrade pip
RUN apk add --no-cache gcc musl-dev linux-headers
COPY . ./application
WORKDIR /application
RUN pip install -r requirements.txt
EXPOSE 4000
CMD [ "python", "services/app.py" ]