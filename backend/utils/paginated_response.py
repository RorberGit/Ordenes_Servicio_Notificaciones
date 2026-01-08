def build_paginated_response(paginator, request, serializer_data):
    return {
        "results": serializer_data,
        "pagination": {
            "count": paginator.page.paginator.count,
            "page": paginator.page.number,
            "page_size": paginator.get_page_size(request),
            "total_pages": paginator.page.paginator.num_pages,
            "next": paginator.get_next_link(),
            "previous": paginator.get_previous_link(),
        }
    }
