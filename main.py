from fastapi import FastAPI
import uvicorn
from fastapi.routing import APIRouter


from api.handlers import user_router
from api.login_handler import login_router
    
#####################
# Блок с API путями #
#####################

import bcrypt
import passlib

# Фикс для отсутствующего __about__
if not hasattr(bcrypt, '__about__'):
    bcrypt.__about__ = type('obj', (object,), {'__version__': '3.2.0'})

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Платформа интеррактивных лекций")

# Добавьте это перед определением роутеров
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
main_api_router = APIRouter()  #Главный роутер, который собирает в себе все остальные роутеры

main_api_router.include_router(user_router, prefix="/user", tags=["user"])  #Передаем юзер роутер в главный роутер, с префиксом /user, дающим доступ к create_user
main_api_router.include_router(login_router, prefix="/login", tags=["login"])
app.include_router(main_api_router)  #Передаю в приложение роуты


@app.get("/")
def read_root():
    return {"message": "Добро пожаловать в API!"}  # Произвольный ответ


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
    #uvicorn.run(app, host="0.0.0.0", port=8000)

