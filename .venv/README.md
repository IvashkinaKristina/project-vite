Для накатывания миграций, если файла alembic.ini еще нет, нужно запустить в терминале команду:
....
alembic init migrations
....


После этого будет создана папка с миграциями и конфигурационный файл для алембика.

В alembic.ini нужно задать адрес базы данных, в которую будем катать миграции.
Дальше идем в папку с миграциями и открываем env.py, там вносим изменения в блок где написанро
....
from myapp inport mymodel
....


Дальше вводим: ''''''
Будет создана миграция 
Дальше вводим: '''alembic upgrade heads'''


Запуск приложения: '''uvicorn main:app --reload'''

alembic revision --autogenerate -m "app pass column"

http://127.0.0.1:8000/docs
alembic revision --autogenerate -m "add roles"