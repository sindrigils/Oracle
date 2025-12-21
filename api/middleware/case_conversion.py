import json
import re

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request


def camel_to_snake(name: str) -> str:
    """Convert camelCase to snake_case."""
    return re.sub(r"(?<!^)(?=[A-Z])", "_", name).lower()


def convert_keys_to_snake(obj):
    """Recursively convert all keys in dict/list to snake_case."""
    if isinstance(obj, dict):
        return {camel_to_snake(k): convert_keys_to_snake(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [convert_keys_to_snake(item) for item in obj]
    return obj


class CaseConversionMiddleware(BaseHTTPMiddleware):
    """
    Middleware that converts incoming JSON request body keys from camelCase to snake_case
    """

    async def dispatch(self, request: Request, call_next):
        if request.method in ("POST", "PUT", "PATCH") and request.headers.get("content-type", "").startswith(
            "application/json"
        ):
            body = await request.body()
            if body:
                try:
                    data = json.loads(body)
                    converted = convert_keys_to_snake(data)
                    # Override request._body with converted data
                    request._body = json.dumps(converted).encode()
                except json.JSONDecodeError:
                    # If body isn't valid JSON, let it pass through
                    pass

        return await call_next(request)
