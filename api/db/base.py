from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, DateTime, Integer, event
from datetime import datetime
import hashlib


class Base(declarative_base()):
    __abstract__ = True
    id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True,
    )
    short_id = Column(
        String,
        index=True,
        unique=True,
        nullable=True,
    )
    created_at = Column(DateTime, default=datetime.now())
    updated_at = Column(DateTime, default=datetime.now())


def generate_short_id(table_name: str, id_value: int) -> str:
    """
    Generate a unique short_id based on table name and primary key.
    Uses SHA256 hash of table_name + str(id) and takes first 7 characters.
    """
    # Create a hash of table_name + id to ensure uniqueness
    hash_input = f"{table_name.lower()}_{id_value}"
    hash_obj = hashlib.sha256(hash_input.encode())
    hash_hex = hash_obj.hexdigest()

    # Take first 7 characters and ensure it's alphanumeric
    short_id = hash_hex[:7].upper()
    return short_id


@event.listens_for(Base, "after_insert")
def set_short_id_after_insert(mapper, connection, target):
    """Set the short_id after the record is inserted and has an ID"""
    if not target.short_id and target.id:
        table_name = target.__tablename__
        short_id = generate_short_id(table_name, target.id)

        # Update the record with the generated short_id
        connection.execute(
            mapper.mapped_table.update()
            .where(mapper.mapped_table.c.id == target.id)
            .values(short_id=short_id)
        )

        # Update the object instance
        target.short_id = short_id
