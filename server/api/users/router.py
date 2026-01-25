from fastapi import APIRouter, Depends
from server.core.dependencies import get_current_user

router = APIRouter(tags=["Users"])

@router.get("/me")
def get_me(user_id: str = Depends(get_current_user)):
    return {"id": user_id}