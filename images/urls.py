from django.conf.urls import url
from . import views

# url은 3가지로 이루어져있다.
# 1) regular expression
# 2) view
# 3) function

urlpatterns = [
    url(
        regex=r'^$',
        view=views.Feed.as_view(),
        name='feed'
    ),
    url(
        regex=r'^(?P<image_id>[0-9]+)/like/',
        view=views.LikeImage.as_view(),
        name='like_image'
    ),
    url(
        regex=r'^(?P<image_id>[0-9]+)/comments/',
        view=views.CommentOnImage.as_view(),
        name='like_image'
    ),
    url(
        regex=r'comments/(?P<comment_id>[0-9]+)/$',
        view=views.Comment.as_view(),
        name='comment'
    ),
]
