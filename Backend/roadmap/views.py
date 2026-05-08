# views.py

from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt

import json

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