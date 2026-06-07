from django.urls import path
from .views import ChatAPIView, ChatHistoryAPIView
urlpatterns = [

    path(
        "chat/",
        ChatAPIView.as_view()
    ),

    path(
        "chat/history/<str:user_id>/",
        ChatHistoryAPIView.as_view()
    ),
]