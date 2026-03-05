from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')

    def __str__(self):
        return self.name

class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='tasks')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_tasks')
    shared_with = models.ManyToManyField(User, blank=True, related_name='shared_tasks')
    external_quote = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title