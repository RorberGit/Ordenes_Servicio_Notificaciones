from .create import ObraCreateView
from .update import ObraUpdateView
from .delete import ObraDeleteView
from .getone import ObraGetOneView
from .getall import ObraGetAllView
from .getall_paginated import ObraGetAllPaginatedView

__all__ = ['ObraCreateView', 'ObraUpdateView', 'ObraDeleteView',
           'ObraGetOneView', 'ObraGetAllView', 'ObraGetAllPaginatedView']
