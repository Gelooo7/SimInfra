import base64
from django.conf import settings

def _get_key_bytes():
    # Obtiene una clave binaria derivada de la SECRET_KEY de Django
    key = getattr(settings, 'SECRET_KEY', 'siminfra_secret_key_2026')
    return key.encode('utf-8')

def encrypt_val(value: str) -> str:
    """Encripta texto plano a una cadena Base64 no legible."""
    if not value or value.startswith('ENC::'):
        return value
    key_bytes = _get_key_bytes()
    val_bytes = value.encode('utf-8')
    encrypted = bytes([b ^ key_bytes[i % len(key_bytes)] for i, b in enumerate(val_bytes)])
    return 'ENC::' + base64.b64encode(encrypted).decode('utf-8')

def decrypt_val(value: str) -> str:
    """Desencripta la cadena Base64 a texto plano para el admin."""
    if not value or not value.startswith('ENC::'):
        return value
    try:
        raw_b64 = value.replace('ENC::', '')
        encrypted_bytes = base64.b64decode(raw_b64.encode('utf-8'))
        key_bytes = _get_key_bytes()
        decrypted = bytes([b ^ key_bytes[i % len(key_bytes)] for i, b in enumerate(encrypted_bytes)])
        return decrypted.decode('utf-8')
    except Exception:
        return value