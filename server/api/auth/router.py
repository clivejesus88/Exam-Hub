from fastapi import APIRouter, HTTPException
from server.api.auth.schemas import LoginRequest, TokenResponse
from server.api.auth.service import authenticate_user

router = APIRouter(tags=["Auth"])

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest):
    token = authenticate_user(data.email. data.password)
    if not token:
        raise HTTPException(status_code=401, detail="Invlid credentials")
    return {"access_token": token}
