from n8n_py.handler import handle
from n8n_py import expose_function, String


@expose_function(
    "Hello World",
    "returns a friendly greeting",
    {
        "name": String(
            friendly_name="Name",
            description="Name of person to greet",
            required=True,
            default="Alice",
        )
    },
)
def hello_world(name: str) -> dict[str, str]:
    return {"greeting": f"Hello {name}!"}


handle()
