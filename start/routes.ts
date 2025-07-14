/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import router from '@ioc:Adonis/Core/Route'

router.group(() => {

  router.group(() => {
    router.get('/', 'ChatsController.index')
    router.get(':id', 'ChatsController.show')

    router.delete('/message/:id', 'ChatsController.destroyMessage')
    'ChatsController.destroy'
    router.delete(':id', 'ChatsController.destroy')
  }).prefix('conversation').middleware("auth_basic")

  router.post('questions', 'ChatsController.store')

}).prefix('api')

