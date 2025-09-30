/********************************************************************************
*  WEB700 – Assignment 1
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Rahulkumar Kalidas Patel
*  Student ID: 127490241
*  Date: 09/15/2025
********************************************************************************/

/*
  STEP 3: Create the "server" arrays for methods, routes, and responses.
  These indexes must align so that method+route at index i map to the response at index i.
  (See assignment’s Step 3 table for exact values and the “Developed by …” line.) :contentReference[oaicite:0]{index=0} :contentReference[oaicite:1]{index=1}
*/
const serverMethods = ["GET", "GET", "GET", "POST", "GET", "POST"];
const serverRoutes  = [   "/", "/store", "/store-admin", "/register", "/developer", "/login"];
const serverResponses = [
  "Home",
  "Main Storefront",
  "Manage Products",
  "Registered New User",
  "Developed by: Rahul Patel: rkpatel52@myseneca.ca",
  "User Logged In"
];

/*
  STEP 4: Implement the "web server simulator" function: processRequest(method, route)
  - If method and route are found at the SAME index, return "200: <response>"
  - Otherwise return a 404 message as described in the spec. :contentReference[oaicite:2]{index=2} :contentReference[oaicite:3]{index=3}
*/
function processRequest(method, route) {
  for (let i = 0; i < serverRoutes.length; i++) {
     if (serverMethods[i] === method && serverRoutes[i] === route) {
      return `200: ${serverResponses[i]}`;
    }
  }
  return `404: Unable to process ${method} request for ${route}`;
}

/*
  STEP 5: Manually test processRequest with a few calls (as per examples).
  These console.logs are helpful during development to verify behavior. :contentReference[oaicite:4]{index=4}
*/
console.log(processRequest("GET", "/"));           
console.log(processRequest("GET", "/developer"));  
console.log(processRequest("POST", "/register"));  
console.log(processRequest("POST", "/"));          

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
/*
  STEP 6: Automate testing with testRequests()
  - Defines testMethods and testRoutes (includes notFound routes)
  - Repeats random requests every 1 second using setInterval
  - Logs the result of processRequest(method, route) each time
  Followed exactly as described in the spec’s outline. :contentReference[oaicite:6]{index=6} :contentReference[oaicite:7]{index=7} :contentReference[oaicite:8]{index=8} :contentReference[oaicite:9]{index=9}
*/
function testRequests() {
  const testMethods = ["GET", "POST"];
  const testRoutes = [
    "/", "/store", "/store-admin", "/register",
    "/developer", "/login", "/notFound1", "/notFound2"
  ];

  function randomRequest() {
    const randMethod = testMethods[getRandomInt(testMethods.length)];
    const randRoute  = testRoutes[getRandomInt(testRoutes.length)];
    console.log(processRequest(randMethod, randRoute));
  }

  setInterval(randomRequest, 1000); 
}

/*
  STEP 7: Invoke testRequests so the automated testing starts when the file runs. :contentReference[oaicite:11]{index=11}
*/
testRequests();