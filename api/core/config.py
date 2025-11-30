from pydantic_settings import BaseSettings

DAY = 3600 * 24


class Settings(BaseSettings):
    database_url: str = "postgresql://oracle:oracle@localhost:5434/oracle"
    session_token_expiration_time: int = DAY * 60


settings = Settings()
