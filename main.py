from fastapi import FastAPI
import uvicorn
from fastapi.routing import APIRouter


from api.handlers import user_router
from api.login_handler import login_router
    
#####################
# Блок с API путями #
#####################


app = FastAPI(title="Платформа интеррактивных лекций")


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

