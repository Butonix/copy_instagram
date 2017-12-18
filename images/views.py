from rest_framework.views import APIView
from rest_framework.response import Response
from . import models, serializers


# 1만개의 사진이 있을 때, 이것을 전부가져오는 API를 만들면, 서버가 뻗는다.
# 실제로는 이런 API를 만들고 제공하지 않는다!!!!!!!!!
class ListAllImages(APIView):

    # format은 json, xml 등이 올 수 있고, 지금은 테스트라서 NONE으로 설정함.
    def get(self, request, format=None):

        all_images = models.Image.objects.all()

        serializer = serializers.ImageSerializer(all_images, many=True)

        return Response(data=serializer.data)


class ListAllComment(APIView):

    def get(self, request, format=None):

        all_comments = models.Comment.objects.all()

        serializer = serializers.CommentSerializer(all_comments, many=True)

        return Response(data=serializer.data)


class ListAllLike(APIView):

    def get(self, request, format=None):

        all_likes = models.Like.objects.all()

        serializer = serializers.LikeSerializer(all_likes, many=True)

        return Response(data=serializer.data)
