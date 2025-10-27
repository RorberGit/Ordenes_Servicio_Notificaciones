class ApiResponse:
    """
    Clase para estandarizar las respuestas de la API.
    """
    def __init__(self, success=True, message="", data=None, status_code=200):
        self.success = success
        self.message = message
        self.data = data
        self.status_code = status_code

    def to_dict(self):
        """
        Convierte la respuesta a un diccionario.
        """
        return {
            'success': self.success,
            'message': self.message,
            'data': self.data
        }