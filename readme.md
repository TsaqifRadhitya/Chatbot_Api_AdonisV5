# Adonis 5 Boilerplate

## Key Feature Installed

- CRUD user & post using UUID
- example of hasMany relation _(user to post)_
- Using Mysql DB
- phc-argon2 _(Argon 2)_ for hashing password
- authenticated / jwt
- validation for register user & create, edit post with custom message

## Install & run

```bash
# install
$ npm install

# copy env.example to .env then edit file .env with your config
$ cp .env.example .env

# generate key
$ node ace generate:key

# run migration
$ node ace migration:run

# run project
$ node run dev
# or
$ node ace serve --watch
```

## After install

### Hit the API

- using postman, this link [postman collection](https://www.getpostman.com/collections/7b28359706e8e976b54a)
- look the [routes.ts](https://github.com/Tukizz/adonis5-boilerplate/blob/main/start/routes.ts) for knowing the endpoint

Happy Coding :)
