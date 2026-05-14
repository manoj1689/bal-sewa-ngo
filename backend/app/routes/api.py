"""
API router aggregator for versioned endpoints.
"""

from fastapi import APIRouter

from app.routes.auth import router as auth_router
from app.routes.blogs import router as blogs_router
from app.routes.campaigns import router as campaigns_router
from app.routes.contact import router as contact_router
from app.routes.dashboard import router as dashboard_router
from app.routes.documents import router as documents_router
from app.routes.donations import router as donations_router
from app.routes.events import router as events_router
from app.routes.gallery import router as gallery_router
from app.routes.testimonials import router as testimonials_router
from app.routes.uploads import router as uploads_router
from app.routes.users import router as users_router
from app.routes.volunteers import router as volunteers_router

router = APIRouter(prefix="/api/v1")

router.include_router(auth_router)
router.include_router(users_router)
router.include_router(donations_router)
router.include_router(campaigns_router)
router.include_router(volunteers_router)
router.include_router(blogs_router)
router.include_router(events_router)
router.include_router(gallery_router)
router.include_router(documents_router)
router.include_router(testimonials_router)
router.include_router(contact_router)
router.include_router(dashboard_router)
router.include_router(uploads_router)
