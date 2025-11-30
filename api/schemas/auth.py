from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    identifier: str
    password: str


class LoginResponse(BaseModel):
    token: str


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str


class RegisterResponse(BaseModel):
    success: bool


class LogoutResponse(BaseModel):
    success: bool
