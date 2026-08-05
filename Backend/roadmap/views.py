# views.py
from .validators import is_computer_science_query
from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
import json
from .models import SavedRoadmap
from .roadmap_graph import roadmap_graph

from .resource_graph import resource_graph


# =========================================================
# ROADMAP API
# =========================================================

@csrf_exempt
def generate_roadmap(request):

    try:
        data = json.loads(request.body)

        query = data.get("query", "").strip()

        print("User Query:", query)
        print("Validation:", is_computer_science_query(query))

        if not query:
            return JsonResponse({
                "success": False,
                "error": "Query cannot be empty."
            }, status=400)

        if not is_computer_science_query(query):
            return JsonResponse({
                "success": False,
                "error": "Invalid query. Please enter a Computer Science or IT-related topic."
            }, status=400)

        result = roadmap_graph.invoke({
            "query": query
        })

        return JsonResponse({
            "success": True,
            "roadmap": result["enhanced_roadmap"]
        })

    except Exception as e:
        return JsonResponse({
            "success": False,
            "error": str(e)
        }, status=500)

# views.py

@csrf_exempt
def generate_resources(request):

    try:

        data = json.loads(request.body)

        roadmap = data.get("roadmap", "")

        result = resource_graph.invoke({

            "enhanced_roadmap": roadmap
        })

        return JsonResponse({

            "success": True,

            "resources": result["resources"]

        })

    except Exception as e:

        return JsonResponse({

            "success": False,

            "error": str(e)

        }, status=500)
    


# views.py
@csrf_exempt
def save_roadmap(request):

    try:

        data = json.loads(request.body)
        print("data",data)
        user_id = data.get("user_id")
        if not user_id:
            return JsonResponse({
                "success": False,
                "error": "user_id required"
            }, status=400)
        title = data.get("title")

        query = data.get("query")

        roadmap = data.get("roadmap")

        steps = data.get("steps", [])

        resources = data.get("resources", [])


        # =====================================================
        # CHECK IF ALREADY SAVED
        # =====================================================

        existing = SavedRoadmap.objects.filter(
            user_id=user_id,

            query=query,

            roadmap=roadmap

        ).first()


        if existing:
            print("already exists")
            return JsonResponse({

                "success": True,

                "already_saved": True,

                "message": "Roadmap already saved",

                "id": existing.id
            })


        # =====================================================
        # CREATE NEW ROADMAP
        # =====================================================

        
        saved = SavedRoadmap.objects.create(

            user_id=user_id,

            title=title,

            query=query,

            roadmap=roadmap,

            steps=steps,

            resources=resources,

            completed_steps=[]
        )

        return JsonResponse({

            "success": True,

            "already_saved": False,

            "message": "Roadmap saved successfully",

            "id": saved.id
        })

    except Exception as e:

        return JsonResponse({

            "success": False,

            "error": str(e)

        }, status=500)

@csrf_exempt
def get_saved_roadmaps(request):

    try:

        user_id = request.GET.get(
            "user_id"
        )
        if not user_id:
            return JsonResponse({
                "success": False,
                "error": "user_id required"
            }, status=400)

        roadmaps = SavedRoadmap.objects.filter(
            user_id=user_id
        ).order_by("-created_at")
        data = []

        for roadmap in roadmaps:

            total_steps = len(roadmap.steps)

            completed = len(roadmap.completed_steps)

            progress = 0

            if total_steps > 0:

                progress = int(
                    (completed / total_steps) * 100
                )

            data.append({

                "id": roadmap.id,

                "title": roadmap.title,

                "query": roadmap.query,

                "roadmap": roadmap.roadmap,

                "steps": roadmap.steps,

                "resources": roadmap.resources,

                "completed_steps": roadmap.completed_steps,

                "progress": progress,

                "created_at": roadmap.created_at
            })

        return JsonResponse({

            "success": True,

            "roadmaps": data
        })

    except Exception as e:

        return JsonResponse({

            "success": False,

            "error": str(e)

        }, status=500)
@csrf_exempt

def toggle_step(request, roadmap_id):

    try:

        data = json.loads(request.body)

        step = data.get("step")

        user_id = data.get("user_id")
        if not user_id:
            return JsonResponse({
                "success": False,
                "error": "user_id required"
            }, status=400)
        roadmap = get_object_or_404(
            SavedRoadmap,
            id=roadmap_id,
            user_id=user_id
        )
        completed = roadmap.completed_steps


        if step in completed:

            completed.remove(step)

        else:

            completed.append(step)


        roadmap.completed_steps = completed

        roadmap.save()


        return JsonResponse({

            "success": True,

            "completed_steps": completed
        })

    except Exception as e:

        return JsonResponse({

            "success": False,

            "error": str(e)

        }, status=500)
    

@csrf_exempt
def delete_roadmap(request, roadmap_id):

    try:

        user_id = request.GET.get(
            "user_id"
        )
        if not user_id:
            return JsonResponse({
                "success": False,
                "error": "user_id required"
            }, status=400)
        roadmap = get_object_or_404(
            SavedRoadmap,
            id=roadmap_id,
            user_id=user_id
        )
        roadmap.delete()

        return JsonResponse({

            "success": True
        })

    except Exception as e:

        return JsonResponse({

            "success": False,

            "error": str(e)

        }, status=500)