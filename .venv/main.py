from fastapi import FastAPI
import uvicorn
from fastapi.routing import APIRouter


from api.handlers import user_router

    
#####################
# Блок с API путями #
#####################


app = FastAPI(title="Платформа интеррактивных лекций")


main_api_router = APIRouter()  #Главный роутер, который собирает в себе все остальные роутеры

main_api_router.include_router(user_router, prefix="/user", tags=["user"])  #Передаем юзер роутер в главный роутер, с префиксом /user, дающим доступ к create_user
app.include_router(main_api_router)  #Передаю в приложение роуты


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)