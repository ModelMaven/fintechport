from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User
import uuid

def get_current_user(
    db: Session = Depends(get_db),
    authorization: str = Header(default=None)
) -> User:
    """
    Dependency to retrieve current user based on Clerk JWT (mocked for ease of execution/testing).
    """
    # For testing and demo purposes, we provision a default administrator user
    mock_clerk_id = "user_2T2z1xVwO8s2hMock"
    
    # Check if a custom token or ID is passed in headers
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        if token != "pk_test_mock" and len(token) > 10:
            mock_clerk_id = token

    user = db.query(User).filter(User.clerk_id == mock_clerk_id).first()
    if not user:
        user = User(
            id=uuid.uuid4(),
            email="developer@loancraft.ai",
            clerk_id=mock_clerk_id,
            role="admin"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return user

def get_current_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have administrative privileges"
        )
    return current_user
