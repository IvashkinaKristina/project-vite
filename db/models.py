import uuid


from sqlalchemy import Column, String, Boolean
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import declarative_base



######################
# Блок с моделями БД #
######################

Base = declarative_base() 

class User(Base):
    __tablename__ = "users"

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    surname = Column(String, nullable=False)
    lastname = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    group = Column(String, nullable=False)
    is_active = Column(Boolean(), default=True) #Активен ли пользователь(удален или нет)
    hashed_password = Column(String, nullable=False)
    roles = Column(ARRAY(String), nullable=False)

    # Модель для работы с БД (SQLAlchemy)