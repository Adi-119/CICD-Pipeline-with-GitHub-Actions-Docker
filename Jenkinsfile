pipeline {
  agent any

  environment {
    DOCKERHUB_CRED = 'dockerhub-creds'  // Jenkins credential ID
    DOCKERHUB_USER = credentials('dockerhub-creds')
                 // will be populated from credentials
    IMAGE_NAME = ''                      // will be constructed
    IMAGE_TAG = ''                       // git commit sha or build number
  }

  stages {
   stage('Prepare') {
  steps {
    checkout scm
    withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
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
        // start app in background, then run test against localhost
        sh '''
          nohup node index.js > jenkins-app.log 2>&1 &
          # wait for app to start (poll)
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
        // require Jenkins agent with docker CLI access
        script {
          // get username from credentials (we'll use withCredentials to login later)
          echo "Building image ${env.IMAGE_NAME}"
          sh "docker build -t ${env.IMAGE_NAME} ."
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
       withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
      script {
            // set DOCKERHUB_USER for IMAGE_NAME
            env.DOCKERHUB_USER = DH_USER
            env.IMAGE_NAME = "${DH_USER}/jenkins-ci-cd-sample:${env.IMAGE_TAG}"


            sh '''
              echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
              docker tag ${env.IMAGE_NAME} ${env.DOCKERHUB_USER}/jenkins-ci-cd-sample:latest
docker push ${env.IMAGE_NAME}
docker push ${env.DOCKERHUB_USER}/jenkins-ci-cd-sample:latest
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
        // NOTE: kubectl + minikube context must be available on this agent.
        sh '''
          echo "Deploying to Minikube..."
          kubectl apply -f k8s-deployment.yaml
          # wait for rollout
          kubectl rollout status deployment/cicd-sample --timeout=120s || true
        '''
      }
    }

  } // stages

  post {
    always {
      // show logs and cleanup background app
      sh 'echo "---- jenkins-app.log ----" || true; tail -n +1 jenkins-app.log || true'
      sh 'docker ps -a || true'
    }
    success {
      echo "Pipeline completed successfully."
    }
    failure {
      echo "Pipeline failed."
    }
  }
}
