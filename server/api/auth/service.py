from server.core.security import verify_password, create_access_token

def authenticate_user(email: str, password: str):
    user = {"id": "1", "email": "admin@test.com", "password": "HASH"}
    if not verify_password(password, user["password"]):
        return None
    return create_access_token(user["id"])
