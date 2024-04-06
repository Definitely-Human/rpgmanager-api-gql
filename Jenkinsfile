pipeline {
  agent {
    docker {
      image 'node:16-alpine'
      args '--user root -v /var/run/docker.sock:/var/run/docker.sock' // mount Docker socket to access the host's Docker daemon
    }
  }
  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', credentialsId: 'github-cred', url: 'https://github.com/Definitely-Human/rpgmanager-api-gql.git'
      }
    }
    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }
    stage('Lint') {
      steps {
        sh 'npm run lint'
      }
    }
    stage('Test') {
      steps {
        sh 'npm run test'
      }
    }


  }
}
