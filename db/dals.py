from typing import Union
from uuid import UUID
from enum import Enum

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import update, and_, select


from db.models import User




##########################################
# Блок взаимодействия бизнес логики с БД #
##########################################


class PortalRole(str, Enum):
    ROLE_PORTAL_USER = "ROLE_PORTAL_USER"
    ROLE_PORTAL_ADMIN = "ROLE_PORTAL_ADMIN"
    ROLE_PORTAL_SUPERADMIN = "ROLE_PORTAL_SUPERADMIN"


class UserDAL:
    """Создание/удаление/взаимодействие с пользователем"""
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session


    async def create_user(
            self, name:str, surname:str, lastname:str, email:str, group:str, hashed_password: str, roles: list[PortalRole]
            ) -> User:
        new_user = User(
            name = name,
            surname = surname,
            lastname = lastname,
            email = email,
            group = group,
            hashed_password=hashed_password,
            roles = roles
            )
        self.db_session.add(new_user)
        await self.db_session.flush()
        return new_user
    

    async def delete_user(self, user_id: UUID) -> Union[UUID, None]:
        query = update(User).where(and_(User.user_id == user_id, User.is_active == True)).values(is_active=False).returning(User.user_id)
        res = await self.db_session.execute(query)
        deleted_user_id_row = res.fetchone()
        if deleted_user_id_row is not None:
            return deleted_user_id_row[0]
        
    
    async def get_user_by_id(self, user_id: UUID) -> Union[UUID, None]:
        query = select(User).where(User.user_id==user_id)
        res = await self.db_session.execute(query)
        user_row = res.fetchone()
        if user_row is None:
            return user_row[0]
        

    async def get_user_by_email(self, email: str) -> Union[User, None]:
        query = select(User).where(User.email==email)
        res = await self.db_session.execute(query)
        user_row = res.fetchone()
        if user_row is not None:
            return user_row[0]


    async def update_user(self, **kwargs) -> Union[UUID, None]:
        query = update(User).where(User.is_active == True).values(kwargs).returning(User.user_id)
        res = await self.db_session.execute(query)
        update_user_id_row = res.fetchone()
        if update_user_id_row is not None:
            return update_user_id_row[0]