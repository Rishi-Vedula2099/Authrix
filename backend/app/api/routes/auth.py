from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password, verify_password, create_access_token, get_current_user
from app.db.session import get_db
from app.db.crud import get_user_by_email, create_user
from app.db.models import User
from app.schemas.user import UserCreate, UserLogin, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    """Register a new user account."""
    # Check if email already exists
    existing = await get_user_by_email(db, user_data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    # Create user
    hashed_pw = hash_password(user_data.password)
    user = await create_user(db, user_data.email, hashed_pw)

    # Create JWT and set cookie
    token = create_access_token(data={"sub": str(user.id)})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=86400,  # 24 hours
        samesite="lax",
        secure=False,  # Set True in production with HTTPS
    )

    return user


@router.post("/login", response_model=UserResponse)
async def login(
    user_data: UserLogin,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    """Log in with email and password."""
    user = await get_user_by_email(db, user_data.email)
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    token = create_access_token(data={"sub": str(user.id)})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=86400,
        samesite="lax",
        secure=False,
    )

    return user


@router.post("/logout")
async def logout(response: Response):
    """Log out by clearing the auth cookie."""
    response.delete_cookie(key="access_token")
    return {"detail": "Successfully logged out."}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get the current authenticated user's profile."""
    return current_user
