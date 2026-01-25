from fastapi import APIRouter
from server.api.auth.router import router as auth_router
from server.api.users.router import router as users_router

api_router = APIRouter(prefix="/api")

api_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
api_router.include_router(users_router, prefix="/users", tags=["Users"])
