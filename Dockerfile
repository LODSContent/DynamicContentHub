# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3-slim

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get upgrade -y
RUN apt-get install curl -y

# Install pip requirements
COPY requirements.txt .
RUN python -m pip install -r requirements.txt

# Install Gunicorn
RUN python -m pip install gunicorn

WORKDIR /app
COPY . /app

EXPOSE 5051

# Use Gunicorn to run the Flask application
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5051", "main:app"]
