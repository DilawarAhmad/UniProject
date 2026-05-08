from django.urls import path
from .views import generate_roadmap, generate_resources

urlpatterns = [
    path("generate-roadmap/", generate_roadmap),
    path("generate-resources/",generate_resources)
]