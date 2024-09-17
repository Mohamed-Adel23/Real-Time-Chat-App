# Real-Time Distributed Chat Application

A scalable, real-time chat application built with WebSockets, HAProxy, and Redis.

> You can check the blog post from [**here**]()

## Features

- Real-time messaging using WebSockets
- Load balancing with HAProxy
- Distributed message handling with Redis pub/sub
- Simple web interface for chat
- Dockerized components for easy deployment

## Prerequisites

- Docker for containerization
- Node.js (for local development)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Mohamed-Adel23/Real-Time-Chat-App.git
   cd live-chat
   ```

2. Build the Docker images:
   ```
   docker build -f Dockerfile.front -t chatfront .
   docker build -f Dockerfile.back -t chatfront .
   ```

## Running the Application

1. Start the application using Docker Compose:
   ```
   docker-compose up
   ```

2. Access the chat application in your web browser:
   ```
   http://localhost:1007
   ```

## Project Structure

- `chat-front/`: Contains the web interface
- `app/`: WebSocket server implementation
- `haproxy/`: HAProxy configuration
- `docker-compose.yml`: Defines the multi-container Docker application

## Contributing 🚀

Contributions are welcome! Please feel free to submit a Pull Request 😇

## Author
- [Mohamed Adel Elsayed](https://www.linkedin.com/in/mohamed2-adel/)
