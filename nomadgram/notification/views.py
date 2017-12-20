from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . import models, serializers



class Notifications(APIView):

    # 나에게 온 알림을 조회한다.
    def get(self, request, format=None):

        user = request.user

        notifications = models.Notification.objects.filter(to=user)

        serializer = serializers.NotificationSerializer(notifications, many=True)

        return Response(data=serializer.data, status=status.HTTP_200_OK)


# Notification Create 작업은 API View로 만들지 않는다.
# 왜냐하면 어떤 동작(좋아요, 코멘트, 팔로우)에 의해서 추가로 동작될 뿐이니까...
# 외부에서 동작될 필요가 없다.
def create_notification(creator, to, type, image = None, comment = None):

    notification = models.Notification.objects.create( 
        creator=creator,
        to=to,
        notification_type=type,
        image=image,
        comment=comment
    )

    notification.save()