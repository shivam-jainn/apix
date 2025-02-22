[] Description
[] CLI tool
[] Package manager
[] GraphQL package



We are creating a parser for our DSL 

from line 0 to until first "---" , we will use import statements , variables and declaring env files ( this is called memory section)
and from first "---" to next "---" , its a block of request (this is called request section)

in memory section , there will be import , where we take all the import lines and get the paths , and pull in all the file contents from all the paths which are ending with @/..... . This @ will be replaced by configParser , where @ is the base path 

@@varname = value : is variable , So we need to map the variable name and the value 

env_* = loadenv('env_file_path') will use loadenv from envParser and will give and env object

last but not the very least, any import statements that ends with parser/* .

now in this parser statements , assuming "import {GET} from parsers/http" , we will save GET in importedMethod = [] . 

import {GET} from parsers/http
import {WS} from parsers/ws

importedMethods = [GET,WS]

