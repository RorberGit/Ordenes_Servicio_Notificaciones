
from rest_framework.pagination import PageNumberPagination


class Pagination(PageNumberPagination):
    # Número de registros por página
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
