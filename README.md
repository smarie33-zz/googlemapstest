# MOAT test
###### es6, bable, bootstrap, node, google maps

<small>Author: Shannon Mosley</small>

## Description
Create a web app that calculates the distance (in nautical miles) between two airports. The app should autocomplete the airports and should feature all airports in the U.S. only. Bonus: plot the trip on Google maps. If you are using npm, please do not include your node_modules folder and make sure that all your requirements are in package.json.
- [http://iatacodes.org/](http://iatacodes.org/)
- [Google Maps Directions API](https://developers.google.com/maps/documentation/javascript/directions)

### Installation
1. `$ npm install`
2. Make sure nothing else is running on port 9000 OR change the proxy port in the gulp file and in the src > js > airportFunctionality.js
3. Run `$ gulp`

### Features
- responsiveness via bootstrap
- check for blank fields
- error reporting from IATACodes
- error reporting from Google API
- Using [CORS Anywhere](https://github.com/Rob--W/cors-anywhere) to generate a proxy server. Hopefully a production api would allow cross origin or be on the same server 

