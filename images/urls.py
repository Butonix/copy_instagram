from django.conf.urls import url
from . import views

# url은 3가지로 이루어져있다.
# 1) regular expression
# 2) view
# 3) function

urlpatterns = [
    url(
        regex=r'^all/$',
        view=views.ListAllImages.as_view(),
        name='all_images'
    ),
    url(
        regex=r'^comments/$',
        view=views.ListAllComment.as_view(),
        name='all_coments'
    ),
    url(
        regex=r'^likes/$',
        view=views.ListAllLike.as_view(),
        name='all_likes'
    )
]
