from rest_framework.views import APIView
from rest_framework.response import Response

from .models import ChatMessage
from skills.models import Skill
from roadmap.models import SavedRoadmap
class ChatHistoryAPIView(APIView):

    def get(self, request, user_id):

        messages = ChatMessage.objects.filter(
            user_id=user_id
        )

        data = []

        for message in messages:

            data.append({
                "sender":
                    "user"
                    if message.role == "user"
                    else "bot",

                "text":
                    message.content
            })

        return Response({
            "messages": data
        })
def build_user_context(user_id):
    skills = Skill.objects.filter(
        user_id=user_id
    )

    skill_names = [
        skill.name
        for skill in skills
    ]
    roadmaps = SavedRoadmap.objects.filter(
        user_id=user_id
    )
    roadmap_data = []

    for roadmap in roadmaps:

        total_steps = len(
            roadmap.steps
        )

        completed_steps = len(
            roadmap.completed_steps
        )

        progress = 0

        if total_steps > 0:

            progress = int(
                completed_steps /
                total_steps * 100
            )

        roadmap_data.append({
            "title":
                roadmap.title,

            "progress":
                progress
        })
    history = ChatMessage.objects.filter(
        user_id=user_id
        ).order_by("-created_at")[:20]
    conversation = []

    for message in reversed(history):

        conversation.append({
            "role":
                message.role,

            "content":
                message.content
        })
    return {

    "skills":
        skill_names,

    "roadmaps":
        roadmap_data,

    "history":
        conversation
    }

import requests

from rest_framework.views import APIView
from rest_framework.response import Response

from .models import ChatMessage


class ChatAPIView(APIView):

    def post(self, request):

        user_id = request.data.get(
            "user_id"
        )
        name = request.data.get("name")
        n8n_url = "https://adil11.app.n8n.cloud/webhook/28481d02-be2c-4c6a-aa33-b9d620256239"
        message = request.data.get(
            "message"
        )
        if not user_id:

            return Response(
                {
                    "error":
                    "user_id required"
                },
                status=400
            )

        if not message:

            return Response(
                {
                    "error":
                    "message required"
                },
                status=400
            )
        ChatMessage.objects.create(
            user_id=user_id,
            role="user",
            content=message
        )

        context = build_user_context(
            user_id
        )

        payload = {

            "user_id":
                user_id,
            "name": name,

            "message":
                message,

            "skills":
                context["skills"],

            "roadmaps":
                context["roadmaps"],

            "history":
                context["history"]
        }

        # later send payload to n8n
        print("payload",payload)
        response = requests.post(
            n8n_url,
            json=payload
        )
        data = response.json()

        print("JSON:", data)
        ai_reply = data.get(
            "reply",
            "No reply returned"
        )
        ChatMessage.objects.create(
            user_id=user_id,
            role="assistant",
            content=ai_reply
        )

        return Response({
            "reply": ai_reply,
        })