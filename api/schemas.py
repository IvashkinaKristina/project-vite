import re
import uuid
from typing import Optional

from fastapi import HTTPException
from pydantic import BaseModel, EmailStr, field_validator, constr


####################
# Блок API моделей #
####################

Letter_Match_Pattern = re.compile(r"^[а-яА-Яa-zA-Z]+$")     # Паттерн следящий что бы имя/фамилия/отчество начинались и заканчивались из этой группы букв



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
    password: str


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
    
class Token(BaseModel):
    access_token:str
    token_type: str
    

class DeleteUserResponce(BaseModel):
    deleted_user_id: uuid.UUID


class UpdatedUserResponce(BaseModel):
    updated_user_id: uuid.UUID


class UpdateUserRequest(BaseModel):
    name: Optional[constr(min_length=1)]
    surname: Optional[constr(min_length=1)]
    email: Optional[EmailStr]

# Модуль хранит модели которые относятся к обработке ЗАПРОСА(pydantic)