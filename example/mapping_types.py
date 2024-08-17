import json
from enum import Enum, auto

class CustomEncoder(json.JSONEncoder):
  def default(self, obj):
    if hasattr(obj, "__json__"):
      return obj.__json__()
    return super().default(obj)

class Function:
  friendlyName: str
  name: str
  description: str
  function: callable

  def __init__(self, friendlyName: str,  name: str, description: str, function: callable):
    self.friendlyName = friendlyName
    self.name = name
    self.description = description
    self.function = function

  def __json__(self):
    dct = self.__dict__
    dct["function"] = self.function.__name__
    return dct

class OperationMode(Enum):
	OUTPUT = auto()
	ARGUMENTS = auto()
	EXECUTE = auto()

class Command(Enum):
  GET_ARGUMENTS = auto()
  EXECUTE = auto()

class OperationCommand:
  command: Command
  data: dict

  def __init__(self, command: str, data: dict) -> None:
    self.command = Command[command]
    self.data = data
