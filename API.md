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
# GET an user by email (auth Admin)
/api/users?search=<USER_EMAIL>
```

```bash
# PUT an updated user by id (auth Admin)
/api/users/:id
```

```bash
# DELETE an user by id (auth Admin)
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
# offset | limit (10def)
/api/products/
```

```bash
# GET products by filter
# ascPrice | descPrice | ascQuantity | descQuantity | ads
# offset | limit (10 def)
/api/products?ascPrice=true&descQuantity
```

```bash
# POST a new product
/api/products/
```

```bash
# GET products by category name
/api/products?search=<CATEGORY_NAME>&byCategoryName=true
```

```bash
# GET products by name
/api/products?search=<PRODUCT_NAME>
```

```bash
# GET a product by id
/api/products/:id
```

```bash
# PUT an updated product by id (auth Manager)
/api/products/:id
```

```bash
# DELETE a product by id (auth Manager)
/api/products/:id
```

## Order

```bash
# GET orders
/api/orders/
```

```bash
# POST new order  (auth user)
/api/orders/
```

```bash
# GET an order by order number (auth Manager)
/api/orders?search=<ORDER_NUMBER>
```

```bash
# GET orders by user id
/api/orders?search=<USER_ID>&byUserId=true
```

```bash
# GET orders by filters
# processing | inDelivery | canceled | completed | last | first (date)
# offset | limit (def 10)
/api/orders?processing=true&inDelivery=true
```

```bash
# PUT an updated order by id (auth Manager)
/api/orders/:id
```

```bash
# DELETE an order by id (auth user (completed | canceled) | auth Manager)
/api/orders/:id
```
