from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# это объект конфигурации Alembic, который предоставляет
# доступ к значениям в используемом .ini файле.
config = context.config

# Интерпретируем конфигурационный файл для Python логирования.
# Эта строка настраивает логгеры.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# добавьте объект MetaData вашей модели здесь
# для поддержки 'autogenerate'

from main import Base                   # Импортируйте ваш базовый класс моделей
target_metadata = Base.metadata         # Убедитесь, что эта строка не закомментирована
# target_metadata = None  # Удалите или закомментируйте эту строку

# другие значения из конфигурации, определенные в соответствии с потребностями env.py,
# могут быть получены:
# my_important_option = config.get_main_option("my_important_option")
# ... и т.д.


def run_migrations_offline() -> None:
    """Запустите миграции в 'офлайн' режиме.

    Это настраивает контекст только с URL
    и не с Engine, хотя Engine также приемлем
    здесь. Пропуская создание Engine,
    нам даже не нужен доступ к DBAPI.

    Вызовы context.execute() здесь выводят данную строку в
    выходной скрипт.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Запустите миграции в 'онлайн' режиме.

    В этом сценарии нам нужно создать Engine
    и ассоциировать соединение с контекстом.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()