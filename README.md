# Adot test technique

## Initial setup

```sh
npm install
npm run dev 
```

After "npm run dev" the API should be hosted at localhost:8000
You can now access to the swagger and inspect available route

Swagger is at http://localhost:8000/adot/v1/explorer/
There is already some testing data available for you, you can simply click on "Try it out" and send the object data and see the result

![ScreenShot](/test-technique-adotmob/swagger.png)


## Initial setup

There is some unit test in the folder "src/validations"
You can start the test with 

```sh
npm test
```

BEFORE START UNIT TEST BE SURE TO HAVE THE API LAUNCHED FIRST OTHERWISE SOME TEST WILL FAIL
