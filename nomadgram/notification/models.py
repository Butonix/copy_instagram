from django.db import models
from nomadgram.users import models as user_models
from images import models as image_models



class Notification(image_models.TimeStampedModel):

    TYPE_CHOICES = (
        ('like', 'Like'),
        ('comment', 'Comment'),
        ('follow','Follow')
    )

    # 같은 모델 내 두 개의 외래 키를 만들 때, 구분이 필요함.. -> related_name 사용
    creator = models.ForeignKey(user_models.User, related_name='creator')
    to = models.ForeignKey(user_models.User, related_name='to')    
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES)

    # 좋아요, 코멘트 시 이미지가 있어야 하는데,
    # 팔로우의 경우는 이미지가 없다.. 어떻게 해야할까??
    # 그냥 필수라고 안하면 된다..
    image = models.ForeignKey(image_models.Image, null=True, blank=True)
    comment = models.TextField(null=True, blank=True)

    def __str__(self):
        return 'From: {} - To: {}'.format(self.creator, self.to)

    class Meta:
        ordering = ['-created_at']