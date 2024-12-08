from envparse import Env

env = Env()


Real_DataBase_URL = env.str(
    "Real_DataBase_URL",
    default ="postgresql+asyncpg://postgres:postgres@localhost:5432/postgres"
) 

#Строка подключения к базе данных  
  #postgres(логин):postgres(пароль)@0.0.0.0:5432/postgres(название БД)