### Getting started with flow.ai backend project

In this assigment we are going to develop node-js application to manage the transaction done by the user.

### Pre-requisites

<details>
<summary>Click to view</summary>
    -Pre-requisites required to run the project following packages to be install before execution.
    -sqlite, sqlite3, jsonwebtoken, bcrypt, bcryptjs, body-parser, dotenv, express, cors
    -to access the SQL database please go through the code once at begining you have import path and open from sqlite.
</details>

### Modeling users Table, Transaction Table, Categories Table

<details>
<summary>Click to view</summary>
    -All the Tables consist different according to the requirements and as stated in assignment
    -User Table includes name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL
    -Transactions Table includes id Auto increment INTEGER, user_id INTEGER, type TEXT check(income, expense), category INTEGER, amount INTEGER, date TEXT, description TEXT, foreign KEY used_id, foreign KEY category.
    -Categories Table inludes id Auto Increment, type Text, name TEXT.

</details>

### API End-points integration as per assignment

### Register Route

<details>
<summary>Click to view</summary>
    -/register, This path creates the user in users database you have to provide all the required fields to store the user's credential.
    -Mehtod POST
    - if you failed to mention all the field like name, email, password it will through error like "required all fields". 
    -on successful registration you will get users details along with jwt_token for detail overview please find the below image.
    <div style="text-align:center;margin:10px 0px 0px 45px;width:200px;">
        <img src="https://res.cloudinary.com/dwekbzmuw/image/upload/v1729618982/register_API_pmalsn.png"/>
    </div>

</details>

### Login Route

<details>
<summary>Click to view</summary>
- /login, This path retrives the user data from the database and matches the provides credentials againts the stored data you have to provide all the required fields to get the user's credential.
- Mehtod POST
- if you failed to mention all the field like name, email, password it will through error like "required all fields". 
- on successful registration you will get users details along with jwt_token for detail overview please find the below image.
<div style="text-align:center;margin:10px 0px 0px 45px;width:200px;">
    <img src="https://res.cloudinary.com/dwekbzmuw/image/upload/v1729618980/login_API_y1ppc5.png"/>
</div>

</details>

### Creating Transaction

<details>
<summary>Click to view</summary>
    - /transactions, This path stores the data provided by the user in the transactions you have to provide all the required fields like user_id, type, category, amount, date, description.
    - Mehtod POST
    - if you failed to mention all the field it will through error like "required all fields". 
    - on successful data updation you will get a response code or json message please find the below image.
    <div style="text-align:center;margin:10px 0px 0px 45px;width:200px;">
        <img src="https://res.cloudinary.com/dwekbzmuw/image/upload/v1729618980/creating_transaction_ksslvb.png"/>
    </div>

</details>

### Retrieving All Transaction

<details>
<summary>Click to view</summary>
    - /transactions, This path retrieves all the transactions from the trnsaction table we can add pagination to show the data according to the uses requirement
    - Mehtod GET
    - on successful request you will get a response in JSON format please find the below image.
    <div style="text-align:center;margin:10px 0px 0px 45px;width:200px;">
        <img src="https://res.cloudinary.com/dwekbzmuw/image/upload/v1729618980/all_transactions_a9dtl3.png"/>
    </div>

</details>

### Retrieving Specific Transaction

<details>
<summary>Click to view</summary>
    - /transactions/:id, This path retrieves the specific transactions according to the id provided by the user from the trnsaction table in order to access the exact data you have to parse id carefully via api to get the expected result.
    - Mehtod GET
    -on successful request you will get a response in JSON format please find the below image.
    <div style="text-align:center;margin:10px 0px 0px 45px;width:200px;">
        <img src="https://res.cloudinary.com/dwekbzmuw/image/upload/v1729618980/specific_transaction_xgvssl.png"/>
    </div>

</details>

### Updating Specific Transaction

<details>
<summary>Click to view</summary>
    - /transactions/:id, This path updated the specific transactions according to the id provided by the user from the trnsaction table we.
    - Mehtod PUT
    - we have to set the updated input field againts the data which are present in the table
    - on successful request you will get a response message please find the below image.
    <div style="text-align:center;margin:10px 0px 0px 45px;width:200px;">
        <img src="https://res.cloudinary.com/dwekbzmuw/image/upload/v1729618980/updating_transaction_malymt.png"/>
    </div>

</details>

### Deleting Specific Transaction

<details>
<summary>Click to view</summary>
    - /transactions/:id, This path deletes the specific transactions according to the id provided by the user from the trnsaction table we.
    - Mehtod DELETE
    - on successful request you will get a response message please find the below image.
    <div style="text-align:center;margin:10px 0px 0px 45px;width:200px;">
        <img src="https://res.cloudinary.com/dwekbzmuw/image/upload/v1729618980/deleting_specific_transactions_lxzcgj.png"/>
    </div>

</details>
