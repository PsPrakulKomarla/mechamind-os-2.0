from app.core.security import verify_password, get_password_hash

hash_str = get_password_hash("qwertyuiop")
print("Hash:", hash_str)
valid = verify_password("qwertyuiop", hash_str)
print("Valid:", valid)
