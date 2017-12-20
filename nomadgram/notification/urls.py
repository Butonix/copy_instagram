from django.conf.urls import url
from . import views

# url은 3가지로 이루어져있다.
# 1) regular expression
# 2) view
# 3) function

# notifications/

urlpatterns = [
    url(
        regex=r'^$',
        view=views.Notifications.as_view(),
        name='notification'
    ),
   
]
