from django.urls import path
from .views import ChatAPIView, ChatHistoryAPIView,ConversationAPIView,ConversationListAPIView
urlpatterns = [

    path(
        "chat/",
        ChatAPIView.as_view()
    ),

    path(
        "chat/history/<int:conversation_id>/",
        ChatHistoryAPIView.as_view()
    ),

    path(
        "conversations/",
        ConversationAPIView.as_view()
    ),

    path(
        "conversations/<str:user_id>/",
        ConversationListAPIView.as_view()
    ),
]