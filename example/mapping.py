import json, sys, base64
from mapping_types import Function, CustomEncoder, OperationCommand

def h(): pass

functions = [
	Function("Hello World", "hello_world", "Say hello to the world", h),
 	Function("Parse Email", "parseEmail", "Parses an email's HTML body", h),
]

if len(sys.argv) == 2:
  command = OperationCommand(**json.loads(base64.b64decode(sys.argv[1])))
  print(command.command)
  print(command.data)

print(
	json.dumps(functions, cls=CustomEncoder)
)
