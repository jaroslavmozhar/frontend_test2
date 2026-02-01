from fastapi import APIRouter, HTTPException, status
from typing import List
from datetime import datetime
import logging

from models.series import SeriesBase, SeriesCreate, SeriesUpdate

logger = logging.getLogger(__name__)

# Створюємо окремі роутери для архіву та списку бажань
series_router = APIRouter(prefix="/series", tags=["Series Archive"])
wishlist_router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


def get_db():
    """Helper для отримання db з app state"""
    from server import db
    return db


# ============ SERIES ARCHIVE ENDPOINTS ============

@series_router.get("", response_model=List[SeriesBase])
async def get_all_series():
    """Отримати всі серіали з архіву"""
    try:
        db = get_db()
        series_list = await db.series_archive.find().to_list(1000)
        
        # Конвертуємо _id в string і видаляємо MongoDB _id
        result = []
        for s in series_list:
            s.pop('_id', None)
            s.pop('created_at', None)
            s.pop('updated_at', None)
            result.append(s)
        
        logger.info(f"📦 Retrieved {len(result)} series from archive")
        return result
    except Exception as e:
        logger.error(f"❌ Error getting series: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@series_router.post("", response_model=SeriesBase, status_code=status.HTTP_201_CREATED)
async def create_series(series: SeriesCreate):
    """Додати новий серіал до архіву"""
    try:
        db = get_db()
        
        # Додаємо timestamps
        series_dict = series.dict()
        series_dict['created_at'] = datetime.utcnow()
        series_dict['updated_at'] = datetime.utcnow()
        
        result = await db.series_archive.insert_one(series_dict)
        
        logger.info(f"✅ Created series: {series.title} (id: {series.id})")
        
        # Повертаємо без MongoDB _id
        series_dict.pop('_id', None)
        series_dict.pop('created_at', None)
        series_dict.pop('updated_at', None)
        return series_dict
    except Exception as e:
        logger.error(f"❌ Error creating series: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@series_router.put("/{series_id}", response_model=SeriesBase)
async def update_series(series_id: str, series: SeriesUpdate):
    """Оновити серіал в архіві"""
    try:
        db = get_db()
        
        # Оновлюємо timestamp
        series_dict = series.dict()
        series_dict['updated_at'] = datetime.utcnow()
        
        result = await db.series_archive.replace_one(
            {"id": series_id},
            series_dict
        )
        
        if result.matched_count == 0:
            logger.warning(f"⚠️ Series not found: {series_id}")
            raise HTTPException(status_code=404, detail="Series not found")
        
        logger.info(f"✅ Updated series: {series.title} (id: {series_id})")
        
        # Повертаємо без timestamps
        series_dict.pop('updated_at', None)
        series_dict.pop('created_at', None)
        return series_dict
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error updating series: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@series_router.delete("/{series_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_series(series_id: str):
    """Видалити серіал з архіву"""
    try:
        db = get_db()
        
        result = await db.series_archive.delete_one({"id": series_id})
        
        if result.deleted_count == 0:
            logger.warning(f"⚠️ Series not found: {series_id}")
            raise HTTPException(status_code=404, detail="Series not found")
        
        logger.info(f"✅ Deleted series: {series_id}")
        return None
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error deleting series: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============ WISHLIST ENDPOINTS ============

@wishlist_router.get("", response_model=List[SeriesBase])
async def get_wishlist():
    """Отримати всі серіали зі списку бажань"""
    try:
        db = get_db()
        wishlist = await db.series_wishlist.find().to_list(1000)
        
        result = []
        for s in wishlist:
            s.pop('_id', None)
            s.pop('created_at', None)
            s.pop('updated_at', None)
            result.append(s)
        
        logger.info(f"📦 Retrieved {len(result)} series from wishlist")
        return result
    except Exception as e:
        logger.error(f"❌ Error getting wishlist: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@wishlist_router.post("", response_model=SeriesBase, status_code=status.HTTP_201_CREATED)
async def create_wishlist_item(series: SeriesCreate):
    """Додати серіал до списку бажань"""
    try:
        db = get_db()
        
        series_dict = series.dict()
        series_dict['created_at'] = datetime.utcnow()
        series_dict['updated_at'] = datetime.utcnow()
        
        result = await db.series_wishlist.insert_one(series_dict)
        
        logger.info(f"✅ Added to wishlist: {series.title} (id: {series.id})")
        
        series_dict.pop('_id', None)
        series_dict.pop('created_at', None)
        series_dict.pop('updated_at', None)
        return series_dict
    except Exception as e:
        logger.error(f"❌ Error creating wishlist item: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@wishlist_router.put("/{series_id}", response_model=SeriesBase)
async def update_wishlist_item(series_id: str, series: SeriesUpdate):
    """Оновити серіал у списку бажань"""
    try:
        db = get_db()
        
        series_dict = series.dict()
        series_dict['updated_at'] = datetime.utcnow()
        
        result = await db.series_wishlist.replace_one(
            {"id": series_id},
            series_dict
        )
        
        if result.matched_count == 0:
            logger.warning(f"⚠️ Wishlist item not found: {series_id}")
            raise HTTPException(status_code=404, detail="Wishlist item not found")
        
        logger.info(f"✅ Updated wishlist: {series.title} (id: {series_id})")
        
        series_dict.pop('updated_at', None)
        series_dict.pop('created_at', None)
        return series_dict
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error updating wishlist item: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@wishlist_router.delete("/{series_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_wishlist_item(series_id: str):
    """Видалити серіал зі списку бажань"""
    try:
        db = get_db()
        
        result = await db.series_wishlist.delete_one({"id": series_id})
        
        if result.deleted_count == 0:
            logger.warning(f"⚠️ Wishlist item not found: {series_id}")
            raise HTTPException(status_code=404, detail="Wishlist item not found")
        
        logger.info(f"✅ Deleted from wishlist: {series_id}")
        return None
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error deleting wishlist item: {e}")
        raise HTTPException(status_code=500, detail=str(e))
