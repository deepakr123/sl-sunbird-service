FROM node:12

WORKDIR /opt/sunbird

#copy package.json file
COPY package.json /opt/sunbird

#install node packges
RUN npm install

#copy all files 
COPY . /opt/sunbird

#expose the application port
EXPOSE 4551

#start the application
CMD node app.js
