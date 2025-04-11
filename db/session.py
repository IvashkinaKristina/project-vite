from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

import settings

# Создаём асинхронный движок
engine = create_async_engine(settings.Real_DataBase_URL, future=True, echo=True)

# Создаём фабрику асинхронных сессий
async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

# Функция для получения сессии
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:  # Используем асинхронный контекст
        try:
            yield session  # Возвращаем сессию
        finally:
            await session.close()  # Закрываем сессию после использования