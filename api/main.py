from core.config import settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from middleware.case_conversion import CaseConversionMiddleware
from middleware.session_refresh import SessionRefreshMiddleware
from models import *

from api.v1 import v1_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(SessionRefreshMiddleware)
app.add_middleware(CaseConversionMiddleware)

app.include_router(v1_router, prefix="/api")
