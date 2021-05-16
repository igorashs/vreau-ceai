# API endpoints

## User

```bash
# POST user login
/api/users/login
```

```bash
# POST a new user
/api/users/signup
```

```bash
# POST logout user
/api/users/logout
```

```bash
# GET an user by email (auth Admin)
/api/users?search=<USER_EMAIL>
```

```bash
# PUT an updated user by id (auth Admin)
/api/users/:id
```

```bash
# DELETE an user by id (auth Admin) (not implemented)
/api/users/:id
```

## Category

```bash
# GET all categories
/api/categories/
```

```bash
# POST a new category (auth Manager)
/api/categories/
```

```bash
# GET categories by name
/api/categories?search=<CATEGORY_NAME>
```

```bash
# PUT an updated category by id (auth Manager)
/api/categories/:id
```

```bash
# DELETE a category by id (auth Manager)
/api/categories/:id
```

## Product

```bash
# GET products
# filter = ascPrice | descPrice | ascQuantity | descQuantity | recommend
# offset
# limit
/api/products?filter=ascPrice+descQuantity&limit=10
```

```bash
# GET recommended products
# recommended
# offset
# limit
/api/products?recommended=true
```

```bash
# POST a new product (auth Manager)
/api/products/create
```

```bash
# GET products by category name
# filter = ascPrice | descPrice | ascQuantity | descQuantity | recommend
# offset
# limit
/api/products?search=<CATEGORY_NAME>&byCategory=true
```

```bash
# GET products by name
/api/products?search=<PRODUCT_NAME>
```

```bash
# PUT an updated product by id (auth Manager)
/api/products/update/:id
```

```bash
# DELETE a product by id (auth Manager)
/api/products/delete/:id
```

## Order

```bash
# GET orders (auth Manager)
# filter = processing | inDelivery | canceled | completed | lastOrdered | firstOrdered (date)
# offset
# limit
/api/orders?filter=processing+canceled
```

```bash
# GET an order by order number (auth Manager)
/api/orders?search=<ORDER_NUMBER>
```

```bash
# GET orders by user id  (auth User)
/api/orders?search=<USER_ID>&byUserId=true
```

```bash
# GET orders by user email  (auth Manager)
/api/orders?search=<USER_EMAIL>&byUserEmail=true
```

```bash
# POST new order  (auth User)
/api/orders/create
```

```bash
# PUT an updated order by id (auth Manager)
/api/orders/update/:id
```

```bash
# DELETE an order by id (auth user (completed | canceled) | auth Manager)
/api/orders/delete/:id
```
