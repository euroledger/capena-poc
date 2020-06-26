FROM front-agent:latest

USER root

# Install nodejs
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y \
        nodejs \
        build-essential

RUN npm install nodemon -g

USER front-agent

WORKDIR $HOME

RUN mkdir nodejs

WORKDIR nodejs



ENV LD_LIBRARY_PATH=$HOME/.local/lib:/usr/local/lib:/usr/lib


# Get the dependencies loaded first - this makes rebuilds faster
#COPY --chown=front-agent:front-agent package.json .
#RUN npm install

# Copy rest of the app
#COPY --chown=front-agent:front-agent . .
#RUN chmod uga+x bin/*

#CMD [ "npm", "start" ]

EXPOSE 8000
