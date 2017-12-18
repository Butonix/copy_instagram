from django.contrib import admin
from . import models



@admin.register(models.Image)
class ImageAdmin(admin.ModelAdmin):
    
    # 어드민에서 필드 클릭했을 때, 편집모드 들어가는 것
    list_display_links = (
        'location',
    )

    # 어드민에서 검색할 수 있는 컴포넌트 추가
    search_fields = (
        'location',
        'caption',
    )

    # 어드민에서 해당 컬럼으로 필터링 할 수 있는 컴포넌트 추가
    list_filter = (
        'location',
    )

    list_display = (
        'file',
        'location',
        'caption',
        'creator',
        'created_at',
        'updated_at',
    )


@admin.register(models.Like)
class LikeAdmin(admin.ModelAdmin):
   
   list_display = (
       'creator',
       'image',
       'created_at',
       'updated_at',
   )


@admin.register(models.Comment)
class CommentAdmin(admin.ModelAdmin):

    list_display = (
        'message',
        'creator',
        'image',
        'created_at',
        'updated_at',
    )


