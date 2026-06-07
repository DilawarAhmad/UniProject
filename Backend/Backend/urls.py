from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
    path("api/jobs/", include("jobs.urls")),
    path("api/roadmap/", include("roadmap.urls")),
    path("api/chatbot/",include("chatbot.urls"))
]
