pipeline {
    agent any

    environment {
        // Docker repository names (can be updated to registry repositories if needed)
        BACKEND_IMAGE           = 'todo-backend'
        FRONTEND_IMAGE          = 'todo-frontend'
        REGISTRY_CREDENTIALS_ID = 'docker-hub-credentials'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
                checkout scm
            }
        }

        stage('Test Backend') {
            steps {
                echo '🧪 Running Backend Unit Tests...'
                dir('backend') {
                    // Running Maven tests inside a Maven container avoids the need to install Maven on the Jenkins agent
                    sh 'docker run --rm -v ${HOME}/.m2:/root/.m2 -v $(pwd):/app -w /app maven:3.9.6-eclipse-temurin-17-alpine mvn clean test'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo '📦 Building Docker Images...'
                dir('.') {
                    sh 'docker build -t ${BACKEND_IMAGE}:latest -t ${BACKEND_IMAGE}:${BUILD_NUMBER} ./backend'
                    sh 'docker build -t ${FRONTEND_IMAGE}:latest -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} ./frontend'
                }
            }
        }

        /*
        // Optional: Uncomment and configure if you want to push built images to a remote registry like Docker Hub
        stage('Push to Registry') {
            steps {
                echo '📤 Pushing Docker images to registry...'
                withCredentials([usernamePassword(credentialsId: "${REGISTRY_CREDENTIALS_ID}", passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh 'echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin'
                    
                    sh 'docker tag ${BACKEND_IMAGE}:${BUILD_NUMBER} ${DOCKER_USERNAME}/${BACKEND_IMAGE}:${BUILD_NUMBER}'
                    sh 'docker tag ${FRONTEND_IMAGE}:${BUILD_NUMBER} ${DOCKER_USERNAME}/${FRONTEND_IMAGE}:${BUILD_NUMBER}'
                    sh 'docker tag ${BACKEND_IMAGE}:${BUILD_NUMBER} ${DOCKER_USERNAME}/${BACKEND_IMAGE}:latest'
                    sh 'docker tag ${FRONTEND_IMAGE}:${BUILD_NUMBER} ${DOCKER_USERNAME}/${FRONTEND_IMAGE}:latest'
                    
                    sh 'docker push ${DOCKER_USERNAME}/${BACKEND_IMAGE}:${BUILD_NUMBER}'
                    sh 'docker push ${DOCKER_USERNAME}/${FRONTEND_IMAGE}:${BUILD_NUMBER}'
                    sh 'docker push ${DOCKER_USERNAME}/${BACKEND_IMAGE}:latest'
                    sh 'docker push ${DOCKER_USERNAME}/${FRONTEND_IMAGE}:latest'
                }
            }
        }
        */

        stage('Deploy (Docker Compose)') {
            steps {
                echo '🚀 Deploying Application using Docker Compose...'
                dir('.') {
                    // Supports both 'docker compose' (v2) and legacy 'docker-compose' (v1)
                    sh 'docker compose down || docker-compose down || true'
                    sh 'docker compose up -d || docker-compose up -d'
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline finished successfully!'
        }
        failure {
            echo '❌ Pipeline failed. Check console output.'
        }
    }
}
