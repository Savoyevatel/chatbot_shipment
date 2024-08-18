from django.urls import path
from base.views import chat_views as views

urlpatterns = [
    path('chat-with-db/', views.chat_with_db, name='chat_with_db'),
    path('chart-with-db/', views.chart_with_db, name= 'chart_with_db'),
]
