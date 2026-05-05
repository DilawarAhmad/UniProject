from django.urls import path
from .views import generate_roadmap

urlpatterns = [
    path("generate-roadmap/", generate_roadmap),
]