pipeline {
  agent any

  environment {
    DOCKERHUB_CRED = 'dockerhub-creds' // Jenkins credential ID
  }

  stages {
    stage('Prepare') {
      steps {
        checkout scm
        withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CRED}", usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
          script {
            env.IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
            env.DOCKERHUB_USER = DH_USER
            env.IMAGE_NAME = "${env.DOCKERHUB_USER}/jenkins-ci-cd-sample:${env.IMAGE_TAG}"
          }
        }
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Start app for tests') {
      steps {
        sh '''
          nohup node index.js > jenkins-app.log 2>&1 &
          for i in $(seq 1 15); do
            if nc -z localhost 3000 ; then
              echo "app up"
              break
            fi
            sleep 1
          done
        '''
      }
    }

    stage('Run tests') {
      steps {
        sh 'npm test'
      }
    }

    stage('Build Docker image') {
      steps {
        script {
          echo "Building image ${env.IMAGE_NAME}"
          sh "docker build -t ${env.IMAGE_NAME} ."
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CRED}", usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
          script {
            sh '''
              #!/bin/bash
              echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
              docker tag ${IMAGE_NAME} ${DOCKERHUB_USER}/jenkins-ci-cd-sample:latest
              docker push ${IMAGE_NAME}
              docker push ${DOCKERHUB_USER}/jenkins-ci-cd-sample:latest
            '''
          }
        }
      }
    }

    stage('Deploy to Minikube') {
      when {
        expression { return params.DEPLOY_TO_MINIKUBE == true }
      }
      steps {
        sh '''
          echo "Deploying to Minikube..."
          kubectl apply -f k8s-deployment.yaml
          kubectl rollout status deployment/cicd-sample --timeout=120s || true
        '''
      }
    }
  }

  post {
    always {
      sh 'echo "---- jenkins-app.log ----"; tail -n +1 jenkins-app.log || true'
      sh 'docker ps -a || true'
    }
    success {
      echo "✅ Pipeline completed successfully."
    }
    failure {
      echo "❌ Pipeline failed."
    }
  }
}