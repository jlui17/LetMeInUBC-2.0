# Tracking Service API Reference

## Table Overview - Tracking

| Key Type | Key Name | Type |
| ------ | ------ | ------ |
| Partition Key | courseName | string |
| Sort Key | email | string |

### Tracking GSI - Email Index

| Key Type | Key Name | Type |
| ------ | ------ | ------ |
| Partition Key | email | string |
| Sort Key | courseName | string |

courseName = "{session} {department} {number} {session}"
- session is either "W" or "S"
- example: "W COMM 101 101"

email = "username@domain.com"
- example: "notify@letmein.com"

## Requests

Requests should be made to the `/tracking` endpoint.

### **GET Endpoint**

Your get request must include 1 URL param, followed by mandatory context params:
- `key`
  - one of:
    - "courseName"
    - "email"

When the `key` is `"courseName"`, the request must include the following params:
- `session`
- `department`
- `number`
- `section`

When the `key` is `"email"`, the request must include the following params:
- `email`

It will return a JSON in the following format:

`GET /tracking?key=courseName&session=W&department=COMM&number=103&section=101`

Returns
```
Status Code: 200

[
  {
    "email": "test@test.com"
  },
  {
    "email": "test1@test1.com"
  }
]
```
`GET /tracking?key=email&email=test@test.com`

Returns
```
Status Code: 200

[
  {
    "courseName": "W COMM 101 101"
  },
  {
    "courseName": "W COMM 101 102"
  }
]
```

If course is not found in table, returns `404 response`.

### **POST Endpoint**

Your post request must include 5 params in the JSON body:
| Key | Type |
| ------ | ------ |
| session | string
| department | string
| number | string
| section | string (one of "W" or "S")
| email | string

```
POST /tracking

{
  session: S,
  department: COMM,
  number: 101,
  section: 101,
  email: test@test.com
}
```

Returns
```
Status Code: 200

"test@test.com is now tracking S COMM 101 101!"
```
**Note: It returns `success response` even when that course is already in the table.

### **DELETE Endpoint**

Your post request must include 5 params in the JSON body:
| Key | Type |
| ------ | ------ |
| session | string
| department | string
| number | string
| section | string (one of "W" or "S")
| email | string

```
DELETE /tracking

{
  session: S,
  department: COMM,
  number: 101,
  section: 101,
  email: test@test.com
}
```

Returns
```
Status Code: 200

"test@test.com is not tracking S COMM 101 101 anymore!"
```
**Note: It returns `success response` even when that course is already in the table.
