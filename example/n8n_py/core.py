from enum import Enum, auto
from datetime import datetime
from dataclasses import dataclass, field


class ArgumentType(str, Enum):
    STRING = "string"
    NUMBER = "number"
    BOOLEAN = "boolean"
    OPTIONS = "options"
    MULTI_OPTIONS = "multi_options"


@dataclass(kw_only=True)
class Argument:
    friendly_name: str
    description: str
    required: bool = False
    name: str = field(init=False)
    owner: str = field(init=False)
    type: ArgumentType = field(init=False)


@dataclass(kw_only=True)
class String(Argument):
    default: str
    placeholder: str = ""
    type = ArgumentType.STRING


@dataclass(kw_only=True)
class Number(Argument):
    minimum: int | None = None
    maximum: int | None = None
    precision: int = 1
    default: int
    type = ArgumentType.NUMBER


@dataclass(kw_only=True)
class Boolean(Argument):
    default: bool
    type = ArgumentType.BOOLEAN


@dataclass(kw_only=True)
class Options(Argument):
    enum: Enum
    default: any
    type = ArgumentType.OPTIONS


@dataclass(kw_only=True)
class MultiOptions(Argument):
    enum: Enum
    default: list[any]
    type = ArgumentType.MULTI_OPTIONS


class Function:
    friendly_name: str
    name: str
    description: str
    arguments: list[Argument] = []
    func: callable

    def serialize(self) -> dict[str, any]:
        new_self = self
        new_self.func = ""
        new_self.arguments = []
        return new_self.__dict__


_functions: list[Function] = []


def expose_function(
    friendly_name: str, description: str, arguments=dict[str, Argument]
):
    def decorator(func):
        func_ = Function()
        func_.name = func.__name__
        func_.friendly_name = friendly_name
        func_.description = description
        for param in arguments.keys():
            arg: Argument = arguments[param]
            arg.name = param
            arg.owner = func_.name
            func_.arguments.append(arg)
        func_.arguments = [arg for arg in func_.arguments if arg.owner == func_.name]
        func_.func = func

        _functions.append(func_)

        return func

    return decorator


def list_functions() -> list[Function]:
    return _functions
