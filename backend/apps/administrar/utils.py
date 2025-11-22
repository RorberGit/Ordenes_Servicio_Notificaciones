# admin_module/utils.py

# , AUTH_SIMPLE
from ldap3 import Server, Connection
from ldap3.core.exceptions import LDAPBindError
from django.conf import settings
import logging

logger = logging.getLogger(
    'apps.administrar')


def create_ldap_server():
    """Crea una instancia de Server con la configuración de settings."""
    return Server(
        settings.LDAP_SERVER,
        port=settings.LDAP_PORT,
        use_ssl=settings.LDAP_USE_TLS
    )


def authenticate_ldap_user(username, password):
    """
    Intenta autenticar un usuario contra el servidor LDAP.
    Retorna atributos si es exitoso, un código de error si falla.
    """
    server = create_ldap_server()
    ldap_username_attr = settings.LDAP_USERNAME_ATTR

    # --- 1. Búsqueda del DN del usuario (usando la cuenta de servicio) ---
    try:
        logger.debug(
            f"Conectando al servidor LDAP: {server}")

        bind_conn = Connection(
            server,
            user=settings.LDAP_BIND_USER,
            password=settings.LDAP_BIND_PASSWORD,
            auto_bind=True
        )

        search_filter = f'({ldap_username_attr}={username})'
        logger.debug(
            f"Buscando usuario con filtro: {search_filter}")

        bind_conn.search(
            search_base=settings.LDAP_USERS_DN,
            search_filter=search_filter,
            attributes=[ldap_username_attr, settings.LDAP_FULLNAME_ATTR,
                        settings.LDAP_EMAIL_ATTR]
        )

        if not bind_conn.entries:
            logger.warning(
                f"Usuario '{username}' no encontrado en LDAP")
            return 'USER_NOT_FOUND'

        user_entry = bind_conn.entries[0]
        user_dn = str(
            user_entry.entry_dn)
        user_attributes = user_entry.entry_attributes_as_dict
        logger.debug(
            f"Usuario encontrado: DN={user_dn}")
        bind_conn.unbind()

    except LDAPBindError as e:
        logger.error(
            f"Error de bind con cuenta de servicio: {str(e)}")
        return 'BIND_ERROR'
    except Exception as e:
        logger.error(
            f"Error general en búsqueda LDAP: {str(e)}")
        return 'LDAP_ERROR'

    # --- 2. Intentar autenticación con las credenciales del usuario ---
    try:
        logger.debug(
            f"Intentando autenticar usuario con DN: {user_dn}")
        pwd_mask = '*' * \
            len(password) if password else 'None'
        logger.debug(
            f"Usuario: {username}, Contraseña proporcionada: {pwd_mask}")

        user_conn = Connection(
            server,
            user=user_dn,
            password=password,
            auto_bind=True
        )
        user_conn.unbind()
        logger.info(
            f"Autenticación exitosa para usuario: {username}")

        # Éxito: Retorna los atributos
        return {
            'username': user_attributes.get(ldap_username_attr, [''])[0],
            'full_name': user_attributes.get(settings.LDAP_FULLNAME_ATTR, [''])[0],
            'email': user_attributes.get(settings.LDAP_EMAIL_ATTR, [''])[0],
        }

    except LDAPBindError as e:
        logger.warning(
            f"LDAPBindError para usuario '{username}' (DN: {user_dn}): {str(e)}")
        logger.warning(
            f"Detalles del error: {e.__dict__ if hasattr(e, '__dict__') else 'No details'}")
        logger.warning(
            f"LDAPBindError: {e}")
        logger.warning(
            f"Respuesta del servidor: {getattr(e, 'message', 'sin mensaje')}")
        return 'INVALID_PASSWORD'
    except Exception as e:
        logger.error(
            f"Error general en autenticación LDAP para '{username}' (DN: {user_dn}): {str(e)}")
        logger.error(
            f"Tipo de excepción: {type(e).__name__}")
        return 'LDAP_ERROR'


def search_ldap_users():
    """Busca y retorna una lista de todos los usuarios de LDAP (para el Administrador)."""
    server = create_ldap_server()
    users_list = []

    try:
        logger.debug(
            "Buscando lista de usuarios LDAP")
        conn = Connection(
            server,
            user=settings.LDAP_BIND_USER,
            password=settings.LDAP_BIND_PASSWORD,
            auto_bind=True
        )

        search_filter = f'({settings.LDAP_USERNAME_ATTR}=*)'
        ldap_attrs = [settings.LDAP_USERNAME_ATTR,
                      settings.LDAP_FULLNAME_ATTR, settings.LDAP_EMAIL_ATTR]

        conn.search(
            search_base=settings.LDAP_USERS_DN,
            search_filter=search_filter,
            attributes=ldap_attrs
        )

        logger.debug(
            f"Encontrados {len(conn.entries)} usuarios en LDAP")
        for entry in conn.entries:
            attrs = entry.entry_attributes_as_dict

            # Asegurarse de decodificar y manejar listas de un solo elemento
            users_list.append({
                'username': attrs.get(settings.LDAP_USERNAME_ATTR, [''])[0],
                'full_name': attrs.get(settings.LDAP_FULLNAME_ATTR, [''])[0],
                'email': attrs.get(settings.LDAP_EMAIL_ATTR, [''])[0],
            })

        conn.unbind()
        return users_list

    except Exception as e:
        logger.error(
            f"Error al buscar usuarios LDAP: {str(e)}")
        return []
