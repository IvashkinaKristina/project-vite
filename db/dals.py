from sqlalchemy.ext.asyncio import AsyncSession


from db.models import User




##########################################
# Блок взаимодействия бизнес логики с БД #
##########################################


class UserDAL:
    """Создание/удаление/взаимодействие с пользователем"""
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session


    async def create_user(
            self, name:str, surname:str, lastname:str, email:str, group:str
            ) -> User:
        new_user = User(
            name = name,
            surname = surname,
            lastname = lastname,
            email = email,
            group = group,
            )
        self.db_session.add(new_user)
        await self.db_session.flush()
        return new_user