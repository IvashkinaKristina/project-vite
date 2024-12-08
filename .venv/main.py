from fastapi import APIRouter, FastAPI, HTTPException, Response, Depends
from authx import AuthX, AuthXConfig
from pydantic import BaseModel
import settings
from sqlalchemy import Column, Boolean, String
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.dialects.postgresql import UUID
import uuid
import re
from pydantic import BaseModel, EmailStr, field_validator, validator
import uvicorn 



################################
# Блок для взаимодействия с БД #
################################

engine = create_async_engine(settings.Real_DataBase_URL, future=True, echo=True)

async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


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
    


####################
# Блок API моделей #
####################

Letter_Match_Pattern = re.compile(r"^[а-яА-Яa-zA-Z]+$") #Паттерн, показывающий что имя/фамилия/отчество должно начинаться и заканчиваться с этой группы букв

class TunedModel(BaseModel):
    class Config:
        """говорит pydantic ковертировать все попадающие объекты в json"""

        from_attributes = True

class ShowUser(TunedModel):
    user_id: uuid.UUID
    name: str
    surname: str
    lastname: str
    email: EmailStr
    group: str
    is_active: bool

class UserCreate(BaseModel):
    name: str
    surname: str
    lastname: str
    email: EmailStr
    group: str

    @field_validator("name")
    def validate_name(cls, value):
        if not Letter_Match_Pattern.match(value):
            raise HTTPException(status_code=422, detail="Name should contains only letters")
        return value

    @field_validator("surname")
    def validate_surname(cls, value):
        if not Letter_Match_Pattern.match(value):
            raise HTTPException(status_code=422, detail="Surname should contains only letters")
        return value
    
    @field_validator("lastname")
    def validate_lastname(cls, value):
        if not Letter_Match_Pattern.match(value):
            raise HTTPException(status_code=422, detail="Lastname should contains only letters")
        return value
    



    
#####################
# Блок с API путями #
#####################


app = FastAPI(title="Платформа интеррактивных лекций")

user_router = APIRouter()

async def _create_new_user(body: UserCreate) -> ShowUser:
    async with async_session() as session:
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
async def create_user(body: UserCreate) -> ShowUser:
    return await _create_new_user(body)



main_api_router = APIRouter()  #Главный роутер, который собирает в себе все остальные роутеры

main_api_router.include_router(user_router, prefix="/user", tags=["user"])  #Передаем юзер роутер в главный роутер, с префиксом /user, дающим доступ к create_user
app.include_router(main_api_router)  #Передаю в приложение роуты


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)