ssh nicolas-choquet@ssh-nicolas-choquet.alwaysdata.net \
  'cd portfolio-apple && \
    rm -f yarn.lock && \
    rm -f package.lock && \
    git pull && \
    npm install && \
    npm run build'