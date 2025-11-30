from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    identifier: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    user: UserResponse


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str


class RegisterResponse(BaseModel):
    success: bool


class LogoutResponse(BaseModel):
    success: bool


class WhoAmIResponse(BaseModel):
    user: UserResponse | None
