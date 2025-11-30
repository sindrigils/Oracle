from pydantic_settings import BaseSettings
from typing import Optional

DAY = 3600 * 24


class Settings(BaseSettings):
    database_url: str = "postgresql://oracle:oracle@localhost:5434/oracle"
    session_token_expiration_time: int = DAY * 60
    session_refresh_threshold: int = DAY * 7  # Refresh if within 7 days of expiry

    # Cookie settings
    session_cookie_name: str = "oracle_session"
    cookie_secure: bool = False  # Set True in production (HTTPS only)
    cookie_samesite: str = "lax"
    cookie_domain: Optional[str] = None  # None = current domain only

    # CORS
    frontend_url: str = "http://localhost:3000"


settings = Settings()
