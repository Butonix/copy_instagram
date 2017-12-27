from rest_framework import serializers
from . import models
from nomadgram.users import models as user_model
from taggit_serializer.serializers import (TagListSerializerField,TaggitSerializer)

class SmallImageSerializer(serializers.ModelSerializer):

    """ Used for the notification """

    class Meta:
        model = models.Image
        fields = (
            'file',
        )



class UserProfileImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Image
        fields = (
            'id',
            'file',
            'comment_count',
            'like_count',
        )

class FeedUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = user_model.User
        fields = (
            'username',
            'profile_image'
        )


class CommentSerializer(serializers.ModelSerializer):

    # 각각 원하는 아이디로 유저를 생성할 수 없다.
    # 따라서 read_only 속성을 부여한다.
    creator = FeedUserSerializer(read_only=True)

    class Meta:
        model = models.Comment
        fields = (
            'id',
            'message',
            'creator',
        )


class LikeSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Like
        fields = '__all__'


class ImageSerializer(TaggitSerializer, serializers.ModelSerializer):

    comments = CommentSerializer(many=True)
    creator = FeedUserSerializer()
    tags = TagListSerializerField()

    # view에서 context를 받아와서 사용하는 시리얼라이저 메소드 필드
    # 특정 함수를 정의해야만 사용 가능하다.
    is_liked = serializers.SerializerMethodField()

    class Meta: # meta 클래스는 configuration class!
        model = models.Image
        fields = (
            'id',
            'file',
            'location',
            'caption',
            'comments',
            'like_count',
            'creator',
            'tags',
            'natural_time',
            'is_liked'
        )

    # obj는 시이럴라이즈하고 json으로 변환할 목적 객체를 의미한다.(여기서는 이미지
    def get_is_liked(self, obj):
        
        if 'request' in self.context:
            request = self.context['request']

            try:
                models.Like.objects.get(creator__id=request.user.id, image__id=obj.id)    
                return True
            except models.Like.DoesNotExist:
                return False
        
        else:
            return False

class InputImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Image
        fields = (
            'file',
            'location',
            'caption',
        )
