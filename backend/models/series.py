from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class Note(BaseModel):
    """Нотатка від слідчого"""
    author: str  # "Maria" or "Yaroslav"
    text: str
    timestamp: str  # ISO format


class SeriesBase(BaseModel):
    """Базова модель серіалу"""
    id: str
    title: str
    watched: bool = False
    rating: int = Field(default=0, ge=0, le=10)
    notes: List[Note] = []


class SeriesCreate(SeriesBase):
    """Модель для створення серіалу"""
    pass


class SeriesUpdate(SeriesBase):
    """Модель для оновлення серіалу"""
    pass


class SeriesInDB(SeriesBase):
    """Модель серіалу в базі даних"""
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
