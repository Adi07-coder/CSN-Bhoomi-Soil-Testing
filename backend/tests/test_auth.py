"""
Authentication & Security Unit Tests for AI Bhoomi
"""
import pytest
from app.core.security import hash_password, verify_password, create_access_token, decode_token

def test_password_hashing():
    raw_password = "SecureFarmerPass@2026"
    hashed = hash_password(raw_password)
    assert hashed != raw_password
    assert verify_password(raw_password, hashed) is True
    assert verify_password("WrongPassword", hashed) is False

def test_jwt_token_generation_and_decoding():
    user_id = "test-farmer-uuid-1234"
    token = create_access_token(user_id)
    payload = decode_token(token)
    assert payload["sub"] == user_id
    assert payload["type"] == "access"
    assert "exp" in payload
