from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1 import v1_router
from middleware.session_refresh import SessionRefreshMiddleware
from core.config import settings
from models import *


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(SessionRefreshMiddleware)

app.include_router(v1_router, prefix="/api")
