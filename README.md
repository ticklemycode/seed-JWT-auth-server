# Seed Authentication Server using JWT

### Requirements
* [NodeJS](https://nodejs.org/en/) > 6.x
* [Mongodb](https://www.mongodb.com)

### Stack
* [mongoose](http://mongoosejs.com/) - elegant mongodb object modeling for node.js
* [expressjs](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
* [passport](http://www.passportjs.org/) - Simple, unobtrusive authentication for Node.js
* [JWT](https://jwt.io/) - JSON Web Tokens are an open, industry standard RFC 7519 method for representing claims securely between two parties.

---
## Signup and Signin routes will return JWT to be used for subsequent request
**Signup** route will require `email` and `password` to be sent and will check if email provided is already in use.
```javascript
app.post('/signup', Authentication.signup);
```

**Signin** route will also require `email` and `password` to be sent and server will validate credentials provided.
```javascript
app.post('/signin', requireSignin, Authentication.signin);
```


## Defining protect routes
Sample route that requires JWT authentication.
```javascript
app.get('/', requireAuth, (req, res, next) => {
    res.send({ access: 'granted' });
});
```

---

## Sample request
### POST Request for '/signup'
```bash
curl -X POST \
  http://localhost:3090/signup \
  -H 'cache-control: no-cache' \
  -d '{
	"email":"me@me.com",
	"password": "test"
    }'
```

#### Response returns error or JWT depending if email is already in use
```json
{
    "error": "Email is in use."
}
```

or

```json
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1OWYzODQxYTY5MjFhYjI3ZWJlODY0NDciLCJpYXQiOjE1MDkxMzEyOTAzMzgsImVtYWlsIjoibWVAbWUyLmNvbSJ9.sLG8rCopHvDsFD_3eHeJ7Lja9vKYWNj1py4DrukBv8g"
}
```

---

### GET request for protected resource on path '/'
```bash
curl -X GET \
  http://localhost:3090/ \
  -H 'authorization: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1OWYzNmQwNzg5ZTYwNTFlN2FkZjY2ZTkiLCJpYXQiOjE1MDkxMjUzODMyMTQsImVtYWlsIjoiYnV0dHRlcjJAZXh4YW1wbGUuY29tIn0.sWrBHQ85ErGQF1lZ18qB8LGfKutAOgXifbb8yX9b0Ds' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
```

#### Response returns 'Unauthorized' or the protect resource depending on if the JWT sent was valid or not

```json
{
    "access": "granted"
}
```

---

### POST Request for '/signin'
```bash
curl -X POST \
  http://localhost:3090/signin \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
	"email":"me@me.com",
	"password": "test"
    }'
```

#### Response returns 'Unauthorized' or JWT
```json 
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1OWYzNzNlMjA1MWY0NzIyNTc0YWY1ZTkiLCJpYXQiOjE1MDkxMjg0MjczNTcsImVtYWlsIjoibWVAbWUuY29tIn0.XPFY88mQZUPSibLV6COdGeHtZf6ZoYp2NKV-cX0llw4"
}
```

---


