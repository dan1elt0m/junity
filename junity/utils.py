def str_to_bool(value: str) -> bool:
    if value:
        return value.lower() in ('true', '1', 't', 'y', 'yes')
