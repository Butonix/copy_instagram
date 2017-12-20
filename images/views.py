from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . import models, serializers
from nomadgram.notification import views as notification_views



class Feed(APIView):

    # 내가 팔로잉하는 유저들의 피드를 받는 것.
    # 피드는 사람에 상관없이 모든 사람들의 사진이 최신순으로 정렬되어야 한다.
    def get(self, request, format=None):

        user = request.user
        
        following_users = user.following.all()

        image_list = []

        # 내가 팔로잉하는 유저의 이미지를 가져올 것이다.
        # 그런데 유저에는 이미지 필드가 없다.
        # 이럴 때는? Set을 이용한다!
        # 이미지는 user모델을 외래키로 참조한다. related_name을 통해 set을 참조하면 된다.
        for following_user in following_users:

            # [:2]의 의미는 배열의 원소 중 2개만 가져온다는 뜻, 파이썬 기본 문법임
            user_images = following_user.images.all()[:2]

            # 팔로잉 유저의 이미지를 배열에 넣는다.
            for image in user_images:
                image_list.append(image)

        # 여기까지해서 출력했을 때, 팔로잉 유저의 이미지를 최신순으로 순서대로 삽입된 배열을 볼 수 있다.
        # 실제로는 사람에 관계없이 오로지 이미지 자체가 최신순으로 정렬되어 있어야한다.
        # 아래는 key를 기준으로 정렬을 수행한다.
        sorted_list = sorted(image_list, key=lambda image: image.created_at, reverse=True)

        serializer = serializers.ImageSerializer(sorted_list, many=True)

        return Response(status=status.HTTP_201_CREATED, data=serializer.data)


class LikeImage(APIView):

    def post(self, request, image_id, format=None):
        
        user = request.user

        try:
            found_image = models.Image.objects.get(id=image_id)
        except models.Image.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        try:
            preexisting_like = models.Like.objects.get(
                creator= user,
                image= found_image
            )

            return Response(status=status.HTTP_304_NOT_MODIFIED)

        except models.Like.DoesNotExist:
            new_like = models.Like.objects.create(
                  creator=user,
                  image=found_image
             )
            
            new_like.save()

            notification_views.create_notification(user, found_image.creator, 'like', found_image)

            return Response(status=status.HTTP_201_CREATED)


class UnLikeImage(APIView):

    def delete(self, request, image_id, format=None):

        user = request.user

        try:
            found_image = models.Image.objects.get(id=image_id)
        except models.Image.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND) 

        try:
            preexisting_like = models.Like.objects.get(
                creator= user,
                image= found_image
            )

            preexisting_like.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        except models.Like.DoesNotExist:
            return Response(status=status.HTTP_304_NOT_MODIFIED)

class CommentOnImage(APIView):

    def post(self, request, image_id, format=None):

        user = request.user
        print(user)

        try:
            found_image = models.Image.objects.get(id=image_id)
        except models.Image.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # serializer는 현재 message 데이터만 받았다.
        # creator가 없으면 is_valid에서 오류가 발생한다.
        # 그렇기에 creator속성을 read_only로 제한하여 무시?하도록 한다.
        # 위 부분은 더 알아봐야할 듯 하다.
        serializer = serializers.CommentSerializer(data=request.data)
        
        if serializer.is_valid():
          
            serializer.save(creator=user, image=found_image)
          
            notification_views.create_notification(user, found_image.creator, 'comment', found_image, serializer.data['message'])

            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
       
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_201_CREATED)


class Comment(APIView):

    def delete(self, request, comment_id, format=None):

        user = request.user

        try:
            found_comment = models.Comment.objects.get(id=comment_id, creator=user)
            found_comment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except models.Comment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class Search(APIView):

    def get(self, request, format=None):
        
        hashtags = request.query_params.get('hashtags', None)

        if hashtags is not None:

            hashtags = hashtags.split(",")

            images = models.Image.objects.filter(tags__name__in=hashtags).distinct()

            # 필요한 데이터 형태가 UserProfileImage와 같기 때문에 해당 시리얼라이저를 사용했다.
            serializer = serializers.UserProfileImageSerializer(images, many=True)

            return Response(data=serializer.data, status=status.HTTP_200_OK)

        else:

            return Response(status=status.HTTP_400_BAD_REQUEST)


class ModerateComments(APIView):



    def delete(self, request, image_id, comment_id, format=None):

        """ delete a comment on my image """

        user = request.user

        try:
            comment_to_delete = models.Comment.objects.get(id=comment_id, image__id=image_id, image__creator=user)
            comment_to_delete.delete()
        except models.Comment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_204_NO_CONTENT)


