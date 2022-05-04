# CourseService API Reference

## Table Overview - Courses

| Key | Type |
| ------ | ------ |
| courseName | string

courseName = "{session} {department} {number} {session}"
- session is either "W" or "S"
- example: "W COMM 101 101"
## Requests

Requests should be made to the `/courses` endpoint.

### **GET Endpoint**

Your get request must include 4 URL params:
- `session`
- `department`
- `number`
- `section`

It will return a JSON in the following format:

`GET /courses?session=W&department=COMM&number=103&section=101`

Returns
```
Status Code: 200

{
    "courseName": "W COMM 103 101"
}
```
If course is not found in table, returns `404 response`.

### **POST Endpoint**

Your post request must include 4 params in the JSON body:
| Key | Type |
| ------ | ------ |
| session | string
| department | string
| number | string
| section | string (one of "W" or "S")

```
POST /courses

{
  session: S,
  department: COMM,
  number: 101,
  section: 101
}
```

Returns
```
Status Code: 200

"Added W COMM 101 101!"
```
**Note: It returns `success response` even when that course is already in the table.
