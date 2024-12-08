from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

import settings



################################
# Блок для взаимодействия с БД #
################################

engine = create_async_engine(settings.Real_DataBase_URL, future=True, echo=True)

async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def get_db() -> AsyncGenerator:
    try: 
        session: AsyncSession = async_session()
        yield session
    finally:
        await session.close()