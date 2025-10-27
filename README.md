# 🚀 CI/CD Pipeline with GitHub Actions & Docker

This project demonstrates how to set up a **CI/CD pipeline** for a simple Node.js application using **Docker** and **GitHub Actions (or Jenkins)**.  
It builds, tests, and deploys the app automatically whenever new code is pushed.

---

## 🧠 Overview

The pipeline performs the following steps:

1. **Builds** a Docker image of the Node.js app  
2. **Runs tests** (if any)  
3. **Pushes** the image to Docker Hub  
4. **Deploys** the container automatically using Docker or SSH into a remote VM

---

## 📂 Project Structure

├── .dockerignore
├── docker-compose.yml
├── Dockerfile
├── index.js
├── package.json
└── test.js


---

## ⚙️ Prerequisites

Before running the pipeline, ensure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/)
- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- (Optional) [Jenkins](https://www.jenkins.io/)

---

## 🧰 Setup & Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>


Install dependencies

npm install


Run the app

node index.js


Access the app

http://localhost:3000

🐳 Docker Setup
Build the Docker image
docker build -t my-node-app .

Run the container
docker run -d -p 3000:3000 my-node-app

Using Docker Compose
docker-compose up --build

🔄 CI/CD Pipeline

This project supports two options for continuous deployment:

1️⃣ GitHub Actions (Recommended)

Automatically builds and pushes Docker images on every commit.

Example workflow file: .github/workflows/docker-ci.yml

2️⃣ Jenkins Pipeline (Alternative)

A sample Jenkinsfile can:

Build the Docker image

Push it to Docker Hub

Deploy to a local VM or cloud server via SSH

Example deployment stage:

stage('Deploy to VM') {
    steps {
        sh '''
        ssh user@192.168.1.10 '
            docker pull your-username/ci-cd-demo:latest &&
            docker stop myapp || true &&
            docker rm myapp || true &&
            docker run -d --name myapp -p 3000:3000 your-username/ci-cd-demo:latest
        '
        '''
    }
}

🖥️ Optional: Deploy to Local VM via SSH

If you want Jenkins (or your CI system) to deploy automatically to a local virtual machine:

Ensure Docker and SSH are installed on the VM

Enable SSH access (sudo apt install openssh-server)

Add your Jenkins public key to the VM’s ~/.ssh/authorized_keys

Update IP address and credentials in the pipeline

✅ Testing

To test your Node.js app locally:

node test.js


Or inside Docker:

docker exec -it <container_id> npm test

🧩 Tech Stack

Node.js — Application framework

Docker — Containerization

GitHub Actions / Jenkins — CI/CD automation

Docker Hub — Image registry

📸 Screenshots
Docker Build

GitHub Actions Pipeline

🧑‍💻 Author

Aditya Sabne
DevOps Engineer | Cloud & Automation Enthusiast
📧 adityasabne119@gmail.com
