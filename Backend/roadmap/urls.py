from django.urls import path
from .views import generate_roadmap, generate_resources,save_roadmap,get_saved_roadmaps,toggle_step,delete_roadmap

urlpatterns = [
    path("generate-roadmap/", generate_roadmap),
    path("generate-resources/",generate_resources),
    path("save-roadmap/", save_roadmap),
    path("saved-roadmaps/", get_saved_roadmaps),
    path("toggle-step/<int:roadmap_id>/", toggle_step),
    path("delete-roadmap/<int:roadmap_id>/",delete_roadmap)
]