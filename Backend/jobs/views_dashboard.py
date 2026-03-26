from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import SavedJob, AppliedJob
from .serializers import SavedJobSerializer, AppliedJobSerializer


# 🔥 SAVE JOB
@api_view(["POST"])
def save_job(request, user_id):

    data = request.data

    job, created = SavedJob.objects.get_or_create(
        user_id=user_id,
        link=data.get("link"),
        defaults={
            "title": data.get("title"),
            "company": data.get("company"),
            "location": data.get("location"),
        }
    )

    return Response({
        "message": "Job saved",
        "created": created
    })


# 🔥 DELETE SAVED JOB
@api_view(["DELETE"])
def delete_saved_job(request, user_id):

    link = request.data.get("link")

    if not link:
        return Response({"error": "link required"}, status=400)

    deleted, _ = SavedJob.objects.filter(
        user_id=user_id,
        link=link
    ).delete()

    return Response({
        "message": "Job removed" if deleted else "Job not found"
    })


# 🔥 GET SAVED JOBS
@api_view(["GET"])
def get_saved_jobs(request, user_id):

    jobs = SavedJob.objects.filter(user_id=user_id)
    serializer = SavedJobSerializer(jobs, many=True)

    return Response(serializer.data)


# 🔥 APPLY JOB (NO DUPLICATES)
@api_view(["POST"])
def apply_job(request, user_id):

    data = request.data

    job, created = AppliedJob.objects.get_or_create(
        user_id=user_id,
        link=data.get("link"),
        defaults={
            "title": data.get("title"),
            "company": data.get("company"),
        }
    )

    return Response({
        "message": "Applied successfully",
        "created": created
    })


# 🔥 UPDATE JOB STATUS
@api_view(["PUT"])
def update_job_status(request, user_id):

    link = request.data.get("link")
    status_value = request.data.get("status")

    job = AppliedJob.objects.filter(
        user_id=user_id,
        link=link
    ).first()

    if not job:
        return Response({"error": "Job not found"}, status=404)

    job.status = status_value
    job.save()

    return Response({"message": "Status updated"})


# 🔥 DELETE APPLIED JOB
@api_view(["DELETE"])
def delete_applied_job(request, user_id):

    link = request.data.get("link")

    deleted, _ = AppliedJob.objects.filter(
        user_id=user_id,
        link=link
    ).delete()

    return Response({
        "message": "Removed" if deleted else "Not found"
    })


# 🔥 GET APPLIED JOBS
@api_view(["GET"])
def get_applied_jobs(request, user_id):

    jobs = AppliedJob.objects.filter(user_id=user_id)
    serializer = AppliedJobSerializer(jobs, many=True)

    return Response(serializer.data)