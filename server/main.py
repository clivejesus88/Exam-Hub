from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import timedelta
from sqlalchemy.orm import Session
from core.security import verify_password, get_password_hash, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from db import models, database

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Exam Hub API")

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://localhost:5173", # Vite default
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed Data
@app.on_event("startup")
def startup_event():
    db = database.SessionLocal()
    user = db.query(models.User).filter(models.User.email == "test@example.com").first()
    if not user:
        hashed_password = get_password_hash("password")
        db_user = models.User(email="test@example.com", hashed_password=hashed_password)
        db.add(db_user)
        db.commit()
    db.close()

class Token(BaseModel):
    access_token: str
    token_type: str

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    
    if not user:
        # Auto-register new user
        hashed_password = get_password_hash(form_data.password)
        user = models.User(email=form_data.username, hashed_password=hashed_password)
        db.add(user)
        db.commit()
        db.refresh(user)
    elif not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/")
async def root():
    return {"message": "Exam Hub API is running"}