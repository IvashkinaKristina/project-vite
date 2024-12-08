from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from api.models import UserCreate, ShowUser
from db.dals import UserDAL
from db.session import get_db

user_router = APIRouter()

async def _create_new_user(body: UserCreate, db) -> ShowUser:
    async with db() as session:
        async with session.begin():
            user_dal = UserDAL(session)                 # DAL- Data Access Layer, слой предоставляющий упрошенный доступ к данным в хранилище
            user = await user_dal.create_user(
                name = body.name,
                surname = body.surname,
                lastname = body.lastname,
                email = body.email,
                group = body.group,
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


@user_router.post("/", response_model=ShowUser)
async def create_user(body: UserCreate, db: AsyncSession = Depends(get_db)) -> ShowUser:
    return await _create_new_user(body, db)


# Модуль handlers обрабатывает входящий запрос от пользователя