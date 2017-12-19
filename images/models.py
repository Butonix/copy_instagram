from django.db import models
from nomadgram.users import models as user_models

class TimeStampedModel(models.Model):

    created_at = models.DateTimeField(auto_now_add=True) # 최초 생성시 ADD
    updated_at = models.DateTimeField(auto_now=True) # 갱신시 자동 변경

    class Meta:
        abstract = True # 이 클래스는 abstract 클래스라고 명시한다.


class Image(TimeStampedModel):

    """ Image Model """

    file = models.ImageField()
    location = models.CharField(max_length=140)
    caption = models.TextField()
    creator = models.ForeignKey(user_models.User, related_name='images')

    @property
    def like_count(self):
        return self.likes.all().count

    def __str__(self):
        return '{} - {}'.format(self.location, self.caption)

    class Meta:
        ordering = ['-created_at']

class Comment(TimeStampedModel):

    """ Comment Model """

    message = models.TextField()
    creator = models.ForeignKey(user_models.User)
    image = models.ForeignKey(Image, related_name='comments')

    def __str__(self):
        return self.message


class Like(TimeStampedModel):

    """ Like Model """
    
    creator = models.ForeignKey(user_models.User)
    image = models.ForeignKey(Image, related_name='likes')

    def __str__(self):
        return '{} - {}'.format(self.creator.username, self.image.caption)
