from typing import Union
from uuid import UUID


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from api.models import UserCreate, ShowUser, DeleteUserResponce
from db.dals import UserDAL
from db.session import get_db
from hashing import Hasher


user_router = APIRouter()

async def _create_new_user(body: UserCreate, session) -> ShowUser:
    async with session.begin():
        user_dal = UserDAL(session)                 # DAL- Data Access Layer, слой предоставляющий упрошенный доступ к данным в хранилище
        user = await user_dal.create_user(
            name = body.name,
            surname = body.surname,
            lastname = body.lastname,
            email = body.email,
            group = body.group,
            hashed_password = Hasher.get_password_hash(body.password)
        )
        return ShowUser(
            user_id = user.user_id,
            name = user.name,
            surname = user.surname,
            lastname = user.lastname,
            email = user.email,
            group = user.group,
            is_active= user.is_active,
            )


async def _delete_user(user_id, session) -> Union[UUID, None]:
        async with session.begin():
            user_dal = UserDAL(session)
            deleted_user_id = await user_dal.delete_user(
                user_id=user_id,
            )
            return deleted_user_id


async def _get_user_by_id(user_id, session) -> Union[ShowUser, None]:
    async with session.begin():
        user_dal = UserDAL(session)
        user = await user_dal.get_user_by_id(
            user_id=user_id,
        )
        if user is not None:
            return ShowUser(
                user_id = user.user_id,
                name = user.name,
                surname = user.surname,
                lastname = user.lastname,
                email = user.email,
                group = user.group,
                is_active= user.is_active, 
            )




@user_router.post("/", response_model=ShowUser)
async def create_user(body: UserCreate, db: AsyncSession = Depends(get_db)) -> ShowUser:
    return await _create_new_user(body, db)


@user_router.delete("/", response_model=DeleteUserResponce)
async def delete_user(user_id: UUID, db: AsyncSession = Depends(get_db)) -> DeleteUserResponce:
    delete_user_id = await _delete_user(user_id, db)
    if delete_user_id is None:
        raise HTTPException(status_code=404, detail=f"User with id {user_id} not found.")
    return DeleteUserResponce(delete_user_id=delete_user_id)


@user_router.get("/", response_model=ShowUser)
async def get_user_by_id(user_id: UUID, db: AsyncSession = Depends(get_db)) -> ShowUser:
    user = await _get_user_by_id(user_id, db)
    if user is None:
        HTTPException(status_code=404, detail=f"User with id {user_id} is not found.")
        return user


# Модуль handlers обрабатывает входящий запрос от пользователя