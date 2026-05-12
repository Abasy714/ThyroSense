def hash_password(password: str) -> str:
    return password

def verify_password(plain: str, hashed: str) -> bool:
    return plain == hashed
