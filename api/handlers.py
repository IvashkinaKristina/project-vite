from typing import Union
from uuid import UUID
from logging import getLogger


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession


from db.session import get_db
from db.models import User
from api.actions.user import _create_new_user
from api.actions.user import _delete_user
from api.actions.user import _get_user_by_id
from api.actions.user import _update_user
from api.actions.user import check_user_permissions
from api.actions.auth import get_current_user_from_token

from api.schemas import UserCreate
from api.schemas import ShowUser
from api.schemas import DeleteUserResponce
from api.schemas import UpdateUserRequest
from api.schemas import UpdatedUserResponce


logger = getLogger(__name__)

user_router = APIRouter()



@user_router.post("/", response_model=ShowUser)
async def create_user(body: UserCreate, db: AsyncSession = Depends(get_db)) -> ShowUser:
    return await _create_new_user(body, db)



@user_router.delete("/", response_model=DeleteUserResponce)
async def delete_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token),
) -> DeleteUserResponce:
    user_for_deletion = await _get_user_by_id(user_id, db)
    if user_for_deletion is None:
        raise HTTPException(
            status_code=404, detail=f"User with id {user_id} not found."
        )
    if not check_user_permissions(
        target_user=user_for_deletion,
        current_user=current_user,
    ):
        raise HTTPException(status_code=403, detail="Forbidden.")
    deleted_user_id = await _delete_user(user_id, db)
    if deleted_user_id is None:
        raise HTTPException(
            status_code=404, detail=f"User with id {user_id} not found."
        )
    return DeleteUserResponce(deleted_user_id=deleted_user_id)



@user_router.patch("/", response_model=UpdatedUserResponce)
async def update_user_by_id(
    user_id: UUID,
    body: UpdateUserRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token),
) -> UpdatedUserResponce:
    updated_user_params = body.model_dump(exclude_none=True)  #dict -> model_dump
    if updated_user_params == {}:
        raise HTTPException(
            status_code=422,
            detail="At least one parameter for user update info should be provided",
        )
    user_for_update = await _get_user_by_id(user_id, db)
    if user_for_update is None:
        raise HTTPException(
            status_code=404, detail=f"User with id {user_id} not found."
        )
    if user_id != current_user.user_id:
        if check_user_permissions(
            target_user=user_for_update, current_user=current_user
        ):
            raise HTTPException(status_code=403, detail="Forbidden.")
    try:
        updated_user_id = await _update_user(
            updated_user_params=updated_user_params, session=db, user_id=user_id
        )
    except IntegrityError as err:
        logger.error(err)
        raise HTTPException(status_code=503, detail=f"Database error: {err}")
    return UpdatedUserResponce(updated_user_id=updated_user_id)


@user_router.patch("/", response_model=UpdatedUserResponce)
async def update_user_by_id(
    user_id: UUID,
    body: UpdateUserRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token),
) -> UpdatedUserResponce:
    updated_user_params = body.dict(exclude_none=True)
    if updated_user_params == {}:
        raise HTTPException(
            status_code=422,
            detail="At least one parameter for user update info should be provided",
        )
    user = await _get_user_by_id(user_id, db)
    if user is None:
        raise HTTPException(
            status_code=404, detail=f"User with id {user_id} not found"
        )
    try:
        updated_user_id = await _update_user(
            updated_user_params=updated_user_params, session=db, user_id=user_id
        )
    except IntegrityError as err:
        logger.error(err)
        raise HTTPException(status_code=503, detail=f"Database error: {err}")
    return UpdatedUserResponce(updated_user_id=updated_user_id)


@user_router.get("/me", response_model=ShowUser)
async def get_current_user_info(
    current_user: User = Depends(get_current_user_from_token),
) -> ShowUser:
    return ShowUser(
        user_id=current_user.user_id,
        name=current_user.name,
        surname=current_user.surname,
        email=current_user.email,
        is_active=current_user.is_active,
    )




# Модуль handlers обрабатывает входящий запрос от пользователя