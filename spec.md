
import {GET} from parsers/http
import {WS} from parsers/ws

import basicAuth from auth/basic

import @/../../moduleName

env = dotenv("file_location")

@module JiraAPI 

@@baseurl = "https://jfid.disjd"

---
# @name JSON get request

GET baseurl/sfohs 
Auth Method : basicAuth(env.USERNAME,env.PASSWORD)
Request Body type (default type = JSON )
Request Body 

{
    "ofjsojds" : "sjso"
}

---
# @name WS binance

WS ws_url
auth 
message body type
message body


